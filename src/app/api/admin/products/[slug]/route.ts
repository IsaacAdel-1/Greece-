import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { isSameOrigin } from "@/lib/http";
import { validateProduct } from "@/lib/validation/product";
import { deleteProduct, getProductBySlug, updateProduct } from "@/lib/catalog";

/** Update / delete a single product, keyed by its (original) slug. */
export const runtime = "nodejs";

function forbidIfCrossSite(req: NextRequest): NextResponse | null {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const blocked = forbidIfCrossSite(req);
  if (blocked) return blocked;

  const { slug } = await params;

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

  const write = await updateProduct(slug, result.data);
  if (!write.ok) {
    return NextResponse.json({ ok: false, error: write.error }, { status: 400 });
  }

  // Refresh the affected public pages after a successful update.
  revalidatePath("/");
  revalidatePath("/categories");
  revalidatePath(`/categories/${result.data.categorySlug}`);
  revalidatePath(`/products/${result.data.slug}`);
  // If the slug changed, also refresh the old product URL.
  if (slug !== result.data.slug) revalidatePath(`/products/${slug}`);

  return NextResponse.json({ ok: true, slug: result.data.slug });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const blocked = forbidIfCrossSite(req);
  if (blocked) return blocked;

  const { slug } = await params;
  // Look up the product first so we know which category page to refresh.
  const existing = await getProductBySlug(slug);
  const write = await deleteProduct(slug);
  if (!write.ok) {
    return NextResponse.json({ ok: false, error: write.error }, { status: 400 });
  }

  // Refresh listings so the removed item disappears.
  revalidatePath("/");
  revalidatePath("/categories");
  if (existing) revalidatePath(`/categories/${existing.categorySlug}`);
  revalidatePath(`/products/${slug}`);

  return NextResponse.json({ ok: true });
}
