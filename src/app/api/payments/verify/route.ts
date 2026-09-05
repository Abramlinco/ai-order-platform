import { NextRequest, NextResponse } from "next/server";
import { createHash, randomInt } from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const reference = String(body?.reference ?? "").trim();

    if (!reference) {
      return NextResponse.json(
        {
          ok: false,
          error: "PAYMENT_REFERENCE_REQUIRED",
        },
        { status: 400 }
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        {
          ok: false,
          error: "PAYSTACK_SECRET_KEY_NOT_CONFIGURED",
        },
        { status: 500 }
      );
    }

   const payment = await prisma.payment.findFirst({
  where: {
    reference,
  },
  include: {
    quote: {
      include: {
        customer: true,
        items: true,
      },
    },
  },
});

    if (!payment) {
      return NextResponse.json(
        {
          ok: false,
          error: "PAYMENT_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    /*
     * Idempotency:
     * A confirmed payment must never create another order.
     */
    if (payment.status === "Confirmed") {
      return NextResponse.json({
        ok: true,
        message: "Payment already confirmed",
        payment: {
          id: payment.id,
          reference: payment.reference,
          amount: payment.amount,
          status: payment.status,
          confirmedAt: payment.confirmedAt,
        },
      });
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const paystackResult = await response.json();

    if (!response.ok || !paystackResult?.status) {
      return NextResponse.json(
        {
          ok: false,
          error: "PAYSTACK_VERIFICATION_FAILED",
        },
        { status: 502 }
      );
    }

    const transactionStatus = String(
      paystackResult?.data?.status ?? ""
    ).toLowerCase();

    /*
     * Non-successful transactions are recorded locally.
     *
     * abandoned → Abandoned
     * everything else that is not success → Failed
     *
     * No order, invoice, OTP, or stock change occurs here.
     */
    if (transactionStatus !== "success") {
      const localStatus =
        transactionStatus === "abandoned"
          ? "Abandoned"
          : "Failed";

      const updatedPayment = await prisma.payment.update({
        where: {
          id: payment.id,
        },
        data: {
          status: localStatus,
        },
      });

      return NextResponse.json(
        {
          ok: false,
          error: "Payment was not successful",
          status: transactionStatus,
          payment: {
            id: updatedPayment.id,
            reference: updatedPayment.reference,
            amount: updatedPayment.amount,
            status: updatedPayment.status,
          },
        },
        { status: 400 }
      );
    }

    const paystackAmount = Number(paystackResult?.data?.amount);

    if (!Number.isFinite(paystackAmount)) {
      return NextResponse.json(
        {
          ok: false,
          error: "PAYSTACK_AMOUNT_INVALID",
        },
        { status: 502 }
      );
    }

    /*
     * Paystack amounts are returned in the smallest currency unit.
     */
    if (paystackAmount !== payment.amount * 100) {
      return NextResponse.json(
        {
          ok: false,
          error: "PAYMENT_AMOUNT_MISMATCH",
        },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const currentPayment = await tx.payment.findUnique({
        where: {
          id: payment.id,
        },
        include: {
          quote: {
            include: {
              customer: true,
              items: true,
            },
          },
        },
      });

      if (!currentPayment) {
        throw new Error("PAYMENT_NOT_FOUND");
      }

      /*
       * Second idempotency check inside the transaction.
       */
      if (currentPayment.status === "Confirmed") {
        return {
          alreadyConfirmed: true as const,
          payment: currentPayment,
        };
      }

      const quote = currentPayment.quote;

      if (quote.status !== "Accepted") {
        throw new Error("QUOTE_NOT_ACCEPTED");
      }

      if (quote.expiresAt && new Date() > quote.expiresAt) {
        throw new Error("QUOTE_EXPIRED");
      }

      const business = await tx.business.findFirst();

      if (!business) {
        throw new Error("BUSINESS_NOT_FOUND");
      }

      /*
       * Generate a six-digit delivery OTP.
       */
      const otp = randomInt(100000, 1000000).toString();

      const deliveryOtpHash = createHash("sha256")
        .update(otp)
        .digest("hex");

      const deliveryOtpExpiresAt = new Date(
        Date.now() + 24 * 60 * 60 * 1000
      );

      /*
       * Validate and deduct variant stock atomically.
       */
      for (const item of quote.items) {
        if (!item.variantId) {
          throw new Error("VARIANT_REQUIRED_FOR_ORDER_ITEM");
        }

        const variant = await tx.productVariant.findUnique({
          where: {
            id: item.variantId,
          },
        });

        if (!variant) {
          throw new Error("VARIANT_NOT_FOUND");
        }

        if (variant.productId !== item.productId) {
          throw new Error("VARIANT_PRODUCT_MISMATCH");
        }

        const stockUpdate = await tx.productVariant.updateMany({
          where: {
            id: item.variantId,
            stock: {
              gte: item.quantity,
            },
            price: item.unitPrice,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        if (stockUpdate.count !== 1) {
          throw new Error("INSUFFICIENT_STOCK_OR_PRICE_CHANGED");
        }
      }

      const order = await tx.order.create({
        data: {
          customerId: quote.customerId,
          subtotal: quote.subtotal,
          deliveryFee: quote.deliveryFee,
          total: quote.total,
          location: quote.location,
          status: "Confirmed",
          deliveryOtpHash,
          deliveryOtpExpiresAt,

          items: {
            create: quote.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              productName: item.productName,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              subtotal: item.subtotal,
            })),
          },
        },
      });

      const invoiceNumber = `INV-${Date.now()}-${randomInt(
        100000,
        1000000
      )
        .toString(16)
        .toUpperCase()}`;

      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          orderId: order.id,

          businessName: business.name,
          businessPhone: business.phone,
          businessAddress: business.address,

          customerName: quote.customer.name,
          customerPhone: quote.customer.phone,
          customerEmail: quote.customer.email,

          deliveryAddress: quote.location,

          subtotal: quote.subtotal,
          deliveryFee: quote.deliveryFee,
          total: quote.total,
          currency: quote.currency,

          paymentReference: currentPayment.reference,
          paymentStatus: "Confirmed",
        },
      });

      const confirmedPayment = await tx.payment.update({
        where: {
          id: currentPayment.id,
        },
        data: {
          status: "Confirmed",
          confirmedAt: new Date(),
        },
      });

      return {
        alreadyConfirmed: false as const,
        payment: confirmedPayment,
        order,
        invoice,
        deliveryOtp: otp,
      };
    });

    /*
     * Transaction was already completed.
     */
    if (result.alreadyConfirmed) {
      return NextResponse.json({
        ok: true,
        message: "Payment already confirmed",
        payment: {
          id: result.payment.id,
          reference: result.payment.reference,
          amount: result.payment.amount,
          status: result.payment.status,
          confirmedAt: result.payment.confirmedAt,
        },
      });
    }

    /*
     * New successful payment.
     */
    return NextResponse.json({
      ok: true,
      message: "Payment verified and order created successfully",

      payment: {
        id: result.payment.id,
        reference: result.payment.reference,
        amount: result.payment.amount,
        status: result.payment.status,
        confirmedAt: result.payment.confirmedAt,
      },

      order: {
        id: result.order.id,
        status: result.order.status,
        subtotal: result.order.subtotal,
        deliveryFee: result.order.deliveryFee,
        total: result.order.total,
      },

      invoice: {
        id: result.invoice.id,
        invoiceNumber: result.invoice.invoiceNumber,
        businessName: result.invoice.businessName,
        businessPhone: result.invoice.businessPhone,
        businessAddress: result.invoice.businessAddress,
        total: result.invoice.total,
        currency: result.invoice.currency,
        paymentReference: result.invoice.paymentReference,
      },

      /*
       * Development only.
       * Never expose the raw OTP in production.
       */
      deliveryOtp: result.deliveryOtp,
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    const message =
      error instanceof Error ? error.message : "UNKNOWN_ERROR";

    const knownErrors = new Set([
      "PAYMENT_NOT_FOUND",
      "QUOTE_NOT_ACCEPTED",
      "QUOTE_EXPIRED",
      "BUSINESS_NOT_FOUND",
      "VARIANT_REQUIRED_FOR_ORDER_ITEM",
      "VARIANT_NOT_FOUND",
      "VARIANT_PRODUCT_MISMATCH",
      "INSUFFICIENT_STOCK_OR_PRICE_CHANGED",
    ]);

    if (knownErrors.has(message)) {
      return NextResponse.json(
        {
          ok: false,
          error: message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}