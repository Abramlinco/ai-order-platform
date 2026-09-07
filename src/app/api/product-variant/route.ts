import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function GET(request: Request) {
  try {
    const productId = new URL(request.url).searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { ok: false, error: "productId is required" },
        { status: 400 }
      );
    }

    const variants = await prisma.productVariant.findMany({
      where: { productId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ ok: true, variants });
  } catch (error) {
    console.error("GET /api/product-variant failed:", error);
    return NextResponse.json(
      { ok: false, error: "Unable to load variants" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const productId = text(body?.productId);
    const name = text(body?.name);
    const price = Number(body?.price);
    const stock = Number(body?.stock);

    if (!productId || !name) {
      return NextResponse.json(
        { ok: false, error: "productId and variant name are required" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
      return NextResponse.json(
        { ok: false, error: "Variant price and stock must be valid non-negative numbers" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json(
        { ok: false, error: "Parent product not found" },
        { status: 404 }
      );
    }

    const variant = await prisma.productVariant.create({
      data: { productId, name, price, stock },
    });

    return NextResponse.json({ ok: true, variant }, { status: 201 });
  } catch (error) {
    console.error("POST /api/product-variant failed:", error);
    return NextResponse.json(
      { ok: false, error: "Unable to create variant" },
      { status: 500 }
    );
  }
}
