import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        rider: true,
        items: true,
        feedback: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json({
      ok: true,
      orders,
    });
  } catch (error) {
    console.error("Failed to fetch orders:", error);

    return Response.json(
      {
        ok: false,
        error: "Failed to fetch orders",
      },
      { status: 500 }
    );
  }
}

// POST/api/order 

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customerId,
      location,
      items,
    } = body;

    // 1. Validate the basic order information
    if (
      !customerId ||
      !location ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return Response.json(
        {
          ok: false,
          error: "Invalid order data",
        },
        { status: 400 }
      );
    }

    // 2. Make sure the customer exists
    const customer = await prisma.customer.findUnique({
      where: {
        id: customerId,
      },
    });

    if (!customer) {
      return Response.json(
        {
          ok: false,
          error: "Customer not found",
        },
        { status: 404 }
      );
    }

    // 3. Validate each order item
    for (const item of items) {
      if (
        !item.productName ||
        typeof item.quantity !== "number" ||
        typeof item.unitPrice !== "number" ||
        item.quantity <= 0 ||
        item.unitPrice < 0
      ) {
        return Response.json(
          {
            ok: false,
            error: "Invalid order item",
          },
          { status: 400 }
        );
      }
    }

    // 4. Calculate each item's subtotal
    const calculatedItems = items.map((item: {
      productName: string;
      quantity: number;
      unitPrice: number;
    }) => ({
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.quantity * item.unitPrice,
    }));

    // 5. Calculate the order subtotal
    const subtotal = calculatedItems.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    // 6. Calculate delivery fee
    const deliveryFee = 500;

    // 7. Calculate final total
    const total = subtotal + deliveryFee;

    // 8. Create the order
    const order = await prisma.order.create({
      data: {
        customerId,
        subtotal,
        deliveryFee,
        total,
        location,

        items: {
          create: calculatedItems,
        },
      },

      include: {
        customer: true,
        items: true,
      },
    });

    // 9. Return the created order
    return Response.json(
      {
        ok: true,
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create order:", error);

    return Response.json(
      {
        ok: false,
        error: "Failed to create order",
      },
      { status: 500 }
    );
  }
}