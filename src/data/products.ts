import type { CatalogImage, Product } from "@/lib/catalog/types";

/**
 * Seed catalog: products.
 *
 * Each product references a category via `categorySlug` and a subcategory via
 * `subcategorySlug` (both must exist in categories.ts). The first image in
 * `images` is treated as the cover. `isFeatured` / `isNew` drive the home page
 * rails. Keep `slug` globally unique — it is the product URL (/products/[slug]).
 *
 * Images live under /public/images/<category>/. Because next/image renders
 * these with `fill`, the width/height below are advisory (used by the type and
 * any future fixed-size rendering), not layout-critical.
 */

const img = (
  src: string,
  alt: string,
  width = 1200,
  height = 1200,
): CatalogImage => ({ src, alt, width, height });

const LR = "/images/living-room";
const BR = "/images/bedroom";

export const products: Product[] = [
  // ------------------------------- SOFAS ---------------------------------
  {
    slug: "cloud-sofa",
    name: "Cloud 3-Seater Sofa",
    categorySlug: "living-room",
    subcategorySlug: "sofas",
    summary: "A deep, feather-soft three-seater you sink straight into.",
    description:
      "The Cloud lives up to its name — overstuffed, feather-wrapped cushions over a generous frame, dressed in a soft cream weave. The loose back pillows and rounded arms make it as relaxed as it looks, while a hidden hardwood frame keeps it built to last.",
    images: [
      img(`${LR}/cloud-sofa-1.webp`, "Cloud three-seater sofa in cream fabric, front view"),
      img(`${LR}/cloud-sofa-2.webp`, "Cloud three-seater sofa, angled view"),
      img(`${LR}/cloud-sofa-3.webp`, "Cloud three-seater sofa, side detail"),
    ],
    materials: [
      { name: "Soft cream performance weave" },
      { name: "Feather-wrapped foam cushions" },
      { name: "Kiln-dried hardwood frame" },
    ],
    dimensions: { width: 240, depth: 105, height: 85, seatHeight: 45, unit: "cm" },
    collection: "Signature",
    isFeatured: true,
  },
  {
    slug: "oslo-sofa",
    name: "Oslo 3-Seater Sofa",
    categorySlug: "living-room",
    subcategorySlug: "sofas",
    summary: "A tailored three-seater in textured oatmeal on a raised wood base.",
    description:
      "Oslo balances comfort and structure — plump bench cushions and a clean back line raised on a pale solid-wood base. Its softly textured oatmeal weave brings warmth to a restrained, contemporary silhouette that suits almost any room.",
    images: [
      img(`${LR}/oslo-sofa-1.webp`, "Oslo three-seater sofa in oatmeal fabric, front view"),
      img(`${LR}/oslo-sofa-2.webp`, "Oslo three-seater sofa, angled view"),
      img(`${LR}/oslo-sofa-3.webp`, "Oslo three-seater sofa, side profile"),
    ],
    materials: [
      { name: "Textured oatmeal weave" },
      { name: "Solid wood base" },
      { name: "High-resilience foam cushions" },
    ],
    dimensions: { width: 230, depth: 98, height: 82, seatHeight: 46, unit: "cm" },
    collection: "Atelier",
    isNew: true,
  },
  {
    slug: "marlow-sofa",
    name: "Marlow Slipcover Sofa",
    categorySlug: "living-room",
    subcategorySlug: "sofas",
    summary: "A low, lounge-depth sofa with a relaxed, fully removable slipcover.",
    description:
      "Marlow is built for slow afternoons — a low seat, extra depth, and a soft tailored slipcover that lifts off completely for cleaning. Scatter cushions in the same cloth complete an easy, understated look.",
    images: [
      img(`${LR}/marlow-sofa-1.webp`, "Marlow slipcover sofa in cream, front view"),
      img(`${LR}/marlow-sofa-2.webp`, "Marlow slipcover sofa, wide view"),
      img(`${LR}/marlow-sofa-3.webp`, "Marlow slipcover sofa, detail"),
    ],
    materials: [
      { name: "Removable washable slipcover" },
      { name: "Down-blend cushions" },
    ],
    dimensions: { width: 260, depth: 110, height: 78, seatHeight: 42, unit: "cm" },
    collection: "Atelier",
  },
  {
    slug: "cascade-sofa",
    name: "Cascade Lounge Sofa",
    categorySlug: "living-room",
    subcategorySlug: "sofas",
    summary: "A deep, enveloping lounge sofa in a soft taupe slipcover.",
    description:
      "Cascade is all about comfort — deep seats, soft rolled arms, and a relaxed taupe slipcover that drapes into gentle folds. A pair of plump back cushions and matching scatters make it the easiest seat in the house.",
    images: [
      img(`${LR}/cascade-sofa-1.webp`, "Cascade lounge sofa in taupe slipcover, front view", 1800, 1800),
    ],
    materials: [
      { name: "Soft taupe slipcover fabric" },
      { name: "Feather-and-foam cushions" },
    ],
    dimensions: { width: 250, depth: 112, height: 80, seatHeight: 44, unit: "cm" },
    collection: "Signature",
  },
  {
    slug: "avant-garde-sofa",
    name: "Avant-Garde Sofa",
    categorySlug: "living-room",
    subcategorySlug: "sofas",
    summary: "A clean, contemporary sofa in light grey with a low profile.",
    description:
      "Avant-Garde keeps things crisp — a low back, neat track arms and a tight, modern seat in a light grey weave. It anchors a room without dominating it, and pairs effortlessly with the rest of the collection.",
    images: [
      img(`${LR}/avant-garde-sofa-1.webp`, "Avant-Garde sofa in light grey fabric, front view", 1800, 1800),
    ],
    materials: [
      { name: "Light grey upholstery weave" },
      { name: "High-resilience foam" },
    ],
    dimensions: { width: 220, depth: 95, height: 75, seatHeight: 43, unit: "cm" },
    collection: "Atelier",
    isNew: true,
  },

  // ----------------------------- SECTIONALS ------------------------------
  {
    slug: "halston-corner-sectional",
    name: "Halston Corner Sectional",
    categorySlug: "living-room",
    subcategorySlug: "sectionals",
    summary: "A generous L-shaped sectional that wraps a room in comfort.",
    description:
      "Halston is made for gathering — a roomy L-shaped configuration with deep seats and a soft cream weave, finished with a layer of mixed scatter cushions. It shapes an open-plan living space into a warm, inviting corner.",
    images: [
      img(`${LR}/halston-sectional-1.webp`, "Cream Halston L-shaped sectional styled in a bright panelled living room", 1200, 900),
      img(`${LR}/halston-sectional-2.webp`, "Halston sectional, studio view", 1200, 900),
      img(`${LR}/halston-sectional-3.webp`, "Halston sectional, alternate angle", 1200, 900),
    ],
    materials: [
      { name: "Cream textured weave" },
      { name: "Pocket-sprung seat cushions" },
      { name: "Hardwood frame" },
    ],
    dimensions: { width: 320, depth: 250, height: 88, seatHeight: 46, unit: "cm" },
    collection: "Signature",
    isFeatured: true,
  },
  {
    slug: "rivera-u-sectional",
    name: "Rivera U-Sectional",
    categorySlug: "living-room",
    subcategorySlug: "sectionals",
    summary: "A modular U-shaped sectional that seats the whole family.",
    description:
      "Rivera is a true centrepiece — a large modular U-shape that can be arranged to fit your room, with plush seats and a soft beige weave. Built in sections, it adapts as your space changes.",
    images: [
      img(`${LR}/rivera-sectional-1.webp`, "Rivera beige U-shaped modular sectional, top view", 1200, 800),
      img(`${LR}/rivera-sectional-2.jpg`, "Rivera U-sectional styled in a living room", 1200, 800),
      img(`${LR}/rivera-sectional-3.webp`, "Rivera U-sectional, detail", 1200, 800),
    ],
    materials: [
      { name: "Soft beige weave" },
      { name: "Modular section construction" },
      { name: "High-resilience foam" },
    ],
    dimensions: { width: 360, depth: 280, height: 85, seatHeight: 45, unit: "cm" },
    collection: "Signature",
  },
  {
    slug: "cosmo-modular-sectional",
    name: "Cosmo Modular Sectional",
    categorySlug: "living-room",
    subcategorySlug: "sectionals",
    summary: "A low, modular sectional with a chaise and slim chrome legs.",
    description:
      "Cosmo brings a lighter, more contemporary line — low modular blocks raised on slim chrome feet, with a deep chaise to stretch out on. Its mixed-tone weave and clean base keep a large piece feeling airy.",
    images: [
      img(`${LR}/cosmo-sectional-1.webp`, "Cosmo modular sectional with chaise and chrome legs, front view", 1200, 800),
    ],
    materials: [
      { name: "Mixed-tone upholstery weave" },
      { name: "Polished chrome legs" },
      { name: "Modular foam seating" },
    ],
    dimensions: { width: 340, depth: 170, height: 70, seatHeight: 42, unit: "cm" },
    collection: "Atelier",
    isNew: true,
  },

  // ------------------------------- BEDS ----------------------------------
  {
    slug: "hugo-bed",
    name: "Hugo Upholstered Bed",
    categorySlug: "bedroom",
    subcategorySlug: "beds",
    summary: "A softly tailored bed with a gently curved, wrapped headboard.",
    description:
      "Hugo wraps the room in calm — a fully upholstered frame in a warm beige weave, topped with a soft, gently curved headboard that invites you to lean back. A low platform base keeps the proportions grounded and serene.",
    images: [
      img(`${BR}/hugo-bed-1.webp`, "Hugo upholstered bed in beige fabric with a curved headboard", 1800, 950),
    ],
    materials: [
      { name: "Beige upholstery weave" },
      { name: "Padded wrapped headboard" },
      { name: "Solid timber frame" },
    ],
    dimensions: { width: 196, depth: 215, height: 110, unit: "cm" },
    collection: "Signature",
    isFeatured: true,
  },
  {
    slug: "lora-bed",
    name: "Lora Curved Bed",
    categorySlug: "bedroom",
    subcategorySlug: "beds",
    summary: "A rounded, fully-upholstered bed with a soft sculptural headboard.",
    description:
      "Lora is quietly sculptural — a continuous, rounded headboard and base wrapped in a rich teal-blue weave. The soft curves and deep colour make the bed the centrepiece of the room, with no hard edges in sight.",
    images: [
      img(`${BR}/lora-bed-1.webp`, "Lora curved upholstered bed in teal-blue fabric", 1800, 950),
    ],
    materials: [
      { name: "Teal-blue upholstery weave" },
      { name: "Rounded wrapped headboard" },
      { name: "Solid timber frame" },
    ],
    dimensions: { width: 196, depth: 215, height: 105, unit: "cm" },
    collection: "Atelier",
    isNew: true,
  },
];
