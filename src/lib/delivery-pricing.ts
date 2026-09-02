// ================================================================
// ORDERPILOT — DELIVERY PRICING SERVICE
// Purpose: Provider-agnostic delivery pricing
// ================================================================

import { getTravoDeliveryQuote } from "./delivery-providers/travo";
import { getMockDeliveryQuote } from "./delivery-providers/mock";

export type DeliveryPricingRequest = {
  pickupLocation: string;
  dropoffLocation: string;
};

export type DeliveryPricingResult = {
  provider: string;
  providerQuoteId: string;

  deliveryFee: number;
  currency: string;

  expiresAt?: string;
};

export async function calculateDeliveryPrice(
  request: DeliveryPricingRequest
): Promise<DeliveryPricingResult> {
  if (!request.pickupLocation || !request.dropoffLocation) {
    throw new Error("DELIVERY_LOCATIONS_REQUIRED");
  }

  const provider =
    process.env.DELIVERY_PROVIDER || "travo";

  switch (provider) {
  case "travo":
    return getTravoDeliveryQuote(
      request.pickupLocation,
      request.dropoffLocation
    );

  case "mock":
    return getMockDeliveryQuote(
      request.pickupLocation,
      request.dropoffLocation
    );

  default:
    throw new Error(
      `UNSUPPORTED_DELIVERY_PROVIDER:${provider}`
    );
}
}