import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    orderId: string;
  }>;
};

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { orderId } = await context.params;

    const body = await request.json();
    const otp = String(body?.otp ?? "").trim();

    if (!orderId) {
      return NextResponse.json(
        {
          ok: false,
          error: "ORDER_ID_REQUIRED",
        },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        {
          ok: false,
          error: "INVALID_OTP_FORMAT",
          message: "OTP must be a 6-digit code.",
        },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          ok: false,
          error: "ORDER_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    if (order.status === "Delivered" || order.otpVerifiedAt) {
      return NextResponse.json(
        {
          ok: false,
          error: "ORDER_ALREADY_DELIVERED",
        },
        { status: 409 }
      );
    }

    if (!order.deliveryOtpHash) {
      return NextResponse.json(
        {
          ok: false,
          error: "DELIVERY_OTP_NOT_AVAILABLE",
        },
        { status: 409 }
      );
    }

    if (!order.deliveryOtpExpiresAt) {
      return NextResponse.json(
        {
          ok: false,
          error: "DELIVERY_OTP_EXPIRY_NOT_CONFIGURED",
        },
        { status: 409 }
      );
    }

    if (new Date() > order.deliveryOtpExpiresAt) {
      return NextResponse.json(
        {
          ok: false,
          error: "DELIVERY_OTP_EXPIRED",
        },
        { status: 410 }
      );
    }

    const submittedOtpHash = createHash("sha256")
      .update(otp)
      .digest("hex");

    if (submittedOtpHash !== order.deliveryOtpHash) {
      return NextResponse.json(
        {
          ok: false,
          error: "INVALID_DELIVERY_OTP",
          message: "The OTP provided is incorrect.",
        },
        { status: 400 }
      );
    }

    /*
     * Atomic delivery confirmation.
     *
     * The update only succeeds if the order is still
     * undelivered and the OTP has not already been consumed.
     */
    const result = await prisma.order.updateMany({
      where: {
        id: orderId,
        status: {
          not: "Delivered",
        },
        otpVerifiedAt: null,
      },
      data: {
        status: "Delivered",
        otpVerifiedAt: new Date(),
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "ORDER_ALREADY_DELIVERED",
        },
        { status: 409 }
      );
    }

    const updatedOrder = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      select: {
        id: true,
        status: true,
        otpVerifiedAt: true,
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Delivery OTP verified successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("OTP verification error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}