import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateRiderInput } from "@/lib/rider-validation";

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
  request: Request,
  { params }: { params: Promise<{ riderId: string }> }
) {
  const { riderId } = await params;

  try {
    const body = await request.json();
    const rider = await prisma.rider.findUnique({
      where: { id: riderId },
      include: { orders: { select: { id: true, status: true } } },
    });

    if (!rider) return NextResponse.json({ error: "Rider not found." }, { status: 404 });

    const result = validateRiderInput({
      name: body?.name,
      phone: body?.phone,
      bike: body?.bike,
    });

    if (!result.valid) {
      return NextResponse.json(
        { error: "Please correct the rider details.", fieldErrors: result.errors },
        { status: 400 }
      );
    }

    const accountStatus = body?.accountStatus;
    const status = body?.status;

    if (accountStatus && !["Active", "Suspended", "Blocked"].includes(accountStatus)) {
      return NextResponse.json({ error: "Invalid rider account status." }, { status: 400 });
    }

    if (status && !["Available", "Busy", "Offline"].includes(status)) {
      return NextResponse.json({ error: "Invalid rider operational status." }, { status: 400 });
    }

    if ((accountStatus === "Suspended" || accountStatus === "Blocked") && hasActiveDelivery(rider.orders)) {
      return NextResponse.json(
        { error: "This rider has an active delivery and cannot be restricted until the delivery is resolved." },
        { status: 409 }
      );
    }

    const data: Record<string, unknown> = {
      name: result.name,
      phone: result.phone,
      bike: result.bike,
    };

    if (status !== undefined) data.status = status;

    if (accountStatus !== undefined) {
      data.accountStatus = accountStatus;

      if (accountStatus === "Suspended") {
        const reason = typeof body?.reason === "string" ? body.reason.trim() : "";
        if (!reason) return NextResponse.json({ error: "A suspension reason is required." }, { status: 400 });
        data.suspensionReason = reason;
        data.suspendedAt = new Date();
        data.blockedReason = null;
        data.blockedAt = null;
        data.status = "Offline";
      }

      if (accountStatus === "Blocked") {
        const reason = typeof body?.reason === "string" ? body.reason.trim() : "";
        if (!reason) return NextResponse.json({ error: "A block reason is required." }, { status: 400 });
        data.blockedReason = reason;
        data.blockedAt = new Date();
        data.suspensionReason = null;
        data.suspendedAt = null;
        data.status = "Offline";
      }

      if (accountStatus === "Active") {
        data.suspensionReason = null;
        data.suspendedAt = null;
        data.blockedReason = null;
        data.blockedAt = null;
      }
    }

    const updated = await prisma.rider.update({ where: { id: riderId }, data });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/riders/[riderId] failed:", error);
    return NextResponse.json({ error: "Failed to update rider." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ riderId: string }> }
) {
  const { riderId } = await params;

  try {
    const rider = await prisma.rider.findUnique({
      where: { id: riderId },
      include: { orders: { select: { id: true, status: true } } },
    });

    if (!rider) return NextResponse.json({ error: "Rider not found." }, { status: 404 });

    if (hasActiveDelivery(rider.orders)) {
      return NextResponse.json(
        { error: "This rider has an active delivery and cannot be removed." },
        { status: 409 }
      );
    }

    await prisma.rider.delete({ where: { id: riderId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/riders/[riderId] failed:", error);
    return NextResponse.json({ error: "Rider could not be removed." }, { status: 500 });
  }
}
