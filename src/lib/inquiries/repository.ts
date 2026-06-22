import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { Inquiry, NewInquiry } from "./types";

/**
 * Inquiry persistence.
 *
 * Supabase when configured; otherwise an in-memory store so the admin UI works
 * end-to-end in local dev (cleared on restart). Same API either way.
 */

/**
 * In dev, Next runs route handlers and RSC pages in separate module registries,
 * so a plain module-scoped array wouldn't be shared between the inquiry API and
 * the admin page. Pinning the store on globalThis makes it process-wide, so the
 * fallback behaves correctly without Supabase. (In production Supabase is the
 * single source of truth and this is unused.)
 */
const store = globalThis as unknown as {
  __inquiryMem?: Inquiry[];
  __inquirySeq?: number;
};
store.__inquiryMem ??= [];
store.__inquirySeq ??= 0;
const memory = store.__inquiryMem;

type Row = {
  id: string;
  name: string;
  email: string;
  message: string;
  product_slug: string | null;
  gender: string | null;
  gender_guess: string | null;
  gender_confidence: number | null;
  is_read: boolean;
  country: string | null;
  city: string | null;
  referrer: string | null;
  device: string | null;
  browser: string | null;
  created_at: string;
};

function rowToInquiry(r: Row): Inquiry {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    message: r.message,
    productSlug: r.product_slug,
    gender: (r.gender as Inquiry["gender"]) ?? null,
    genderGuess: (r.gender_guess as Inquiry["genderGuess"]) ?? null,
    genderConfidence: r.gender_confidence,
    isRead: r.is_read,
    country: r.country,
    city: r.city,
    referrer: r.referrer,
    device: r.device,
    browser: r.browser,
    createdAt: r.created_at,
  };
}

/** Persist a new inquiry. Returns true on success. */
export async function saveInquiry(input: NewInquiry): Promise<boolean> {
  const db = getSupabaseAdmin();
  if (!db) {
    memory.unshift({
      id: `mem-${(store.__inquirySeq = (store.__inquirySeq ?? 0) + 1)}`,
      ...input,
      isRead: false,
      createdAt: new Date().toISOString(),
    });
    return true;
  }

  const { error } = await db.from("inquiries").insert({
    name: input.name,
    email: input.email,
    message: input.message,
    product_slug: input.productSlug,
    gender: input.gender,
    gender_guess: input.genderGuess,
    gender_confidence: input.genderConfidence,
    country: input.country,
    city: input.city,
    referrer: input.referrer,
    device: input.device,
    browser: input.browser,
  });
  return !error;
}

/** List inquiries, newest first. */
export async function listInquiries(limit = 200): Promise<Inquiry[]> {
  const db = getSupabaseAdmin();
  if (!db) return memory.slice(0, limit);

  const { data, error } = await db
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return (data as Row[]).map(rowToInquiry);
}

/** Count unread inquiries (for the dashboard badge). */
export async function countUnreadInquiries(): Promise<number> {
  const db = getSupabaseAdmin();
  if (!db) return memory.filter((i) => !i.isRead).length;

  const { count, error } = await db
    .from("inquiries")
    .select("id", { count: "exact", head: true })
    .eq("is_read", false);
  return error ? 0 : (count ?? 0);
}

/** Total inquiry count. */
export async function countInquiries(): Promise<number> {
  const db = getSupabaseAdmin();
  if (!db) return memory.length;

  const { count, error } = await db
    .from("inquiries")
    .select("id", { count: "exact", head: true });
  return error ? 0 : (count ?? 0);
}

/**
 * Effective gender split of leads. Uses the self-declared value when present,
 * otherwise the name-based guess, otherwise "unknown". The UI labels this as
 * partly estimated.
 */
export interface GenderBreakdown {
  male: number;
  female: number;
  unknown: number;
}

export async function getGenderBreakdown(): Promise<GenderBreakdown> {
  const tally = (
    rows: { gender: string | null; genderGuess: string | null }[],
  ): GenderBreakdown => {
    const out: GenderBreakdown = { male: 0, female: 0, unknown: 0 };
    for (const r of rows) {
      const g =
        r.gender === "male" || r.gender === "female"
          ? r.gender
          : r.genderGuess === "male" || r.genderGuess === "female"
            ? r.genderGuess
            : "unknown";
      out[g] += 1;
    }
    return out;
  };

  const db = getSupabaseAdmin();
  if (!db) {
    return tally(
      memory.map((i) => ({ gender: i.gender, genderGuess: i.genderGuess })),
    );
  }

  const { data, error } = await db
    .from("inquiries")
    .select("gender, gender_guess");
  if (error || !data) return { male: 0, female: 0, unknown: 0 };
  return tally(
    (data as { gender: string | null; gender_guess: string | null }[]).map(
      (r) => ({ gender: r.gender, genderGuess: r.gender_guess }),
    ),
  );
}

export async function setInquiryRead(
  id: string,
  isRead: boolean,
): Promise<boolean> {
  const db = getSupabaseAdmin();
  if (!db) {
    const found = memory.find((i) => i.id === id);
    if (found) found.isRead = isRead;
    return Boolean(found);
  }
  const { error } = await db
    .from("inquiries")
    .update({ is_read: isRead })
    .eq("id", id);
  return !error;
}

export async function deleteInquiry(id: string): Promise<boolean> {
  const db = getSupabaseAdmin();
  if (!db) {
    const idx = memory.findIndex((i) => i.id === id);
    if (idx >= 0) memory.splice(idx, 1);
    return idx >= 0;
  }
  const { error } = await db.from("inquiries").delete().eq("id", id);
  return !error;
}

/** Test helper. */
export function __resetInquiryMemory(): void {
  memory.length = 0;
  store.__inquirySeq = 0;
}
