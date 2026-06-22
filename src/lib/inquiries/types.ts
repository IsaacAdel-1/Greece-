/** A stored contact-form lead, as surfaced in the admin dashboard. */
export interface Inquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  productSlug: string | null;
  /** Self-declared by the visitor (may be empty). */
  gender: "male" | "female" | "unspecified" | null;
  /** Name-based guess used only as a fallback when gender is undeclared. */
  genderGuess: "male" | "female" | "unknown" | null;
  genderConfidence: number | null;
  isRead: boolean;
  country: string | null;
  city: string | null;
  referrer: string | null;
  device: string | null;
  browser: string | null;
  createdAt: string;
}

/** Fields captured at submission time before persistence. */
export interface NewInquiry {
  name: string;
  email: string;
  message: string;
  productSlug: string | null;
  gender: "male" | "female" | "unspecified" | null;
  genderGuess: "male" | "female" | "unknown" | null;
  genderConfidence: number | null;
  country: string | null;
  city: string | null;
  referrer: string | null;
  device: string | null;
  browser: string | null;
}
