import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { productId, quantity } = body;

    // Check that the required information was provided
    if (
      !productId ||
      quantity === undefined ||
      quantity === null
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "productId and quantity are required",
        },
        { status: 400 }
      );
    }

    // Check that quantity is greater than zero
    if (quantity <= 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Quantity must be greater than 0",
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

    // Check stock
    if (product.stock < quantity) {
      return NextResponse.json(
        {
          ok: false,
          error: `Not enough stock for ${product.name}`,
          availableStock: product.stock,
        },
        { status: 400 }
      );
    }

    // Calculate quote
    const subtotal = product.price * quantity;
    const deliveryFee = 500;
    const total = subtotal + deliveryFee;

    // Return quote
    return NextResponse.json({
      ok: true,
      quote: {
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice: product.price,
        subtotal,
        deliveryFee,
        total,
        availableStock: product.stock,
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