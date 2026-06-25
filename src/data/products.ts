import type { CatalogImage, Product } from "@/lib/catalog/types";

/**
 * Seed catalog: products.
 *
 * Each product references a category via `categorySlug` and a subcategory via
 * `subcategorySlug` (both must exist in categories.ts). The first image in
 * `images` is treated as the cover. `isFeatured` / `isNew` drive the home page
 * rails. Keep `slug` globally unique — it is the product URL (/products/[slug]).
 *
 * Images live under /public/images/<group>/. Because next/image renders these
 * with object-contain, the width/height below are advisory, not layout-critical.
 */

const img = (
  src: string,
  alt: string,
  width = 1600,
  height = 1600,
): CatalogImage => ({ src, alt, width, height });

const SOFAS = "/images/sofas";
const SEC = "/images/sectionals";
const BEDS = "/images/beds";
const TV = "/images/tv-units";

// Shared lift-up storage feature shown on the upholstered beds.
const storage = (): CatalogImage =>
  img(`${BEDS}/storage-mechanism-1.webp`, "Lift-up slatted storage base, shown raised", 1800, 950);

export const products: Product[] = [
  // ------------------------------- SOFAS ---------------------------------
  {
    slug: "cloud-sofa",
    name: "Cloud 3-Seater Sofa",
    categorySlug: "sofas",
    subcategorySlug: "sofas",
    summary: "A deep, feather-soft three-seater you sink straight into.",
    description:
      "The Cloud lives up to its name — overstuffed, feather-wrapped cushions over a generous frame, dressed in a soft cream weave. The loose back pillows and rounded arms make it as relaxed as it looks, while a hidden hardwood frame keeps it built to last.",
    images: [
      img(`${SOFAS}/cloud-1.webp`, "Cloud three-seater sofa in cream fabric, front view"),
      img(`${SOFAS}/cloud-2.webp`, "Cloud three-seater sofa, angled view"),
      img(`${SOFAS}/cloud-3.webp`, "Cloud three-seater sofa, side detail"),
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
    categorySlug: "sofas",
    subcategorySlug: "sofas",
    summary: "A tailored three-seater in textured oatmeal on a raised wood base.",
    description:
      "Oslo balances comfort and structure — plump bench cushions and a clean back line raised on a pale solid-wood base. Its softly textured oatmeal weave brings warmth to a restrained, contemporary silhouette that suits almost any room.",
    images: [
      img(`${SOFAS}/oslo-1.webp`, "Oslo three-seater sofa in oatmeal fabric, front view"),
      img(`${SOFAS}/oslo-2.webp`, "Oslo three-seater sofa, angled view"),
      img(`${SOFAS}/oslo-3.webp`, "Oslo three-seater sofa, side profile"),
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
    slug: "palermo-sofa",
    name: "Palermo Bouclé Sofa",
    categorySlug: "sofas",
    subcategorySlug: "sofas",
    summary: "A low, extra-deep sofa layered in soft bouclé cushions.",
    description:
      "Palermo is built for lounging — a low, extra-deep seat piled with soft bouclé scatter and bolster cushions, set on a discreet dark plinth so the upholstery appears to float. An effortless, contemporary centrepiece.",
    images: [
      img(`${SOFAS}/palermo-1.webp`, "Palermo bouclé sofa in pale grey, front view"),
      img(`${SOFAS}/palermo-2.webp`, "Palermo bouclé sofa, angled view"),
      img(`${SOFAS}/palermo-3.webp`, "Palermo bouclé sofa, detail"),
    ],
    materials: [
      { name: "Soft pale-grey bouclé" },
      { name: "Feather-and-foam cushions" },
      { name: "Recessed dark plinth" },
    ],
    dimensions: { width: 250, depth: 115, height: 78, seatHeight: 42, unit: "cm" },
    collection: "Signature",
    isNew: true,
  },
  {
    slug: "skyline-sofa",
    name: "Skyline Sofa",
    categorySlug: "sofas",
    subcategorySlug: "sofas",
    summary: "A crisp, tailored sofa in charcoal on a warm walnut base.",
    description:
      "Skyline is all clean lines — slim track arms and tailored cushions in a charcoal weave, lifted on a warm walnut-stained base. Quietly modern, it anchors a room without weighing it down.",
    images: [
      img(`${SOFAS}/skyline-1.webp`, "Skyline three-seater sofa in charcoal on a walnut base, front view"),
      img(`${SOFAS}/skyline-2.webp`, "Skyline sofa, two-seater configuration"),
      img(`${SOFAS}/skyline-3.webp`, "Skyline sofa, alternate view"),
    ],
    materials: [
      { name: "Charcoal chenille weave" },
      { name: "Walnut-stained solid wood base" },
      { name: "High-resilience foam" },
    ],
    dimensions: { width: 230, depth: 95, height: 78, seatHeight: 44, unit: "cm" },
    collection: "Atelier",
    isNew: true,
  },

  // ----------------------------- SECTIONALS ------------------------------
  {
    slug: "rivera-u-sectional",
    name: "Rivera U-Sectional",
    categorySlug: "living-room",
    subcategorySlug: "sectionals",
    summary: "A modular U-shaped sectional that seats the whole family.",
    description:
      "Rivera is a true centrepiece — a large modular U-shape that can be arranged to fit your room, with plush seats and a soft beige weave. Built in sections, it adapts as your space changes.",
    images: [
      img(`${SEC}/rivera-1.webp`, "Rivera beige U-shaped modular sectional, top view", 1200, 800),
      img(`${SEC}/rivera-2.jpg`, "Rivera U-sectional styled in a living room", 1200, 800),
      img(`${SEC}/rivera-3.webp`, "Rivera U-sectional, detail", 1200, 800),
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
      img(`${SEC}/cosmo-1.webp`, "Cosmo modular sectional with chaise and chrome legs, front view", 1200, 800),
    ],
    materials: [
      { name: "Mixed-tone upholstery weave" },
      { name: "Polished chrome legs" },
      { name: "Modular foam seating" },
    ],
    dimensions: { width: 340, depth: 170, height: 70, seatHeight: 42, unit: "cm" },
    collection: "Atelier",
  },
  {
    slug: "marlow-sectional",
    name: "Marlow Lounge Sectional",
    categorySlug: "living-room",
    subcategorySlug: "sectionals",
    summary: "A low, lounge-depth sectional with a relaxed slipcover.",
    description:
      "Marlow is built for slow afternoons — a low seat, extra depth, and a soft tailored slipcover that lifts off completely for cleaning. Scatter cushions in the same cloth complete an easy, understated look.",
    images: [
      img(`${SEC}/marlow-1.webp`, "Marlow slipcover lounge sectional in cream, front view"),
      img(`${SEC}/marlow-2.webp`, "Marlow lounge sectional, wide view"),
      img(`${SEC}/marlow-3.webp`, "Marlow lounge sectional, detail"),
    ],
    materials: [
      { name: "Removable washable slipcover" },
      { name: "Down-blend cushions" },
    ],
    dimensions: { width: 300, depth: 120, height: 78, seatHeight: 42, unit: "cm" },
    collection: "Atelier",
  },
  {
    slug: "cascade-sectional",
    name: "Cascade Inclined Sectional",
    categorySlug: "living-room",
    subcategorySlug: "sectionals",
    summary: "A soft, angled modular sectional with deep lounging seats.",
    description:
      "Cascade is pure comfort — generous, angled modules in a relaxed off-white linen, with overstuffed cushions and a low, grounded base. Its inclined layout gently wraps a seating area for easy, sink-in lounging.",
    images: [
      img(`${SEC}/cascade-1.webp`, "Cascade inclined modular sectional in off-white linen, angled view"),
      img(`${SEC}/cascade-2.webp`, "Cascade sectional, alternate angle"),
      img(`${SEC}/cascade-3.webp`, "Cascade sectional, detail"),
    ],
    materials: [
      { name: "Relaxed off-white linen" },
      { name: "Feather-blend cushions" },
      { name: "Modular construction" },
    ],
    dimensions: { width: 330, depth: 180, height: 72, seatHeight: 42, unit: "cm" },
    collection: "Signature",
    isFeatured: true,
  },

  // ------------------------------- BEDS ----------------------------------
  {
    slug: "comfort-bed",
    name: "Comfort Upholstered Bed",
    categorySlug: "bedroom",
    subcategorySlug: "beds",
    summary: "A softly padded bed with split cushioned headboard panels.",
    description:
      "Comfort wraps the room in calm — a fully upholstered frame topped with soft, split headboard cushions you can lean into. Available with a lift-up storage base, it pairs deep comfort with everyday practicality.",
    images: [
      img(`${BEDS}/comfort-1.webp`, "Comfort upholstered bed in blue fabric with split cushioned headboard"),
      img(`${BEDS}/comfort-2.webp`, "Comfort bed, king configuration"),
      img(`${BEDS}/comfort-3.webp`, "Comfort bed, alternate view"),
      storage(),
    ],
    materials: [
      { name: "Soft upholstery weave" },
      { name: "Padded split headboard" },
      { name: "Optional lift-up storage base" },
    ],
    dimensions: { width: 196, depth: 215, height: 110, unit: "cm" },
    collection: "Signature",
    isNew: true,
  },
  {
    slug: "haven-bed",
    name: "Haven Upholstered Bed",
    categorySlug: "bedroom",
    subcategorySlug: "beds",
    summary: "A low, enveloping bed with a soft wrapped headboard.",
    description:
      "Haven is quietly grounding — a low, fully upholstered frame in a warm taupe weave with a soft split headboard. Offered in several colourways and sizes, with an optional lift-up storage base.",
    images: [
      img(`${BEDS}/haven-1.webp`, "Haven upholstered bed in taupe, king size, front view"),
      img(`${BEDS}/haven-2.webp`, "Haven bed in off-white, queen size"),
      img(`${BEDS}/haven-3.webp`, "Haven bed in blue, queen size"),
      img(`${BEDS}/haven-4-dimensions.webp`, "Haven bed dimensions diagram", 1800, 950),
      storage(),
    ],
    materials: [
      { name: "Warm taupe weave (multiple colourways)" },
      { name: "Padded wrapped headboard" },
      { name: "Optional lift-up storage base" },
    ],
    dimensions: { width: 196, depth: 215, height: 100, unit: "cm" },
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
      "Lora is quietly sculptural — a continuous, rounded headboard and base wrapped in a soft weave. The gentle curves make the bed the centrepiece of the room, with an optional lift-up storage base hidden beneath.",
    images: [
      img(`${BEDS}/lora-1.webp`, "Lora curved upholstered bed, front view"),
      img(`${BEDS}/lora-2.webp`, "Lora curved bed, alternate colourway"),
      storage(),
    ],
    materials: [
      { name: "Soft upholstery weave" },
      { name: "Rounded wrapped headboard" },
      { name: "Optional lift-up storage base" },
    ],
    dimensions: { width: 196, depth: 215, height: 105, unit: "cm" },
    collection: "Atelier",
    isNew: true,
  },

  // ------------------------------ TV UNITS -------------------------------
  {
    slug: "day-tv-unit",
    name: "Day TV Unit",
    categorySlug: "tv-units",
    subcategorySlug: "tv-units",
    summary: "A long, low push-to-open media console in solid wood veneers.",
    description:
      "Day is a clean, grain-forward media console — a long, low cabinet with handleless push-to-open fronts and generous storage for everything below the screen. Offered in three wood finishes to suit the room.",
    images: [
      img(`${TV}/day-natural-oak.webp`, "Day TV unit in natural oak", 1800, 700),
      img(`${TV}/day-medium-walnut.webp`, "Day TV unit in medium walnut", 1800, 700),
      img(`${TV}/day-black-oak.webp`, "Day TV unit in black oak", 1800, 700),
    ],
    materials: [
      { name: "Natural oak, medium walnut or black oak veneer" },
      { name: "Push-to-open fronts" },
      { name: "Cable-managed storage" },
    ],
    dimensions: { width: 240, depth: 45, height: 40, unit: "cm" },
    collection: "Atelier",
    isNew: true,
  },
];
