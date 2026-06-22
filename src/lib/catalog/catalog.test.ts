import { describe, it, expect } from "vitest";
import {
  getCategories,
  getCategoriesWithCounts,
  getCategoryBySlug,
  getProductBySlug,
  getProductsByCategory,
  getFeaturedProducts,
  getNewProducts,
  getActiveSubcategories,
  formatDimensions,
  getCoverImage,
} from "./index";

describe("catalog repository", () => {
  it("returns categories sorted by order", async () => {
    const cats = await getCategories();
    const orders = cats.map((c) => c.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it("annotates categories with an accurate product count", async () => {
    const withCounts = await getCategoriesWithCounts();
    for (const cat of withCounts) {
      const products = await getProductsByCategory(cat.slug);
      expect(cat.productCount).toBe(products.length);
    }
  });

  it("looks up a category by slug and returns null when missing", async () => {
    expect(await getCategoryBySlug("living-room")).not.toBeNull();
    expect(await getCategoryBySlug("does-not-exist")).toBeNull();
  });

  it("looks up a product by slug and returns null when missing", async () => {
    const product = await getProductBySlug("cloud-sofa");
    expect(product?.name).toBe("Cloud 3-Seater Sofa");
    expect(await getProductBySlug("nope")).toBeNull();
  });

  it("only returns products belonging to the requested category", async () => {
    const products = await getProductsByCategory("living-room");
    expect(products.length).toBeGreaterThan(0);
    expect(products.every((p) => p.categorySlug === "living-room")).toBe(true);
  });

  it("returns only featured products, respecting the limit", async () => {
    const featured = await getFeaturedProducts(2);
    expect(featured.length).toBeLessThanOrEqual(2);
    expect(featured.every((p) => p.isFeatured)).toBe(true);
  });

  it("returns only new products", async () => {
    const fresh = await getNewProducts();
    expect(fresh.every((p) => p.isNew)).toBe(true);
  });

  it("returns only subcategories that contain products", async () => {
    const cat = await getCategoryBySlug("living-room");
    expect(cat).not.toBeNull();
    const active = await getActiveSubcategories(cat!);
    const products = await getProductsByCategory("living-room");
    const present = new Set(products.map((p) => p.subcategorySlug));
    expect(active.every((s) => present.has(s.slug))).toBe(true);
  });

  it("references valid categories and subcategories from every product", async () => {
    // Integrity check: each product points at an existing category + subcategory.
    const cats = await getCategories();
    const catBySlug = new Map(cats.map((c) => [c.slug, c]));
    for (const cat of cats) {
      const products = await getProductsByCategory(cat.slug);
      for (const p of products) {
        const owner = catBySlug.get(p.categorySlug);
        expect(owner, `category for ${p.slug}`).toBeDefined();
        const subSlugs = owner!.subcategories.map((s) => s.slug);
        expect(subSlugs, `subcategory for ${p.slug}`).toContain(
          p.subcategorySlug,
        );
      }
    }
  });
});

describe("catalog formatting helpers", () => {
  it("formats dimensions as W × D × H with unit", () => {
    expect(
      formatDimensions({ width: 240, depth: 98, height: 78, unit: "cm" }),
    ).toBe("240 × 98 × 78 cm");
  });

  it("returns the first image as the cover", async () => {
    const product = await getProductBySlug("cloud-sofa");
    expect(product).not.toBeNull();
    expect(getCoverImage(product!)).toBe(product!.images[0]);
  });
});
