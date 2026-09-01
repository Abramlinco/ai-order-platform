import { NextResponse } from "next/server";
import { getDeliveryPricingDecision } from "@/lib/delivery-pricing-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await getDeliveryPricingDecision({
      customerAddress: body.customerAddress,
      customerLocation: body.customerLocation,
    });

    return NextResponse.json({
      ok: true,
      pricing: result,
    });
  } catch (error) {
    console.error("DELIVERY PRICING ERROR:", error);

    const message =
      error instanceof Error ? error.message : "Unknown delivery pricing error";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 400 }
    );
  }
}