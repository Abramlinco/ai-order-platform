import { NextRequest } from "next/server";
import { classifyProduct, getBusinessCategoryCandidates } from "@/lib/category-intelligence";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const category = typeof body.category === "string" ? body.category.trim() : null;

    if (!name) {
      return Response.json({ ok: false, error: "Product name is required" }, { status: 400 });
    }

    const candidates = Array.isArray(body.candidates)
      ? body.candidates.filter((value: unknown): value is string => typeof value === "string")
      : await getBusinessCategoryCandidates();

    const decision = await classifyProduct({ name, categoryInput: category, candidates });
    return Response.json({ ok: true, decision });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Category classification failed";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
