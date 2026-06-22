import type {
  AnalyticsSummary,
  CountItem,
  DayCount,
  VisitRow,
} from "./types";

/**
 * Pure aggregation of raw visit rows into the dashboard summary.
 *
 * Deliberately free of any IO so it can be exhaustively unit-tested. The
 * database layer fetches rows for the window and hands them here; the in-memory
 * dev fallback does the same. `now` is injectable for deterministic tests.
 */

/** YYYY-MM-DD in UTC for a Date. */
function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Tally a field across rows and return the top N by count, descending. */
function topBy(
  rows: VisitRow[],
  pick: (r: VisitRow) => string | null | undefined,
  limit: number,
): CountItem[] {
  const counts = new Map<string, number>();
  for (const r of rows) {
    const raw = pick(r);
    const label = raw && raw.trim() ? raw.trim() : "Unknown";
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, limit);
}

export function summarize(
  rows: VisitRow[],
  rangeDays: number,
  now: Date = new Date(),
): AnalyticsSummary {
  // Build a zero-filled, ordered list of the days in the window.
  const byDayMap = new Map<string, number>();
  const days: DayCount[] = [];
  for (let i = rangeDays - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    const key = dayKey(d);
    byDayMap.set(key, 0);
    days.push({ date: key, count: 0 });
  }

  const uniques = new Set<string>();
  for (const r of rows) {
    const key = dayKey(new Date(r.createdAt));
    if (byDayMap.has(key)) byDayMap.set(key, (byDayMap.get(key) ?? 0) + 1);
    if (r.visitorHash) uniques.add(r.visitorHash);
  }
  for (const day of days) day.count = byDayMap.get(day.date) ?? 0;

  return {
    rangeDays,
    totalVisits: rows.length,
    uniqueVisitors: uniques.size,
    byDay: days,
    topPaths: topBy(rows, (r) => r.path, 10),
    topCountries: topBy(rows, (r) => r.country, 10),
    byDevice: topBy(rows, (r) => String(r.device), 5),
    byBrowser: topBy(rows, (r) => r.browser, 6),
    topReferrers: topBy(rows, (r) => r.referrerHost, 10),
    source: "memory",
  };
}
