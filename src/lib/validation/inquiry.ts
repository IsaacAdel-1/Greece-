import { z } from "zod";

/**
 * Inquiry (contact form) validation schema.
 *
 * Shared by the client form and the server API route so validation rules have
 * a single source of truth and cannot drift. Zod both validates and, via
 * `.trim()`/transforms, normalizes input — the parsed output is what we use.
 */
export const inquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(100, "Name is too long."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address.")
    .max(254, "Email is too long."),
  // Optional — visitors may inquire about a specific piece.
  productSlug: z.string().trim().max(120).optional().or(z.literal("")),
  // Optional self-declared gender. Empty string = "preferred not to say".
  gender: z.enum(["male", "female", "unspecified"]).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Please tell us a little more (at least 10 characters).")
    .max(2000, "Message is too long (2000 characters max)."),
  /**
   * Honeypot field. Must be empty — real users never see or fill it. Bots that
   * auto-fill every field will trip this. We accept any string but reject
   * non-empty values at the route layer.
   */
  company: z.string().max(0).optional().or(z.literal("")),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

/** Field-level errors keyed by field name, as produced for the UI. */
export type InquiryFieldErrors = Partial<
  Record<keyof InquiryInput, string>
>;

/**
 * Validate raw input and return either typed data or flattened field errors.
 * Used by both client and server so behaviour is identical on each side.
 */
export function validateInquiry(
  raw: unknown,
):
  | { success: true; data: InquiryInput }
  | { success: false; errors: InquiryFieldErrors } {
  const result = inquirySchema.safeParse(raw);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const errors: InquiryFieldErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof InquiryInput | undefined;
    if (key && !errors[key]) {
      errors[key] = issue.message;
    }
  }
  return { success: false, errors };
}
