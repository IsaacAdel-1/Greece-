import { describe, expect, it } from "vitest";
import { validateProduct } from "./product";

const base = {
  slug: "belgrave-sofa",
  name: "Belgrave Sofa",
  categorySlug: "living-room",
  subcategorySlug: "sofas",
  summary: "A clean-lined three-seater.",
  description: "A generous three-seater with a tailored silhouette.",
  images: [{ src: "/img/a.webp", alt: "Belgrave sofa, front", width: 1200, height: 1200 }],
  materials: [{ name: "Hardwood frame" }],
  dimensions: { width: 240, depth: 98, height: 80, unit: "cm" },
  isFeatured: true,
  isNew: false,
};

describe("validateProduct", () => {
  it("accepts a well-formed product and maps to the domain shape", () => {
    const r = validateProduct(base);
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.slug).toBe("belgrave-sofa");
      expect(r.data.isFeatured).toBe(true);
      expect(r.data.dimensions.unit).toBe("cm");
    }
  });

  it("rejects an invalid slug with a field error", () => {
    const r = validateProduct({ ...base, slug: "Not A Slug!" });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.errors.slug).toBeDefined();
  });

  it("requires at least one image", () => {
    const r = validateProduct({ ...base, images: [] });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.errors.images).toBeDefined();
  });

  it("flags missing alt text on a nested image path", () => {
    const r = validateProduct({
      ...base,
      images: [{ src: "/img/a.webp", alt: "", width: 100, height: 100 }],
    });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.errors["images.0.alt"]).toBeDefined();
  });

  it("drops blank materials and keeps optional descriptions", () => {
    const r = validateProduct({
      ...base,
      materials: [{ name: "" }, { name: "Oak", description: "Solid" }],
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.materials).toEqual([{ name: "Oak", description: "Solid" }]);
    }
  });

  it("coerces numeric dimension strings (from form inputs)", () => {
    const r = validateProduct({
      ...base,
      dimensions: { width: "240", depth: "98", height: "80", unit: "cm" },
    });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.dimensions.width).toBe(240);
  });
});
