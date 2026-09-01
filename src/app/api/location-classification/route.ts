import { NextResponse } from "next/server";
import {
  classifyDeliveryLocation,
  type LocationInput,
} from "@/lib/location-classification";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const businessLocation: LocationInput = body.businessLocation;
    const customerLocation: LocationInput = body.customerLocation;

    const deliveryType = classifyDeliveryLocation(
      businessLocation,
      customerLocation
    );

    return NextResponse.json({
      ok: true,
      deliveryType,
    });
  } catch (error) {
    console.error("LOCATION CLASSIFICATION ERROR:", error);

    const message =
      error instanceof Error ? error.message : "Unknown location error";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 400 }
    );
  }
}