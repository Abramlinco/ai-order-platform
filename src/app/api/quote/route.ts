import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDeliveryPricingDecision } from "../../../lib/delivery-pricing-service";
import { getDeliveryEta } from "../../../lib/delivery-eta-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customerId,
      productId,
      variantId,
      quantity,
      location,
    } = body;

    // ------------------------------------------------------------
    // 1. Validate required information
    // ------------------------------------------------------------

    if (
      !customerId ||
      !productId ||
      !variantId ||
      quantity === undefined ||
      quantity === null ||
      !location
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "customerId, productId, variantId, quantity, and location are required",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // 2. Validate location
    // ------------------------------------------------------------

    if (
      typeof location !== "object" ||
      !location.address ||
      !location.state
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "location must contain both address and state",
        },
        { status: 400 }
      );
    }

    const address = String(location.address).trim();
    const state = String(location.state).trim();

    if (!address || !state) {
      return NextResponse.json(
        {
          ok: false,
          error: "location address and state are required",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // 3. Validate quantity
    // ------------------------------------------------------------

    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "Quantity must be a positive whole number",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // 4. Validate customer
    // ------------------------------------------------------------

    const customer = await prisma.customer.findUnique({
      where: {
        id: customerId,
      },
    });

    if (!customer) {
      return NextResponse.json(
        {
          ok: false,
          error: "Customer not found",
        },
        { status: 404 }
      );
    }

    // ------------------------------------------------------------
    // 5. Find product
    // ------------------------------------------------------------

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          ok: false,
          error: "Product not found",
        },
        { status: 404 }
      );
    }

    // ------------------------------------------------------------
    // 6. Find variant
    // ------------------------------------------------------------

    const variant = await prisma.productVariant.findUnique({
      where: {
        id: variantId,
      },
    });

    if (!variant) {
      return NextResponse.json(
        {
          ok: false,
          error: "Product variant not found",
        },
        { status: 404 }
      );
    }

    // ------------------------------------------------------------
    // 7. Verify variant belongs to product
    // ------------------------------------------------------------

    if (variant.productId !== product.id) {
      return NextResponse.json(
        {
          ok: false,
          error: "Product variant does not belong to this product",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // 8. Check stock
    //
    // IMPORTANT:
    // Stock is checked internally.
    // Exact stock quantity is NEVER returned to the customer.
    // ------------------------------------------------------------

    if (variant.stock < quantity) {
      return NextResponse.json(
        {
          ok: false,
          error: `Not enough stock for ${variant.name}`,
          code: "INSUFFICIENT_STOCK",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------
    // 9. Calculate delivery pricing
    //
    // Internal:
    // Local      → delivery provider
    // Interstate → business pricing rules
    // ------------------------------------------------------------

    const deliveryPricing = await getDeliveryPricingDecision({
      customerLocation: {
        state,
      },
      customerAddress: address,
    });

    // ------------------------------------------------------------
    // 10. Get delivery ETA
    //
    // ETA remains internal for now.
    // The customer-facing response does not expose
    // provider/distance/traffic information.
    // ------------------------------------------------------------

    const business = await prisma.business.findFirst();

    if (!business || !business.address) {
      return NextResponse.json(
        {
          ok: false,
          error: "Business delivery location is not configured",
        },
        { status: 500 }
      );
    }

    const eta = await getDeliveryEta({
      pickupLocation: business.address,
      dropoffLocation: address,
    });

    // ------------------------------------------------------------
    // 11. Calculate totals
    // ------------------------------------------------------------

    const subtotal = variant.price * quantity;
    const deliveryFee = deliveryPricing.deliveryFee;
    const total = subtotal + deliveryFee;

    // ------------------------------------------------------------
    // 12. Quote expiry
    // ------------------------------------------------------------

    const now = new Date();

    const providerExpiry = deliveryPricing.expiresAt
      ? new Date(deliveryPricing.expiresAt)
      : null;

    const defaultExpiry = new Date(
      now.getTime() + 30 * 60 * 1000
    );

    const expiresAt =
      providerExpiry && providerExpiry > now
        ? providerExpiry
        : defaultExpiry;

    // ------------------------------------------------------------
    // 13. Save quote
    //
    // Product/variant IDs and provider information remain
    // stored internally in the database.
    // ------------------------------------------------------------

    const quote = await prisma.quote.create({
      data: {
        customerId: customer.id,

        subtotal,
        deliveryFee,
        total,

        currency: deliveryPricing.currency || "NGN",

        location: address,
        deliveryType: deliveryPricing.deliveryType,

        deliveryProvider: deliveryPricing.provider,
        providerQuoteId: deliveryPricing.providerQuoteId,

        providerQuoteExpiresAt:
          deliveryPricing.expiresAt
            ? new Date(deliveryPricing.expiresAt)
            : null,

        estimatedDurationMinutes:
          eta.estimatedDurationMinutes,

        distanceKm: eta.distanceKm,
        trafficAware: eta.trafficAware,

        status: "Ready",
        expiresAt,

        items: {
          create: {
            productId: product.id,
            variantId: variant.id,

            productName: product.name,
            variantName: variant.name,

            quantity,
            unitPrice: variant.price,
            subtotal,
          },
        },
      },

      include: {
        items: true,
      },
    });

    // ------------------------------------------------------------
    // 14. Customer/AI-facing quote response
    //
    // ONLY return information needed to communicate the quote.
    //
    // NEVER return:
    // - productId
    // - variantId
    // - availableStock
    // - deliveryProvider
    // - providerQuoteId
    // - distanceKm
    // - trafficAware
    // ------------------------------------------------------------

    return NextResponse.json({
      ok: true,

      quote: {
        id: quote.id,

        productName: product.name,
        variantName: variant.name,

        quantity,

        unitPrice: variant.price,

        subtotal: quote.subtotal,

        deliveryFee: quote.deliveryFee,

        total: quote.total,

        currency: quote.currency,

        status: quote.status,

        expiresAt: quote.expiresAt,
      },
    });
  } catch (error) {
    console.error("QUOTE ERROR:", error);

    if (error instanceof Error) {
      const businessRuleErrors: Record<string, string> = {
        CUSTOMER_ADDRESS_REQUIRED:
          "Customer address is required",

        LOCATION_STATE_REQUIRED:
          "Customer state is required",

        BUSINESS_NOT_FOUND:
          "Business not found",

        BUSINESS_LOCATION_NOT_CONFIGURED:
          "Business delivery location is not configured",

        BUSINESS_STATE_NOT_CONFIGURED:
          "Business state is not configured",

        LOCAL_DELIVERY_DISABLED:
          "Local delivery is currently unavailable",

        INTERSTATE_DELIVERY_DISABLED:
          "Interstate delivery is currently unavailable",

        INTERSTATE_FIXED_FEE_NOT_CONFIGURED:
          "Interstate fixed delivery fee is not configured",

        INTERSTATE_PER_ORDER_FEE_REQUIRED:
          "Interstate per-order delivery pricing is not configured",

        INTERSTATE_EXTERNAL_PROVIDER_NOT_CONFIGURED:
          "Interstate external delivery provider is not configured",

        INVALID_INTERSTATE_PRICING_METHOD:
          "Invalid interstate pricing method",

        DELIVERY_LOCATIONS_REQUIRED:
          "Delivery locations are required",
      };

      const message = businessRuleErrors[error.message];

      if (message) {
        return NextResponse.json(
          {
            ok: false,
            error: message,
            code: error.message,
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        ok: false,
        error: "Something went wrong while creating the quote",
      },
      { status: 500 }
    );
  }
}