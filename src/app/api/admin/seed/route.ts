import { NextResponse, type NextRequest } from "next/server";
import { isSameOrigin } from "@/lib/http";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { products as seedProducts } from "@/data/products";

/**
 * One-time catalogue import: pushes the static seed in @/data/products into
 * Supabase. Idempotent — existing slugs are left untouched (ignoreDuplicates),
 * so it's safe to run more than once. Protected by admin middleware + a
 * same-origin check.
 */
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const db = getSupabaseAdmin();
  if (!db) {
    return NextResponse.json(
      { ok: false, error: "Connect Supabase first." },
      { status: 400 },
    );
  }

  const rows = seedProducts.map((p) => ({
    slug: p.slug,
    name: p.name,
    category_slug: p.categorySlug,
    subcategory_slug: p.subcategorySlug,
    summary: p.summary,
    description: p.description,
    images: p.images,
    materials: p.materials,
    dimensions: p.dimensions,
    collection: p.collection ?? null,
    is_featured: Boolean(p.isFeatured),
    is_new: Boolean(p.isNew),
  }));

  const { error } = await db
    .from("products")
    .upsert(rows, { onConflict: "slug", ignoreDuplicates: true });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, imported: rows.length });
}
