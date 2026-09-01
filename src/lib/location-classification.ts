export type DeliveryLocationType = "Local" | "Interstate";

export type LocationInput = {
  state: string;
};

export function classifyDeliveryLocation(
  businessLocation: LocationInput,
  customerLocation: LocationInput
): DeliveryLocationType {
  if (!businessLocation.state || !customerLocation.state) {
    throw new Error("LOCATION_STATE_REQUIRED");
  }

  const businessState = businessLocation.state.trim().toLowerCase();
  const customerState = customerLocation.state.trim().toLowerCase();

  if (businessState === customerState) {
    return "Local";
  }

  return "Interstate";
}