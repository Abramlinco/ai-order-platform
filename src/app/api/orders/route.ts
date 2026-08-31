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

    // 3. Everything inside this transaction succeeds together
    const order = await prisma.$transaction(async (tx) => {
      const calculatedItems = [];

      // 4. Check every requested product
      for (const item of items) {
        if (
          !item.productId ||
          typeof item.quantity !== "number" ||
          item.quantity <= 0
        ) {
          throw new Error("INVALID_ORDER_ITEM");
        }

        const product = await tx.product.findUnique({
          where: {
            id: item.productId,
          },
        });

        if (!product) {
          throw new Error("PRODUCT_NOT_FOUND");
        }

        // Make sure enough stock exists
        const stockUpdate = await tx.product.updateMany({
          where: {
            id: product.id,
            stock: {
              gte: item.quantity,
            },
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        if (stockUpdate.count === 0) {
          throw new Error(`NOT_ENOUGH_STOCK:${product.name}`);
        }

        // Calculate the item subtotal
        const itemSubtotal = product.price * item.quantity;

        calculatedItems.push({
          productId: product.id,
          productName: product.name,
          quantity: item.quantity,
          unitPrice: product.price,
          subtotal: itemSubtotal,
        });
      }

      // 5. Calculate the order subtotal
      const subtotal = calculatedItems.reduce(
        (sum, item) => sum + item.subtotal,
        0
      );

      // 6. Delivery fee
      const deliveryFee = 500;

      // 7. Final total
      const total = subtotal + deliveryFee;

      // 8. Create the order
      const newOrder = await tx.order.create({
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

      return newOrder;
    });

    // 9. Everything succeeded
    return Response.json(
      {
        ok: true,
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create order:", error);

    if (error instanceof Error) {
      if (error.message === "PRODUCT_NOT_FOUND") {
        return Response.json(
          {
            ok: false,
            error: "Product not found",
          },
          { status: 404 }
        );
      }

      if (error.message === "INVALID_ORDER_ITEM") {
        return Response.json(
          {
            ok: false,
            error: "Invalid order item",
          },
          { status: 400 }
        );
      }

      if (error.message.startsWith("NOT_ENOUGH_STOCK:")) {
        const productName = error.message.split(":")[1];

        return Response.json(
          {
            ok: false,
            error: `Not enough stock for ${productName}`,
          },
          { status: 400 }
        );
      }
    }

    return Response.json(
      {
        ok: false,
        error: "Failed to create order",
      },
      { status: 500 }
    );
  }
}