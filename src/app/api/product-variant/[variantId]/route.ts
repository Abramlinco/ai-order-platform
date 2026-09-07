import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ variantId: string }> };

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function PATCH(request: Request, context: Context) {
  try {
    const { variantId } = await context.params;
    const body = await request.json();

    const name = text(body?.name);
    const price = Number(body?.price);
    const stock = Number(body?.stock);

    if (!name || !Number.isInteger(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
      return NextResponse.json(
        { ok: false, error: "Variant name, price and stock are required and must be valid" },
        { status: 400 }
      );
    }

    const existing = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Variant not found" },
        { status: 404 }
      );
    }

    const variant = await prisma.productVariant.update({
      where: { id: variantId },
      data: { name, price, stock },
    });

    return NextResponse.json({ ok: true, variant });
  } catch (error) {
    console.error("PATCH /api/product-variant/[variantId] failed:", error);
    return NextResponse.json(
      { ok: false, error: "Unable to update variant" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    const { variantId } = await context.params;

    const existing = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Variant not found" },
        { status: 404 }
      );
    }

    await prisma.productVariant.delete({ where: { id: variantId } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/product-variant/[variantId] failed:", error);
    return NextResponse.json(
      { ok: false, error: "Unable to remove variant" },
      { status: 500 }
    );
  }
}
