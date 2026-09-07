import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function integer(value: unknown) {
  const n = Number(value);
  return Number.isInteger(n) ? n : NaN;
}

function present(product: any) {
  const variantStock = product.variants.reduce(
    (sum: number, variant: any) => sum + variant.stock,
    0
  );
  const hasVariants = product.variants.length > 0;
  const stock = hasVariants ? variantStock : product.stock;

  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    stock,
    status: stock === 0 ? "Out of stock" : stock <= 15 ? "Low stock" : "In stock",
    variants: product.variants.map((variant: any) => ({
      id: variant.id,
      name: variant.name,
      price: variant.price,
      stock: variant.stock,
    })),
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { variants: { orderBy: { createdAt: "asc" } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      ok: true,
      products: products.map(present),
    });
  } catch (error) {
    console.error("GET /api/product failed:", error);
    return NextResponse.json(
      { ok: false, error: "Unable to load products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = text(body?.name);
    const category = text(body?.category);
    const price = integer(body?.price);
    const stock = integer(body?.stock);

    if (!name || !category) {
      return NextResponse.json(
        { ok: false, error: "Product name and category are required" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(price) || price < 0) {
      return NextResponse.json(
        { ok: false, error: "Product price must be a valid non-negative number" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(stock) || stock < 0) {
      return NextResponse.json(
        { ok: false, error: "Product stock must be a valid non-negative number" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: { name, category, price, stock },
      include: { variants: true },
    });

    return NextResponse.json(
      { ok: true, product: present(product) },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/product failed:", error);
    return NextResponse.json(
      { ok: false, error: "Unable to create product" },
      { status: 500 }
    );
  }
}
