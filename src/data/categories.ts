import type { Category } from "@/lib/catalog/types";

/**
 * Seed catalog: categories.
 *
 * Edit this file to add/rename categories. Each category's `slug` is the URL
 * segment (/categories/[slug]) and is referenced by products via
 * `categorySlug`. Keep slugs lowercase and hyphenated.
 *
 * Images are served from /public/images (local, optimized by next/image).
 * Covers reuse a strong styled scene from within each category.
 */
export const categories: Category[] = [
  {
    slug: "living-room",
    name: "Living Room",
    tagline: "Where the day softens",
    description:
      "Sofas and sectionals conceived as the quiet centre of a home — generous proportions, soft tactile fabrics, and lines that age gracefully.",
    cover: {
      src: "/images/living-room/halston-sectional-1.webp",
      alt: "A cream L-shaped sectional styled in a bright, panelled living room",
      width: 600,
      height: 450,
    },
    order: 1,
    subcategories: [
      { slug: "sofas", name: "Sofas" },
      { slug: "sectionals", name: "Sectionals" },
    ],
  },
  {
    slug: "bedroom",
    name: "Bedroom",
    tagline: "Stillness, made tangible",
    description:
      "Upholstered beds designed for rest — wrapped headboards, soft tactile fabrics, and frames built to anchor a room without crowding it.",
    cover: {
      src: "/images/bedroom/hugo-bed-1.webp",
      alt: "A beige upholstered bed with a soft, gently curved headboard",
      width: 1800,
      height: 900,
    },
    order: 2,
    subcategories: [{ slug: "beds", name: "Beds" }],
  },
];
