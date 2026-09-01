import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { productId, variantId, quantity, location } = body;

    // Check that the required information was provided
    if (
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
            "productId, variantId, quantity, and location are required",
        },
        { status: 400 }
      );
    }

    // Quantity must be a positive whole number
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

    // Find the product
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    // Product doesn't exist
    if (!product) {
      return NextResponse.json(
        {
          ok: false,
          error: "Product not found",
        },
        { status: 404 }
      );
    }

    // Find the requested variant
    const variant = await prisma.productVariant.findUnique({
      where: {
        id: variantId,
      },
    });

    // Variant doesn't exist
    if (!variant) {
      return NextResponse.json(
        {
          ok: false,
          error: "Product variant not found",
        },
        { status: 404 }
      );
    }

    // Make sure the variant belongs to the selected product
    if (variant.productId !== product.id) {
      return NextResponse.json(
        {
          ok: false,
          error: "Product variant does not belong to this product",
        },
        { status: 400 }
      );
    }

    // Check variant stock
    if (variant.stock < quantity) {
      return NextResponse.json(
        {
          ok: false,
          error: `Not enough stock for ${variant.name}`,
          availableStock: variant.stock,
        },
        { status: 400 }
      );
    }

    // Calculate quote using the variant price
    const subtotal = variant.price * quantity;

    // Temporary delivery fee.
    // We will replace this with the Delivery Pricing Service next.
    const deliveryFee = 500;

    const total = subtotal + deliveryFee;

    // Return quote
    return NextResponse.json({
      ok: true,
      quote: {
        productId: product.id,
        productName: product.name,

        variantId: variant.id,
        variantName: variant.name,

        quantity,
        unitPrice: variant.price,
        subtotal,

        location,
        deliveryFee,
        total,

        availableStock: variant.stock,
      },
    });
  } catch (error) {
    console.error("QUOTE ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Something went wrong while creating the quote",
      },
      { status: 500 }
    );
  }
}