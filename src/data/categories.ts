import type { Category } from "@/lib/catalog/types";

/**
 * Seed catalog: categories.
 *
 * Edit this file to add/rename categories. Each category's `slug` is the URL
 * segment (/categories/[slug]) and is referenced by products via
 * `categorySlug`. Keep slugs lowercase and hyphenated.
 *
 * Images are served from /public/images (local, optimized by next/image).
 * Covers reuse a strong scene from within each category.
 */
export const categories: Category[] = [
  {
    slug: "sofas",
    name: "Sofas",
    tagline: "The heart of the room",
    description:
      "Deep, tactile seating made for everyday life — from feather-soft three-seaters to clean contemporary lines.",
    cover: {
      src: "/images/sofas/cloud-1.webp",
      alt: "A deep, feather-soft cream three-seater sofa",
      width: 1600,
      height: 1600,
    },
    order: 1,
    subcategories: [{ slug: "sofas", name: "Sofas" }],
  },
  {
    slug: "living-room",
    name: "Living Room",
    tagline: "Where the day softens",
    description:
      "Sectionals conceived as the quiet centre of a home — generous proportions, soft fabrics, and configurations that wrap a space.",
    cover: {
      src: "/images/sectionals/cascade-1.webp",
      alt: "A soft, angled modular sectional in off-white linen",
      width: 1600,
      height: 1600,
    },
    order: 2,
    subcategories: [{ slug: "sectionals", name: "Sectionals" }],
  },
  {
    slug: "bedroom",
    name: "Bedroom",
    tagline: "Stillness, made tangible",
    description:
      "Upholstered beds designed for rest — wrapped headboards, soft tactile fabrics, and frames built to anchor a room, with optional lift-up storage.",
    cover: {
      src: "/images/beds/haven-1.webp",
      alt: "A low taupe upholstered bed with a soft wrapped headboard",
      width: 1600,
      height: 1600,
    },
    order: 3,
    subcategories: [{ slug: "beds", name: "Beds" }],
  },
  {
    slug: "tv-units",
    name: "TV Units",
    tagline: "Grounded and grain-forward",
    description:
      "Long, low media consoles in solid wood veneers — handleless storage that sits quietly beneath the screen.",
    cover: {
      src: "/images/tv-units/day-natural-oak.webp",
      alt: "A long, low media console in natural oak",
      width: 1800,
      height: 700,
    },
    order: 4,
    subcategories: [{ slug: "tv-units", name: "TV Units" }],
  },
];
