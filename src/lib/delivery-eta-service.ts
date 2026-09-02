import { getMockDeliveryEta } from "./delivery-providers/mock-eta";

export type DeliveryEtaRequest = {
  pickupLocation: string;
  dropoffLocation: string;
};

export type DeliveryEtaResult = {
  estimatedDurationMinutes: number;
  distanceKm: number;
  trafficAware: boolean;
  provider: string;
};

export async function getDeliveryEta(
  request: DeliveryEtaRequest
): Promise<DeliveryEtaResult> {
  if (!request.pickupLocation || !request.dropoffLocation) {
    throw new Error("DELIVERY_LOCATIONS_REQUIRED");
  }

  const provider = process.env.DELIVERY_ETA_PROVIDER || "mock";

switch (provider) {
  case "mock":
    return getMockDeliveryEta(
      request.pickupLocation,
      request.dropoffLocation
    );

  default:
    throw new Error(
      `UNSUPPORTED_DELIVERY_ETA_PROVIDER:${provider}`
    );
}
}