import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    quoteId: string;
  }>;
};

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const { quoteId } = await context.params;

    if (!quoteId) {
      return NextResponse.json(
        {
          ok: false,
          error: "Quote ID is required",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // 1. Read request body
    // ------------------------------------------------------------

    const body = await request.json();

    const { customerId } = body;

    if (!customerId) {
      return NextResponse.json(
        {
          ok: false,
          error: "customerId is required",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // 2. Find quote
    // ------------------------------------------------------------

    const quote = await prisma.quote.findUnique({
      where: {
        id: quoteId,
      },
      include: {
        customer: true,
        items: true,
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
    // 3. Verify quote belongs to customer
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
    // 4. Verify quote status
    // ------------------------------------------------------------

    if (quote.status !== "Ready") {
      return NextResponse.json(
        {
          ok: false,
          error: `Quote cannot be accepted because its status is ${quote.status}`,
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // 5. Verify quote has not expired
    // ------------------------------------------------------------

    const now = new Date();

    if (quote.expiresAt && quote.expiresAt <= now) {
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
    // 6. Re-validate products, variants, prices and stock
    // ------------------------------------------------------------

    for (const item of quote.items) {
      if (!item.productId || !item.variantId) {
        return NextResponse.json(
          {
            ok: false,
            error: "Quote contains an invalid product item",
            code: "INVALID_QUOTE_ITEM",
          },
          { status: 400 }
        );
      }

      const variant = await prisma.productVariant.findUnique({
        where: {
          id: item.variantId,
        },
        include: {
          product: true,
        },
      });

      if (!variant) {
        return NextResponse.json(
          {
            ok: false,
            error: `Product variant ${item.variantName ?? ""} is no longer available`,
            code: "VARIANT_NOT_FOUND",
          },
          { status: 400 }
        );
      }

      if (variant.productId !== item.productId) {
        return NextResponse.json(
          {
            ok: false,
            error: "Quote contains a mismatched product and variant",
            code: "VARIANT_PRODUCT_MISMATCH",
          },
          { status: 400 }
        );
      }

      if (variant.stock < item.quantity) {
        return NextResponse.json(
          {
            ok: false,
            error: `Not enough stock for ${variant.name}`,
            code: "NOT_ENOUGH_STOCK",
            availableStock: variant.stock,
          },
          { status: 400 }
        );
      }

      if (variant.price !== item.unitPrice) {
        return NextResponse.json(
          {
            ok: false,
            error: `The price of ${variant.name} has changed`,
            code: "PRICE_CHANGED",
            oldPrice: item.unitPrice,
            newPrice: variant.price,
          },
          { status: 400 }
        );
      }
    }

    // ------------------------------------------------------------
    // 7. Accept quote
    // ------------------------------------------------------------

    const acceptedQuote = await prisma.quote.update({
      where: {
        id: quote.id,
      },
      data: {
        status: "Accepted",
      },
      include: {
        customer: true,
        items: true,
        payment: true,
      },
    });

    // ------------------------------------------------------------
    // 8. Return accepted quote
    // ------------------------------------------------------------

    return NextResponse.json({
      ok: true,
      message: "Quote accepted successfully",
      quote: acceptedQuote,
    });
  } catch (error) {
    console.error("QUOTE ACCEPTANCE ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Something went wrong while accepting the quote",
      },
      { status: 500 }
    );
  }
}