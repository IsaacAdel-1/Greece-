import { z } from "zod";
import type { Product } from "@/lib/catalog/types";

/**
 * Product create/update validation.
 *
 * Shared shape for the admin form and the API route so the rules can't drift.
 * The parsed output maps 1:1 onto the `Product` domain type.
 */

const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required.")
  .max(120, "Slug is too long.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must be lowercase letters, numbers and single hyphens (e.g. belgrave-sofa).",
  );

const imageSchema = z.object({
  src: z.string().trim().min(1, "Image source is required.").max(1024),
  alt: z.string().trim().min(1, "Each image needs alt text.").max(300),
  width: z.coerce.number().int().positive().max(10000).default(1200),
  height: z.coerce.number().int().positive().max(10000).default(1200),
});

const materialSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).optional().or(z.literal("")),
});

const dimensionsSchema = z.object({
  width: z.coerce.number().nonnegative().max(100000),
  depth: z.coerce.number().nonnegative().max(100000),
  height: z.coerce.number().nonnegative().max(100000),
  seatHeight: z.coerce.number().nonnegative().max(100000).optional(),
  unit: z.literal("cm").default("cm"),
});

export const productSchema = z.object({
  slug: slugSchema,
  name: z.string().trim().min(2, "Name is required.").max(160),
  categorySlug: z.string().trim().min(1, "Choose a category."),
  subcategorySlug: z.string().trim().min(1, "Choose a subcategory."),
  summary: z.string().trim().min(1, "Add a short summary.").max(300),
  description: z.string().trim().min(1, "Add a description.").max(5000),
  images: z.array(imageSchema).min(1, "Add at least one image."),
  // Drop blank rows (the form may submit empty material inputs) before
  // validating, so an unfilled row is ignored rather than rejected.
  materials: z.preprocess(
    (val) =>
      Array.isArray(val)
        ? val.filter(
            (m) =>
              m &&
              typeof m === "object" &&
              String((m as { name?: unknown }).name ?? "").trim() !== "",
          )
        : val,
    z.array(materialSchema).default([]),
  ),
  dimensions: dimensionsSchema,
  collection: z.string().trim().max(120).optional().or(z.literal("")),
  isFeatured: z.coerce.boolean().default(false),
  isNew: z.coerce.boolean().default(false),
});

export type ProductInput = z.infer<typeof productSchema>;

/** Field-path-keyed errors (dot notation for nested fields), for the UI. */
export type ProductFieldErrors = Record<string, string>;

/** Normalize parsed input into the canonical `Product` domain object. */
function toProduct(data: ProductInput): Product {
  return {
    slug: data.slug,
    name: data.name,
    categorySlug: data.categorySlug,
    subcategorySlug: data.subcategorySlug,
    summary: data.summary,
    description: data.description,
    images: data.images,
    materials: data.materials
      .filter((m) => m.name)
      .map((m) => ({
        name: m.name,
        ...(m.description ? { description: m.description } : {}),
      })),
    dimensions: data.dimensions,
    ...(data.collection ? { collection: data.collection } : {}),
    isFeatured: data.isFeatured,
    isNew: data.isNew,
  };
}

export function validateProduct(
  raw: unknown,
):
  | { success: true; data: Product }
  | { success: false; errors: ProductFieldErrors } {
  const result = productSchema.safeParse(raw);
  if (result.success) {
    return { success: true, data: toProduct(result.data) };
  }
  const errors: ProductFieldErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path.join(".") || "form";
    if (!errors[key]) errors[key] = issue.message;
  }
  return { success: false, errors };
}
