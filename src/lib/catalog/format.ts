import type { Dimensions, Product } from "./types";

/**
 * Pure, client-safe catalog helpers.
 *
 * Kept separate from ./repository (which is server-only, since it talks to
 * Supabase) so client components can import these without pulling the database
 * layer — and `server-only` — into the browser bundle.
 */

/** Format dimensions as "W × D × H cm" for display. */
export function formatDimensions(d: Dimensions): string {
  return `${d.width} × ${d.depth} × ${d.height} ${d.unit}`;
}

/** The cover image of a product (first image), used by cards and OG tags. */
export function getCoverImage(product: Product) {
  return product.images[0];
}
