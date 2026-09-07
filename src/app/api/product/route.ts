import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateProductInput } from "@/lib/product-validation";

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
    const result = validateProductInput(body);

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: result.value,
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
