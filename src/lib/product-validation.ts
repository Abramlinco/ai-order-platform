export type ProductInput = {
  name: string;
  category: string;
  price: number;
  stock: number;
};

export type ProductValidationResult =
  | { ok: true; value: ProductInput }
  | { ok: false; error: string };

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function integer(value: unknown) {
  const n = Number(value);
  return Number.isInteger(n) ? n : NaN;
}

export function validateProductInput(item: unknown): ProductValidationResult {
  const source = item && typeof item === "object" ? item as Record<string, unknown> : {};

  const name = text(source.name);
  const category = text(source.category);
  const price = integer(source.price);
  const stock = integer(source.stock);

  if (!name || !category) {
    return { ok: false, error: "Product name and category are required" };
  }

  if (!Number.isInteger(price) || price < 0) {
    return { ok: false, error: "Product price must be a valid non-negative number" };
  }

  if (!Number.isInteger(stock) || stock < 0) {
    return { ok: false, error: "Product stock must be a valid non-negative number" };
  }

  return {
    ok: true,
    value: { name, category, price, stock },
  };
}

export function validateProductRows(items: unknown[]) {
  const normalized: ProductInput[] = [];

  for (let index = 0; index < items.length; index += 1) {
    const result = validateProductInput(items[index]);

    if (!result.ok) {
      return {
        ok: false as const,
        error: `Product row ${index + 1} is invalid: ${result.error}. Nothing was imported.`,
      };
    }

    normalized.push(result.value);
  }

  return {
    ok: true as const,
    products: normalized,
  };
}
