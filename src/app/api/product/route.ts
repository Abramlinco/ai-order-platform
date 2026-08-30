import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      category,
      price,
      stock,
    } = body;

    // Validate product data
    if (
      !name ||
      !category ||
      typeof price !== "number" ||
      typeof stock !== "number" ||
      price < 0 ||
      stock < 0
    ) {
      return Response.json(
        {
          ok: false,
          error: "Invalid product data",
        },
        { status: 400 }
      );
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        category,
        price,
        stock,
      },
    });

    return Response.json(
      {
        ok: true,
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create product:", error);

    return Response.json(
      {
        ok: false,
        error: "Failed to create product",
      },
      { status: 500 }
    );
  }
}