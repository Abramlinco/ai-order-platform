import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { productId, name, price, stock } = body;

    // Check required information
    if (
      !productId ||
      !name ||
      price === undefined ||
      stock === undefined
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "productId, name, price and stock are required",
        },
        { status: 400 }
      );
    }

    // Check price
    if (price < 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Price cannot be negative",
        },
        { status: 400 }
      );
    }

    // Check stock
    if (stock < 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Stock cannot be negative",
        },
        { status: 400 }
      );
    }

    // Make sure the parent product exists
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

    // Create the variant
    const variant = await prisma.productVariant.create({
      data: {
        productId,
        name,
        price,
        stock,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        variant,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("PRODUCT VARIANT ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Something went wrong while creating the product variant",
      },
      { status: 500 }
    );
  }
}

// GET product-variant

export async function GET() {
  try {
    const variants = await prisma.productVariant.findMany({
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      ok: true,
      variants,
    });
  } catch (error) {
    console.error("GET PRODUCT VARIANTS ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Something went wrong while fetching product variants",
      },
      { status: 500 }
    );
  }
}