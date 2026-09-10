import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ACTIVE_ORDER_STATUSES = new Set([
  "Confirmed",
  "FindingRider",
  "RiderAssigned",
  "RiderAccepted",
  "GoingToBusiness",
  "ArrivedAtBusiness",
  "OrderPickedUp",
  "OutForDelivery",
  "ArrivedAtCustomer",
  "VerifyingOTP",
]);

function hasActiveDelivery(orders: { status: string }[]) {
  return orders.some((order) => ACTIVE_ORDER_STATUSES.has(String(order.status)));
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ riderId: string }> }
) {
  const { riderId } = await params;

  try {
    const body = await request.json();
    const action = typeof body?.action === "string" ? body.action.trim().toLowerCase() : "";
    const reason = typeof body?.reason === "string" ? body.reason.trim() : "";

    if (!["suspend", "block", "restore"].includes(action)) {
      return NextResponse.json({ error: "Invalid restriction action." }, { status: 400 });
    }

    if ((action === "suspend" || action === "block") && !reason) {
      return NextResponse.json(
        { error: `A reason is required to ${action} this rider.` },
        { status: 400 }
      );
    }

    const rider = await prisma.rider.findUnique({
      where: { id: riderId },
      include: { orders: { select: { id: true, status: true } } },
    });

    if (!rider) return NextResponse.json({ error: "Rider not found." }, { status: 404 });

    if ((action === "suspend" || action === "block") && hasActiveDelivery(rider.orders)) {
      return NextResponse.json(
        { error: "This rider has an active delivery. Complete or safely reassign it before changing the rider restriction." },
        { status: 409 }
      );
    }

    const now = new Date();

const result = await prisma.$transaction(async (tx) => {
  let updated;

  if (action === "suspend") {
    updated = await tx.rider.update({
      where: { id: riderId },
      data: {
        accountStatus: "Suspended",
        suspensionReason: reason,
        suspendedAt: now,
        blockedReason: null,
        blockedAt: null,
        status: "Offline",
        restoredAt: null,
      },
    });
  } else if (action === "block") {
    updated = await tx.rider.update({
      where: { id: riderId },
      data: {
        accountStatus: "Blocked",
        blockedReason: reason,
        blockedAt: now,
        suspensionReason: null,
        suspendedAt: null,
        status: "Offline",
        restoredAt: null,
      },
    });
  } else {
    updated = await tx.rider.update({
      where: { id: riderId },
      data: {
        accountStatus: "Active",
        suspensionReason: null,
        suspendedAt: null,
        blockedReason: null,
        blockedAt: null,
        restoredAt: null,
      },
    });
  }

  await tx.riderAuditLog.create({
    data: {
      riderId,
      action,
      reason: reason || null,
      createdAt: now,
    },
  });

  return updated;
});

    return NextResponse.json({ ok: true, rider: result });
  } catch (error) {
    console.error("PATCH /api/riders/[riderId]/restriction failed:", error);
    return NextResponse.json(
      { error: "Failed to update rider restriction." },
      { status: 500 }
    );
  }
}
