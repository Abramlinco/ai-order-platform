import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ productId: string }> };

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function integer(value: unknown) {
  const n = Number(value);
  return Number.isInteger(n) ? n : NaN;
}

async function getProduct(productId: string) {
  return prisma.product.findUnique({
    where: { id: productId },
    include: { variants: { orderBy: { createdAt: "asc" } } },
  });
}

function present(product: any) {
  const hasVariants = product.variants.length > 0;
  const stock = hasVariants
    ? product.variants.reduce((sum: number, v: any) => sum + v.stock, 0)
    : product.stock;

  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    stock,
    status: stock === 0 ? "Out of stock" : stock <= 15 ? "Low stock" : "In stock",
    variants: product.variants.map((v: any) => ({
      id: v.id,
      name: v.name,
      price: v.price,
      stock: v.stock,
    })),
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export async function PATCH(request: Request, context: Context) {
  try {
    const { productId } = await context.params;
    const body = await request.json();

    const existing = await getProduct(productId);
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Product not found" },
        { status: 404 }
      );
    }

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

    if (!Number.isInteger(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
      return NextResponse.json(
        { ok: false, error: "Price and stock must be valid non-negative numbers" },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: { name, category, price, stock },
      include: { variants: { orderBy: { createdAt: "asc" } } },
    });

    return NextResponse.json({ ok: true, product: present(product) });
  } catch (error) {
    console.error("PATCH /api/product/[productId] failed:", error);
    return NextResponse.json(
      { ok: false, error: "Unable to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    const { productId } = await context.params;

    const existing = await getProduct(productId);
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Product not found" },
        { status: 404 }
      );
    }

    await prisma.product.delete({ where: { id: productId } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/product/[productId] failed:", error);
    return NextResponse.json(
      { ok: false, error: "Unable to remove product" },
      { status: 500 }
    );
  }
}
