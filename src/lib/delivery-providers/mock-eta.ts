export type MockEtaResult = {
  estimatedDurationMinutes: number;
  distanceKm: number;
  trafficAware: boolean;
  provider: "mock";
};

export async function getMockDeliveryEta(
  pickupLocation: string,
  dropoffLocation: string
): Promise<MockEtaResult> {
  if (!pickupLocation || !dropoffLocation) {
    throw new Error("DELIVERY_LOCATIONS_REQUIRED");
  }

  const estimatedDurationMinutes = Number(
    process.env.MOCK_DELIVERY_ETA_MINUTES || "35"
  );

  const distanceKm = Number(
    process.env.MOCK_DELIVERY_DISTANCE_KM || "15"
  );

  if (
    !Number.isInteger(estimatedDurationMinutes) ||
    estimatedDurationMinutes <= 0
  ) {
    throw new Error("INVALID_MOCK_DELIVERY_ETA");
  }

  if (!Number.isFinite(distanceKm) || distanceKm <= 0) {
    throw new Error("INVALID_MOCK_DELIVERY_DISTANCE");
  }

  return {
    estimatedDurationMinutes,
    distanceKm,
    trafficAware: true,
    provider: "mock",
  };
}