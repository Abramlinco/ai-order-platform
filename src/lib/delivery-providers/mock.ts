export type MockDeliveryQuote = {
  provider: "mock";
  providerQuoteId: string;
  deliveryFee: number;
  currency: string;
  expiresAt: string;
};

export async function getMockDeliveryQuote(
  pickupLocation: string,
  dropoffLocation: string
): Promise<MockDeliveryQuote> {
  if (!pickupLocation || !dropoffLocation) {
    throw new Error("DELIVERY_LOCATIONS_REQUIRED");
  }

  const deliveryFee = Number(
    process.env.MOCK_DELIVERY_FEE || "500"
  );

  if (!Number.isInteger(deliveryFee) || deliveryFee < 0) {
    throw new Error("INVALID_MOCK_DELIVERY_FEE");
  }

  const providerQuoteId = `mock-${Date.now()}`;

  const expiresAt = new Date(
    Date.now() + 30 * 60 * 1000
  ).toISOString();

  return {
    provider: "mock",
    providerQuoteId,
    deliveryFee,
    currency: "NGN",
    expiresAt,
  };
}