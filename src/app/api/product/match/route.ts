import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

function tokenize(value: string) {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const query =
      typeof body.query === "string" ? body.query.trim() : "";

    if (!query) {
      return Response.json(
        {
          ok: false,
          error: "Search query is required",
        },
        { status: 400 }
      );
    }

    const terms = [...new Set(tokenize(query))];

    if (!terms.length) {
      return Response.json({
        ok: true,
        query,
        matches: [],
      });
    }

    const products = await prisma.product.findMany({
      include: {
        variants: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 200,
    });

    const matches = products
      .map((product) => {
        const searchableText = [
          product.name,
          product.category,
          ...product.variants.map((variant) => variant.name),
        ].join(" ");

        const words = tokenize(searchableText);

        const hits = terms.filter((term) =>
          words.some(
            (word) =>
              word === term ||
              word.includes(term) ||
              term.includes(word)
          )
        );

        const uniqueHits = [...new Set(hits)];

        const score =
          terms.length > 0
            ? uniqueHits.length / terms.length
            : 0;

        return {
          product,
          score,
        };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    return Response.json({
      ok: true,
      query,
      matches: matches.map(({ product, score }) => ({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.variants.length
          ? product.variants.reduce(
              (sum, variant) => sum + variant.stock,
              0
            )
          : product.stock,
        variants: product.variants,
        lexicalScore: Number(score.toFixed(3)),
      })),
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Product matching failed";

    return Response.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 }
    );
  }
}