import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanEmail(value: unknown) {
  const email = cleanString(value).toLowerCase();
  return email || null;
}

function formatCustomer(customer: {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  orders: Array<{
    id: string;
    total: number;
    location: string;
    status: string;
    createdAt: Date;
  }>;
}) {
  const validOrders = customer.orders.filter((order) => order.status !== "Cancelled");
  const latestOrder = validOrders[0] ?? null;

  return {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
    location: latestOrder?.location ?? null,
    orders: validOrders.length,
    totalSpent: validOrders.reduce((sum, order) => sum + order.total, 0),
    lastOrder: latestOrder?.createdAt ?? null,
  };
}

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
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

    return NextResponse.json({
      ok: true,
      customers: customers.map(formatCustomer),
    });
  } catch (error) {
    console.error("GET /api/customers failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to load customers",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = cleanString(body?.name);
    const phone = cleanString(body?.phone);
    const email = cleanEmail(body?.email);

    if (!name) {
      return NextResponse.json(
        { ok: false, error: "Customer name is required" },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { ok: false, error: "Customer phone is required" },
        { status: 400 }
      );
    }

    if (phone.length < 7) {
      return NextResponse.json(
        { ok: false, error: "Customer phone number is invalid" },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Customer email address is invalid" },
        { status: 400 }
      );
    }

    const existingByPhone = await prisma.customer.findUnique({
      where: { phone },
      select: { id: true },
    });

    if (existingByPhone) {
      return NextResponse.json(
        {
          ok: false,
          error: "A customer with this phone number already exists",
          customerId: existingByPhone.id,
        },
        { status: 409 }
      );
    }

    if (email) {
      const existingByEmail = await prisma.customer.findUnique({
        where: { email },
        select: { id: true },
      });

      if (existingByEmail) {
        return NextResponse.json(
          {
            ok: false,
            error: "A customer with this email address already exists",
            customerId: existingByEmail.id,
          },
          { status: 409 }
        );
      }
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        phone,
        email,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        customer: {
          id: customer.id,
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          location: null,
          orders: 0,
          totalSpent: 0,
          lastOrder: null,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST /api/customers failed:", error);

    const code =
      typeof error === "object" &&
      error !== null &&
      "code" in error
        ? String((error as { code?: unknown }).code)
        : "";

    if (code === "P2002") {
      return NextResponse.json(
        {
          ok: false,
          error: "A customer with the supplied phone or email already exists",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to create customer",
      },
      { status: 500 }
    );
  }
}
