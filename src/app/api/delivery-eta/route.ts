import { NextResponse } from "next/server";
import { getDeliveryEta } from "@/lib/delivery-eta-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await getDeliveryEta({
      pickupLocation: body.pickupLocation,
      dropoffLocation: body.dropoffLocation,
    });

    return NextResponse.json({
      ok: true,
      eta: result,
    });
  } catch (error) {
    console.error("DELIVERY ETA ERROR:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unknown delivery ETA error";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 400 }
    );
  }
}