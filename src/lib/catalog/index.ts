/**
 * Public catalog API — the single import surface for the rest of the app.
 *
 * UI code should import from "@/lib/catalog" only, never from "@/data/*" or
 * "./repository" directly. This indirection is the seam that lets the data
 * source change (CMS, API, database) without rewriting any pages or
 * components.
 */
export * from "./types";
export {
  getCategories,
  getCategoriesWithCounts,
  getCategoryBySlug,
  getProducts,
  getProductBySlug,
  getProductsByCategory,
  getFeaturedProducts,
  getNewProducts,
  getActiveSubcategories,
  createProduct,
  updateProduct,
  deleteProduct,
  type WriteResult,
} from "./repository";

// Pure, client-safe helpers live in ./format so they can be imported without
// pulling the server-only repository into a client bundle.
export { formatDimensions, getCoverImage } from "./format";
