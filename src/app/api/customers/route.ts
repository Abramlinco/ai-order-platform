import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, phone } = body;

    if (!name || !phone) {
      return Response.json(
        {
          ok: false,
          error: "Name and phone are required",
        },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        phone,
      },
    });

    return Response.json(
      {
        ok: true,
        customer,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create customer:", error);

    return Response.json(
      {
        ok: false,
        error: "Failed to create customer",
      },
      { status: 500 }
    );
  }
}