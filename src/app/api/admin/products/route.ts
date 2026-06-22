import { NextResponse, type NextRequest } from "next/server";
import { isSameOrigin } from "@/lib/http";
import { validateProduct } from "@/lib/validation/product";
import { createProduct } from "@/lib/catalog";

/**
 * Create a product. Auth is enforced by middleware for /api/admin/*; we add a
 * same-origin check as CSRF defense-in-depth.
 */
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const result = validateProduct(body);
  if (!result.success) {
    return NextResponse.json(
      { ok: false, fieldErrors: result.errors },
      { status: 422 },
    );
  }

  const write = await createProduct(result.data);
  if (!write.ok) {
    return NextResponse.json({ ok: false, error: write.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true, slug: result.data.slug });
}
