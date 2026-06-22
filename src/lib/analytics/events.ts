import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { summarize } from "./aggregate";
import type { AnalyticsSummary, VisitInput, VisitRow } from "./types";

/**
 * Visit recording + summary retrieval.
 *
 * Two backends behind one API:
 *  - Supabase (when configured): durable, the production path.
 *  - In-memory ring buffer (otherwise): so the dashboard shows real numbers in
 *    local dev before Supabase is set up. The buffer is process-local and
 *    cleared on restart — never used in production where Supabase is present.
 */

const MEMORY_LIMIT = 5_000;
// Pinned on globalThis so the store is shared across Next's separate dev
// runtimes (route handler vs. RSC page). Unused in production (Supabase).
const store = globalThis as unknown as { __visitMem?: VisitRow[] };
store.__visitMem ??= [];
const memory = store.__visitMem;

/** Record a single page view. Best-effort: failures must never break a page. */
export async function recordVisit(input: VisitInput): Promise<void> {
  const db = getSupabaseAdmin();
  const createdAt = new Date().toISOString();

  if (!db) {
    memory.push({ ...input, createdAt });
    if (memory.length > MEMORY_LIMIT) memory.shift();
    return;
  }

  await db.from("visit_events").insert({
    path: input.path,
    referrer_host: input.referrerHost,
    country: input.country,
    city: input.city,
    device: input.device,
    browser: input.browser,
    os: input.os,
    visitor_hash: input.visitorHash,
    created_at: createdAt,
  });
}

/** Build the dashboard summary for the last `days` days. */
export async function getAnalyticsSummary(
  days = 30,
): Promise<AnalyticsSummary> {
  const db = getSupabaseAdmin();
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - (days - 1));
  since.setUTCHours(0, 0, 0, 0);

  if (!db) {
    const rows = memory.filter((r) => new Date(r.createdAt) >= since);
    return { ...summarize(rows, days), source: "memory" };
  }

  const { data, error } = await db
    .from("visit_events")
    .select(
      "path, referrer_host, country, city, device, browser, os, visitor_hash, created_at",
    )
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: false })
    .limit(100_000);

  if (error || !data) {
    return { ...summarize([], days), source: "supabase" };
  }

  const rows: VisitRow[] = data.map((r) => ({
    path: r.path,
    referrerHost: r.referrer_host,
    country: r.country,
    city: r.city,
    device: r.device,
    browser: r.browser,
    os: r.os,
    visitorHash: r.visitor_hash,
    createdAt: r.created_at,
  }));

  return { ...summarize(rows, days), source: "supabase" };
}

/** Test helper — clears the in-memory buffer. */
export function __resetVisitMemory(): void {
  memory.length = 0;
}
