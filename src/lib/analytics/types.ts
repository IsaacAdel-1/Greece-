import type { DeviceClass } from "./ua";

/**
 * Analytics domain types. Kept separate from IO so the aggregation logic can be
 * unit-tested with plain objects and no database.
 */

/** A single normalized visit, as stored and as fed to aggregation. */
export interface VisitRow {
  path: string;
  referrerHost: string | null;
  country: string | null;
  city: string | null;
  device: DeviceClass | string;
  browser: string;
  os: string;
  /** Salted daily hash — used to count unique visitors. Never an IP. */
  visitorHash: string | null;
  /** ISO timestamp. */
  createdAt: string;
}

/** What `recordVisit` accepts (timestamp is assigned at write time). */
export type VisitInput = Omit<VisitRow, "createdAt">;

export interface CountItem {
  label: string;
  count: number;
}

export interface DayCount {
  /** YYYY-MM-DD (UTC). */
  date: string;
  count: number;
}

export interface AnalyticsSummary {
  rangeDays: number;
  totalVisits: number;
  uniqueVisitors: number;
  /** One entry per day in the range, oldest first (zero-filled). */
  byDay: DayCount[];
  topPaths: CountItem[];
  topCountries: CountItem[];
  byDevice: CountItem[];
  byBrowser: CountItem[];
  topReferrers: CountItem[];
  /** Where the numbers came from — surfaced in the UI for transparency. */
  source: "supabase" | "memory";
}
