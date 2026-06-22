import "server-only";
import { categories as categoryData } from "@/data/categories";
import { products as productData } from "@/data/products";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type {
  Category,
  CategoryWithCount,
  Product,
  Subcategory,
} from "./types";

/**
 * Catalog repository — the ONLY place that touches the data source.
 *
 * Products come from Supabase when it's configured, and fall back to the static
 * seed in @/data/products otherwise (fresh clone / local dev before setup), so
 * the public site always renders. Categories remain static: they're structural
 * and change rarely. Everything else in the app imports from ./index, never
 * from here, so the source can change without touching call sites.
 *
 * Functions are async so a network-backed source is a drop-in replacement.
 */

const byOrder = (a: Category, b: Category) => a.order - b.order;

type ProductRow = {
  slug: string;
  name: string;
  category_slug: string;
  subcategory_slug: string;
  summary: string;
  description: string;
  images: Product["images"];
  materials: Product["materials"];
  dimensions: Product["dimensions"];
  collection: string | null;
  is_featured: boolean;
  is_new: boolean;
};

function rowToProduct(r: ProductRow): Product {
  return {
    slug: r.slug,
    name: r.name,
    categorySlug: r.category_slug,
    subcategorySlug: r.subcategory_slug,
    summary: r.summary,
    description: r.description,
    images: r.images ?? [],
    materials: r.materials ?? [],
    dimensions: r.dimensions,
    collection: r.collection ?? undefined,
    isFeatured: r.is_featured,
    isNew: r.is_new,
  };
}

function productToRow(p: Product): ProductRow {
  return {
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
  };
}

/**
 * All products from the active source. Supabase when configured (even if it
 * returns an empty set — that's the source of truth once you've migrated),
 * otherwise the static seed.
 */
async function allProducts(): Promise<Product[]> {
  const db = getSupabaseAdmin();
  if (!db) return [...productData];

  const { data, error } = await db
    .from("products")
    .select(
      "slug, name, category_slug, subcategory_slug, summary, description, images, materials, dimensions, collection, is_featured, is_new",
    )
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as ProductRow[]).map(rowToProduct);
}

// --------------------------------------------------------------------------
//  Categories (static)
// --------------------------------------------------------------------------
export async function getCategories(): Promise<Category[]> {
  return [...categoryData].sort(byOrder);
}

export async function getCategoriesWithCounts(): Promise<CategoryWithCount[]> {
  const [cats, products] = await Promise.all([getCategories(), allProducts()]);
  const counts = new Map<string, number>();
  for (const p of products) {
    counts.set(p.categorySlug, (counts.get(p.categorySlug) ?? 0) + 1);
  }
  return cats.map((c) => ({ ...c, productCount: counts.get(c.slug) ?? 0 }));
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  return categoryData.find((c) => c.slug === slug) ?? null;
}

// --------------------------------------------------------------------------
//  Products (Supabase-or-static)
// --------------------------------------------------------------------------
export async function getProducts(): Promise<Product[]> {
  return allProducts();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await allProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getProductsByCategory(
  categorySlug: string,
): Promise<Product[]> {
  const products = await allProducts();
  return products.filter((p) => p.categorySlug === categorySlug);
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const products = await allProducts();
  return products.filter((p) => p.isFeatured).slice(0, limit);
}

export async function getNewProducts(limit = 4): Promise<Product[]> {
  const products = await allProducts();
  return products.filter((p) => p.isNew).slice(0, limit);
}

/**
 * Returns only the subcategories that actually contain at least one product,
 * so filter UIs never show an empty option.
 */
export async function getActiveSubcategories(
  category: Category,
): Promise<Subcategory[]> {
  const products = await allProducts();
  const present = new Set(
    products
      .filter((p) => p.categorySlug === category.slug)
      .map((p) => p.subcategorySlug),
  );
  return category.subcategories.filter((s) => present.has(s.slug));
}

// --------------------------------------------------------------------------
//  Product writes (admin) — require Supabase. The static seed is read-only at
//  runtime (especially on serverless), so writes are rejected without a DB.
// --------------------------------------------------------------------------
export interface WriteResult {
  ok: boolean;
  error?: string;
}

export async function createProduct(p: Product): Promise<WriteResult> {
  const db = getSupabaseAdmin();
  if (!db)
    return { ok: false, error: "Connect Supabase to manage products." };

  const { error } = await db.from("products").insert(productToRow(p));
  if (error) {
    const msg =
      error.code === "23505"
        ? "A product with that slug already exists."
        : error.message;
    return { ok: false, error: msg };
  }
  return { ok: true };
}

export async function updateProduct(
  slug: string,
  p: Product,
): Promise<WriteResult> {
  const db = getSupabaseAdmin();
  if (!db)
    return { ok: false, error: "Connect Supabase to manage products." };

  const { error } = await db
    .from("products")
    .update(productToRow(p))
    .eq("slug", slug);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function deleteProduct(slug: string): Promise<WriteResult> {
  const db = getSupabaseAdmin();
  if (!db)
    return { ok: false, error: "Connect Supabase to manage products." };

  const { error } = await db.from("products").delete().eq("slug", slug);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
