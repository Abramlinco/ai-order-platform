// ================================================================
// ORDERPILOT — TRAVO DELIVERY PROVIDER
// Purpose: Get live delivery quotes from Travo
// ================================================================

type TravoQuoteResponse = {
  id: string;
  amount: number;
  currency: string;
  service_type?: string;
  expires_at?: string;
};

export type TravoDeliveryQuote = {
  provider: "travo";
  providerQuoteId: string;
  deliveryFee: number;
  currency: string;
  expiresAt?: string;
};

export async function getTravoDeliveryQuote(
  pickupLocation: string,
  dropoffLocation: string
): Promise<TravoDeliveryQuote> {
  const apiKey = process.env.TRAVO_SECRET_KEY;

  if (!apiKey) {
    throw new Error("TRAVO_SECRET_KEY_NOT_CONFIGURED");
  }

  if (!pickupLocation || !dropoffLocation) {
    throw new Error("DELIVERY_LOCATIONS_REQUIRED");
  }

  const url = new URL(
    "https://api.travo.ng/v1/service-quotes"
  );

  url.searchParams.set("pickup", pickupLocation);
  url.searchParams.set("dropoff", dropoffLocation);
  url.searchParams.set("service_type", "sendparcel");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    console.error(
      "TRAVO QUOTE ERROR:",
      response.status,
      await response.text()
    );

    throw new Error("TRAVO_QUOTE_FAILED");
  }

  const data = await response.json();

  const quote = Array.isArray(data)
    ? data[0]
    : data;

  const result = quote as TravoQuoteResponse;

  if (
    !result ||
    typeof result.id !== "string" ||
    typeof result.amount !== "number" ||
    typeof result.currency !== "string"
  ) {
    throw new Error("INVALID_TRAVO_QUOTE_RESPONSE");
  }

  return {
    provider: "travo",
    providerQuoteId: result.id,

    // Travo returns monetary amounts in kobo.
    deliveryFee: Math.round(result.amount / 100),

    currency: result.currency,

    expiresAt: result.expires_at,
  };
}