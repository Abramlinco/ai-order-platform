import { prisma } from "@/lib/prisma";
import { calculateDeliveryPrice } from "./delivery-pricing";
import {
  classifyDeliveryLocation,
  type LocationInput,
} from "./location-classification";

export type DeliveryPricingRequest = {
  customerLocation: LocationInput;
  customerAddress: string;
};

export type DeliveryPricingDecision = {
  deliveryType: "Local" | "Interstate";
  deliveryFee: number;
  currency: string;
  provider?: string;
  providerQuoteId?: string;
  expiresAt?: string;
};

export async function getDeliveryPricingDecision(
  request: DeliveryPricingRequest
): Promise<DeliveryPricingDecision> {
  if (!request.customerAddress) {
    throw new Error("CUSTOMER_ADDRESS_REQUIRED");
  }

  if (!request.customerLocation?.state) {
    throw new Error("LOCATION_STATE_REQUIRED");
  }

  const business = await prisma.business.findFirst();

  if (!business) {
    throw new Error("BUSINESS_NOT_FOUND");
  }

  if (!business.address) {
    throw new Error("BUSINESS_LOCATION_NOT_CONFIGURED");
  }

  /*
   * Temporary business-state value.
   *
   * Later, the business location resolver will provide
   * the authoritative state from the saved business
   * location.
   */
 
  if (!business.state) {
  throw new Error("BUSINESS_STATE_NOT_CONFIGURED");
}

const businessLocation: LocationInput = {
  state: business.state,
};

  const deliveryType = classifyDeliveryLocation(
    businessLocation,
    request.customerLocation
  );

  if (deliveryType === "Local") {
    if (!business.localDeliveryEnabled) {
      throw new Error("LOCAL_DELIVERY_DISABLED");
    }

    const result = await calculateDeliveryPrice({
      pickupLocation: business.address,
      dropoffLocation: request.customerAddress,
    });

    return {
      deliveryType: "Local",
      deliveryFee: result.deliveryFee,
      currency: result.currency,
      provider: result.provider,
      providerQuoteId: result.providerQuoteId,
      expiresAt: result.expiresAt,
    };
  }

  if (!business.interstateDeliveryEnabled) {
    throw new Error("INTERSTATE_DELIVERY_DISABLED");
  }

  switch (business.interstatePricingMethod) {
    case "Fixed":
      if (business.interstateFixedFee === null) {
        throw new Error("INTERSTATE_FIXED_FEE_NOT_CONFIGURED");
      }

      return {
        deliveryType: "Interstate",
        deliveryFee: business.interstateFixedFee,
        currency: "NGN",
      };

    case "PerOrder":
      throw new Error("INTERSTATE_PER_ORDER_FEE_REQUIRED");

    case "ExternalProvider":
      throw new Error("INTERSTATE_EXTERNAL_PROVIDER_NOT_CONFIGURED");

    default:
      throw new Error("INVALID_INTERSTATE_PRICING_METHOD");
  }
}