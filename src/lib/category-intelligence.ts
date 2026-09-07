import { prisma } from "./prisma";

export type CategoryAttribute = { key: string; value: string };

export type CategoryDecision = {
  category: string | null;
  subcategory: string | null;
  productType: string | null;
  attributes: CategoryAttribute[];
  confidence: number;
  needsConfirmation: boolean;
  reason: string;
};

// Keep this schema within the strict Structured Outputs subset.
// In particular, attributes is an array rather than an open-ended object.
const CATEGORY_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    category: { type: ["string", "null"] },
    subcategory: { type: ["string", "null"] },
    productType: { type: ["string", "null"] },
    attributes: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          key: { type: "string" },
          value: { type: "string" },
        },
        required: ["key", "value"],
      },
    },
    confidence: { type: "number", minimum: 0, maximum: 1 },
    needsConfirmation: { type: "boolean" },
    reason: { type: "string" },
  },
  required: [
    "category",
    "subcategory",
    "productType",
    "attributes",
    "confidence",
    "needsConfirmation",
    "reason",
  ],
} as const;

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export async function getBusinessCategoryCandidates() {
  const rows = await prisma.product.findMany({
    select: { category: true },
    where: { category: { not: "" } },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
  return rows.map((row) => row.category.trim()).filter(Boolean);
}

export async function classifyProduct(input: {
  name: string;
  categoryInput?: string | null;
  candidates?: string[];
}): Promise<CategoryDecision> {
  const name = input.name.trim();
  const categoryInput = input.categoryInput?.trim() || "";
  const candidates = [...new Set((input.candidates || []).map((v) => v.trim()).filter(Boolean))];

  if (!name) throw new Error("Product name is required");

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");

  const model = process.env.OPENAI_CATEGORY_MODEL || "gpt-5.5";

  const instructions = [
    "You are ATIVTRAD's product-category classifier.",
    "Classify only from the supplied product name, supplied category, and existing merchant categories.",
    "Never invent product facts, attributes, stock, price, or a category that is not supported by the evidence.",
    "Prefer an existing merchant category when it is semantically compatible.",
    "If the merchant category conflicts with the product evidence, keep needsConfirmation=true.",
    "A high confidence score means the classification is strongly supported by the input; do not inflate confidence.",
    "If there is meaningful ambiguity, use null for the unresolved hierarchy field and require confirmation.",
    `Product name: ${name}`,
    `Merchant category supplied by owner: ${categoryInput || "(none)"}`,
    `Existing merchant categories: ${candidates.length ? candidates.join(", ") : "(none)"}`,
  ].join("\n");

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: instructions,
      text: {
        format: {
          type: "json_schema",
          name: "ativtrad_category_decision",
          strict: true,
          schema: CATEGORY_SCHEMA,
        },
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI classification failed (${response.status}): ${detail}`);
  }

  const data = await response.json();
  if (!data.output_text) throw new Error("OpenAI returned no classification output");

  let result: CategoryDecision;
  try {
    result = JSON.parse(data.output_text) as CategoryDecision;
  } catch {
    throw new Error("OpenAI returned an invalid classification payload");
  }

  result.confidence = Math.max(0, Math.min(1, Number(result.confidence)));
  result.attributes = Array.isArray(result.attributes)
    ? result.attributes.filter((item) => item && typeof item.key === "string" && typeof item.value === "string")
    : [];

  // Safety gate: AI output is never considered fully validated below 0.85.
  if (result.confidence < 0.85) result.needsConfirmation = true;

  // If the owner supplied a category, the AI must not silently replace it with an
  // unrelated merchant category. The owner gets a confirmation path instead.
  if (categoryInput && result.category && normalize(categoryInput) !== normalize(result.category)) {
    result.needsConfirmation = true;
  }

  // If candidates exist, a result outside that merchant taxonomy is confirmation-only.
  if (candidates.length && result.category) {
    const matched = candidates.some((candidate) => normalize(candidate) === normalize(result.category!));
    if (!matched) result.needsConfirmation = true;
  }

  return result;
}
