import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { quoteId, customerId } = body;

    // ------------------------------------------------------------
    // 1. Validate required fields
    // ------------------------------------------------------------

    if (!quoteId || !customerId) {
      return NextResponse.json(
        {
          ok: false,
          error: "quoteId and customerId are required",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // 2. Check Paystack secret key
    // ------------------------------------------------------------

    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      console.error("PAYSTACK_SECRET_KEY is not configured");

      return NextResponse.json(
        {
          ok: false,
          error: "Payment service is not configured",
        },
        { status: 500 }
      );
    }

    // ------------------------------------------------------------
    // 3. Find quote
    // ------------------------------------------------------------

    const quote = await prisma.quote.findUnique({
      where: {
        id: quoteId,
      },
      include: {
        customer: true,
        items: true,
        payment: true,
      },
    });

    if (!quote) {
      return NextResponse.json(
        {
          ok: false,
          error: "Quote not found",
        },
        { status: 404 }
      );
    }

    // ------------------------------------------------------------
    // 4. Verify quote belongs to customer
    // ------------------------------------------------------------

    if (quote.customerId !== customerId) {
      return NextResponse.json(
        {
          ok: false,
          error: "Quote does not belong to this customer",
        },
        { status: 403 }
      );
    }

    // ------------------------------------------------------------
    // 5. Quote must be accepted
    // ------------------------------------------------------------

    if (quote.status !== "Accepted") {
      return NextResponse.json(
        {
          ok: false,
          error: "Quote must be accepted before payment",
          code: "QUOTE_NOT_ACCEPTED",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // 6. Check quote expiry
    // ------------------------------------------------------------

    if (quote.expiresAt && quote.expiresAt <= new Date()) {
      await prisma.quote.update({
        where: {
          id: quote.id,
        },
        data: {
          status: "Expired",
        },
      });

      return NextResponse.json(
        {
          ok: false,
          error: "Quote has expired",
          code: "QUOTE_EXPIRED",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // 7. Customer email required
    // ------------------------------------------------------------

    if (!quote.customer.email) {
      return NextResponse.json(
        {
          ok: false,
          error: "Customer email is required before payment",
          code: "CUSTOMER_EMAIL_REQUIRED",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // 8. Prevent duplicate payment initialization
    // ------------------------------------------------------------

    if (quote.payment) {
      return NextResponse.json(
        {
          ok: false,
          error: "Payment has already been initialized for this quote",
          code: "PAYMENT_ALREADY_INITIALIZED",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // 9. Initialize Paystack transaction
    // ------------------------------------------------------------

    const paystackResponse = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: quote.customer.email,
          amount: String(quote.total * 100),
          currency: quote.currency,
        }),
      }
    );

    const paystackResult = await paystackResponse.json();

    if (!paystackResponse.ok || !paystackResult.status) {
      console.error("Paystack initialization failed:", paystackResult);

      return NextResponse.json(
        {
          ok: false,
          error: "Unable to initialize payment",
        },
        { status: 502 }
      );
    }

    const paymentData = paystackResult.data;

    // ------------------------------------------------------------
    // 10. Save payment
    // ------------------------------------------------------------

    const payment = await prisma.payment.create({
      data: {
        quoteId: quote.id,
        amount: quote.total,
        status: "Pending",
        reference: paymentData.reference,
        authorizationUrl: paymentData.authorization_url,
        accessCode: paymentData.access_code,
      },
    });

    // ------------------------------------------------------------
    // 11. Return payment information
    // ------------------------------------------------------------

    return NextResponse.json({
      ok: true,
      message: "Payment initialized successfully",
      payment: {
        id: payment.id,
        reference: payment.reference,
        authorizationUrl: payment.authorizationUrl,
        accessCode: payment.accessCode,
        amount: payment.amount,
        currency: quote.currency,
        status: payment.status,
      },
    });
  } catch (error) {
    console.error("PAYMENT INITIALIZATION ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Something went wrong while initializing payment",
      },
      { status: 500 }
    );
  }
}