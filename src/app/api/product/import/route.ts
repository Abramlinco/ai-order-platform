import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function integer(value: unknown) {
  const n = Number(value);
  return Number.isInteger(n) ? n : NaN;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const products = Array.isArray(body?.products) ? body.products : [];

    if (!products.length) {
      return NextResponse.json({ ok: false, error: "At least one product is required" }, { status: 400 });
    }

    const normalized = products.map((item: any) => ({
      name: text(item?.name),
      category: text(item?.category),
      price: integer(item?.price),
      stock: integer(item?.stock),
    }));

    const invalidIndex = normalized.findIndex(
      (item) =>
        !item.name ||
        !item.category ||
        !Number.isInteger(item.price) ||
        item.price < 0 ||
        !Number.isInteger(item.stock) ||
        item.stock < 0
    );

    if (invalidIndex !== -1) {
      return NextResponse.json(
        { ok: false, error: `Product row ${invalidIndex + 1} is invalid. Nothing was imported.` },
        { status: 400 }
      );
    }

    const created = await prisma.$transaction(
      normalized.map((item) =>
        prisma.product.create({
          data: item,
        })
      )
    );

    return NextResponse.json({ ok: true, count: created.length });
  } catch (error) {
    console.error("POST /api/product/import failed:", error);
    return NextResponse.json({ ok: false, error: "Unable to import products" }, { status: 500 });
  }
}
