import {
  FEMALE_NAMES,
  FEMALE_NAMES_AR,
  MALE_NAMES,
  MALE_NAMES_AR,
} from "./names";

/**
 * Heuristic gender inference from a person's name.
 *
 * IMPORTANT: this is a GUESS, not a fact. Names are cultural, ambiguous, and
 * our dictionary is finite. Every result carries a 0..1 confidence and a
 * `source`, and callers MUST present it as an estimate. It exists only as a
 * fallback for when a visitor hasn't self-declared their gender.
 *
 * Strategy, highest confidence first:
 *  1. Exact dictionary match (Latin or Arabic script) → 0.9
 *  2. Arabic feminine ending (ة / اء / female-marking ا) → 0.65
 *  3. No signal → "unknown", 0
 */

export type Gender = "male" | "female";
export type GuessSource = "dictionary" | "heuristic" | "none";

export interface GenderGuess {
  gender: Gender | "unknown";
  confidence: number;
  source: GuessSource;
}

const UNKNOWN: GenderGuess = {
  gender: "unknown",
  confidence: 0,
  source: "none",
};

/** Strip Arabic diacritics/tatweel and surrounding punctuation/whitespace. */
function normalizeArabic(token: string): string {
  return token
    .replace(/[ً-ٰٟـ]/g, "") // harakat + tatweel
    .replace(/[^؀-ۿ]/g, "")
    .trim();
}

/** Lowercase, strip Latin diacritics and non-letters. */
function normalizeLatin(token: string): string {
  return token
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .trim();
}

/** True if the token contains Arabic characters. */
function isArabic(token: string): boolean {
  return /[؀-ۿ]/.test(token);
}

export function inferGender(name: string | null | undefined): GenderGuess {
  if (!name || typeof name !== "string") return UNKNOWN;

  // Use the first whitespace-separated token — the given name.
  const first = name.trim().split(/\s+/)[0] ?? "";
  if (!first) return UNKNOWN;

  if (isArabic(first)) {
    const ar = normalizeArabic(first);
    if (!ar) return UNKNOWN;
    if (MALE_NAMES_AR.has(ar))
      return { gender: "male", confidence: 0.9, source: "dictionary" };
    if (FEMALE_NAMES_AR.has(ar))
      return { gender: "female", confidence: 0.9, source: "dictionary" };
    // Feminine endings: taa marbuta (ـة) or hamza-alif (ـاء).
    if (ar.endsWith("ة") || ar.endsWith("اء"))
      return { gender: "female", confidence: 0.65, source: "heuristic" };
    return UNKNOWN;
  }

  const latin = normalizeLatin(first);
  if (!latin) return UNKNOWN;
  if (MALE_NAMES.has(latin))
    return { gender: "male", confidence: 0.9, source: "dictionary" };
  if (FEMALE_NAMES.has(latin))
    return { gender: "female", confidence: 0.9, source: "dictionary" };

  return UNKNOWN;
}
