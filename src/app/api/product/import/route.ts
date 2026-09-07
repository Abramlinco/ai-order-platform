import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateProductRows } from "@/lib/product-validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const products = Array.isArray(body?.products) ? body.products : [];

    if (!products.length) {
      return NextResponse.json(
        { ok: false, error: "At least one product is required" },
        { status: 400 }
      );
    }

    // The frontend review screen must explicitly confirm the staged rows.
    // Authentication/merchant authorization will be added with the
    // multi-tenant security layer; this flag prevents accidental direct
    // publishing from an unreviewed import payload.
    if (body?.confirmed !== true) {
      return NextResponse.json(
        { ok: false, error: "Product import requires explicit confirmation before publishing" },
        { status: 400 }
      );
    }

    const result = validateProductRows(products);

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 400 }
      );
    }

    const created = await prisma.$transaction(
      result.products.map((item) =>
        prisma.product.create({
          data: item,
        })
      )
    );

    return NextResponse.json({ ok: true, count: created.length });
  } catch (error) {
    console.error("POST /api/product/import failed:", error);
    return NextResponse.json(
      { ok: false, error: "Unable to import products" },
      { status: 500 }
    );
  }
}
