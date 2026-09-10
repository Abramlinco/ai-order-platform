import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const riders = await prisma.rider.findMany({
      where: {
        accountStatus: {
          in: ["Suspended", "Blocked"],
        },
      },
      include: {
        orders: {
          orderBy: { updatedAt: "desc" },
          take: 10,
          select: {
            id: true,
            status: true,
            updatedAt: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(riders);
  } catch (error) {
    console.error("GET /api/riders/restricted failed:", error);
    return NextResponse.json(
      { error: "Failed to load restricted riders." },
      { status: 500 }
    );
  }
}
