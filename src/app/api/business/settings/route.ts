import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const business = await prisma.business.findFirst();

    if (!business) {
      return NextResponse.json(
        {
          ok: false,
          error: "Business not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      business,
    });
  } catch (error) {
    console.error("BUSINESS SETTINGS GET ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Something went wrong while loading business settings",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      phone,
      address,
      latitude,
      longitude,
      placeId,
      localDeliveryEnabled,
      interstateDeliveryEnabled,
      interstatePricingMethod,
      interstateFixedFee,
    } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        {
          ok: false,
          error: "Business name is required",
        },
        { status: 400 }
      );
    }

    if (
      interstatePricingMethod !== "Fixed" &&
      interstatePricingMethod !== "PerOrder" &&
      interstatePricingMethod !== "ExternalProvider"
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid interstate pricing method",
        },
        { status: 400 }
      );
    }

    if (
      interstatePricingMethod === "Fixed" &&
      (interstateFixedFee === undefined ||
        interstateFixedFee === null ||
        typeof interstateFixedFee !== "number" ||
        !Number.isInteger(interstateFixedFee) ||
        interstateFixedFee < 0)
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "A valid interstate fixed fee is required when pricing method is Fixed",
        },
        { status: 400 }
      );
    }

    const business = await prisma.business.findFirst();

    let savedBusiness;

    if (business) {
      savedBusiness = await prisma.business.update({
        where: {
          id: business.id,
        },
        data: {
          name,
          phone,
          address,
          latitude,
          longitude,
          placeId,
          localDeliveryEnabled,
          interstateDeliveryEnabled,
          interstatePricingMethod,
          interstateFixedFee:
            interstatePricingMethod === "Fixed"
              ? interstateFixedFee
              : null,
        },
      });
    } else {
      savedBusiness = await prisma.business.create({
        data: {
          name,
          phone,
          address,
          latitude,
          longitude,
          placeId,
          localDeliveryEnabled,
          interstateDeliveryEnabled,
          interstatePricingMethod,
          interstateFixedFee:
            interstatePricingMethod === "Fixed"
              ? interstateFixedFee
              : null,
        },
      });
    }

    return NextResponse.json({
      ok: true,
      business: savedBusiness,
    });
  } catch (error) {
    console.error("BUSINESS SETTINGS PUT ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Something went wrong while saving business settings",
      },
      { status: 500 }
    );
  }
}