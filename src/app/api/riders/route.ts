import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateRiderInput } from "@/lib/rider-validation";

export async function GET() {
  try {
    const riders = await prisma.rider.findMany({
      include: {
        orders: {
          orderBy: { updatedAt: "desc" },
          take: 10,
          select: { id: true, status: true, updatedAt: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(riders);
  } catch (error) {
    console.error("GET /api/riders failed:", error);
    return NextResponse.json({ error: "Failed to load riders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = validateRiderInput(body ?? {});

    if (!result.valid) {
      return NextResponse.json(
        { error: "Please correct the rider details.", fieldErrors: result.errors },
        { status: 400 }
      );
    }

    const rider = await prisma.rider.create({
      data: {
        name: result.name,
        phone: result.phone,
        bike: result.bike,
        status: "Available",
        accountStatus: "Active",
      },
    });

    return NextResponse.json(rider, { status: 201 });
  } catch (error) {
    console.error("POST /api/riders failed:", error);
    return NextResponse.json({ error: "Failed to create rider" }, { status: 500 });
  }
}
