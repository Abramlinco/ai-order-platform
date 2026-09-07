import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Context = {
  params: Promise<{ customerId: string }>;
};

export async function GET(_request: Request, context: Context) {
  try {
    const { customerId } = await context.params;

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        orders: {
          select: {
            id: true,
            total: true,
            location: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!customer) {
      return NextResponse.json(
        { ok: false, error: "Customer not found" },
        { status: 404 }
      );
    }

    const validOrders = customer.orders.filter(
      (order) => order.status !== "Cancelled"
    );

    return NextResponse.json({
      ok: true,
      customer: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        location: validOrders[0]?.location ?? null,
        orders: validOrders.length,
        totalSpent: validOrders.reduce(
          (sum, order) => sum + order.total,
          0
        ),
        lastOrder: validOrders[0]?.createdAt ?? null,
        orderHistory: customer.orders,
      },
    });
  } catch (error) {
    console.error("GET /api/customers/[customerId] failed:", error);

    return NextResponse.json(
      { ok: false, error: "Unable to load customer" },
      { status: 500 }
    );
  }
}
