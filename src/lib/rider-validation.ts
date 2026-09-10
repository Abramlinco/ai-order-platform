export type RiderValidationResult =
  | { valid: true; name: string; phone: string; bike: string }
  | { valid: false; errors: { name?: string; phone?: string; bike?: string } };

export function normalizeNigerianPhone(value: string) {
  const compact = value.replace(/[\s()-]/g, "");
  if (compact.startsWith("+234")) return compact;
  if (compact.startsWith("234")) return `+${compact}`;
  if (compact.startsWith("0")) return `+234${compact.slice(1)}`;
  return compact;
}

export function isValidNigerianPhone(value: string) {
  const compact = value.replace(/[\s()-]/g, "");
  return /^(?:0(?:70|71|80|81|90|91)\d{8}|\+234(?:70|71|80|81|90|91)\d{8}|234(?:70|71|80|81|90|91)\d{8})$/.test(compact);
}

export function isValidRiderName(value: string) {
  const normalized = value.trim().replace(/\s+/g, " ");
  return /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[\s'-][A-Za-zÀ-ÖØ-öø-ÿ]+)+$/.test(normalized);
}

export function isValidBikeRegistration(value: string) {
  const compact = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return /^(?:[A-Z]{2,3}\d{3,4}[A-Z]{0,2})$/.test(compact);
}

export function validateRiderInput(input: {
  name?: unknown;
  phone?: unknown;
  bike?: unknown;
}): RiderValidationResult {
  const name = typeof input.name === "string" ? input.name.trim().replace(/\s+/g, " ") : "";
  const phoneInput = typeof input.phone === "string" ? input.phone.trim() : "";
  const bike = typeof input.bike === "string" ? input.bike.trim() : "";
  const errors: { name?: string; phone?: string; bike?: string } = {};

  if (!name) errors.name = "Rider name is required.";
  else if (!isValidRiderName(name)) errors.name = "Please enter the rider's first and last name.";

  if (!phoneInput) errors.phone = "Phone number is required.";
  else if (!isValidNigerianPhone(phoneInput)) {
    errors.phone = "Enter a valid Nigerian number, e.g. 08012345678 or +2348012345678.";
  }

  if (!bike) errors.bike = "Bike registration number is required.";
  else if (!isValidBikeRegistration(bike)) {
    errors.bike = "Enter a valid bike registration, e.g. ABC-123-XY.";
  }

  if (Object.keys(errors).length > 0) return { valid: false, errors };

  return {
    valid: true,
    name,
    phone: normalizeNigerianPhone(phoneInput),
    bike: bike.toUpperCase(),
  };
}
