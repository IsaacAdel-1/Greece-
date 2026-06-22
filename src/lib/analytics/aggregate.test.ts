import { describe, expect, it } from "vitest";
import { summarize } from "./aggregate";
import type { VisitRow } from "./types";

const NOW = new Date("2026-06-16T12:00:00.000Z");

function row(over: Partial<VisitRow>): VisitRow {
  return {
    path: "/",
    referrerHost: null,
    country: null,
    city: null,
    device: "desktop",
    browser: "Chrome",
    os: "Windows",
    visitorHash: null,
    createdAt: NOW.toISOString(),
    ...over,
  };
}

describe("summarize", () => {
  it("returns a zero-filled day series of the requested length", () => {
    const s = summarize([], 7, NOW);
    expect(s.byDay).toHaveLength(7);
    expect(s.byDay[6]!.date).toBe("2026-06-16");
    expect(s.byDay[0]!.date).toBe("2026-06-10");
    expect(s.byDay.every((d) => d.count === 0)).toBe(true);
    expect(s.totalVisits).toBe(0);
    expect(s.uniqueVisitors).toBe(0);
  });

  it("counts total visits and buckets them by day", () => {
    const rows = [
      row({ createdAt: "2026-06-16T01:00:00Z" }),
      row({ createdAt: "2026-06-16T09:00:00Z" }),
      row({ createdAt: "2026-06-15T09:00:00Z" }),
    ];
    const s = summarize(rows, 7, NOW);
    expect(s.totalVisits).toBe(3);
    expect(s.byDay.find((d) => d.date === "2026-06-16")!.count).toBe(2);
    expect(s.byDay.find((d) => d.date === "2026-06-15")!.count).toBe(1);
  });

  it("counts unique visitors by hash, ignoring nulls", () => {
    const rows = [
      row({ visitorHash: "a" }),
      row({ visitorHash: "a" }),
      row({ visitorHash: "b" }),
      row({ visitorHash: null }),
    ];
    expect(summarize(rows, 30, NOW).uniqueVisitors).toBe(2);
  });

  it("ranks top paths, countries, devices and referrers", () => {
    const rows = [
      row({ path: "/products/x", country: "EG", device: "mobile", referrerHost: "google.com" }),
      row({ path: "/products/x", country: "EG", device: "mobile", referrerHost: "google.com" }),
      row({ path: "/", country: "US", device: "desktop", referrerHost: null }),
    ];
    const s = summarize(rows, 30, NOW);
    expect(s.topPaths[0]).toEqual({ label: "/products/x", count: 2 });
    expect(s.topCountries[0]).toEqual({ label: "EG", count: 2 });
    expect(s.byDevice[0]).toEqual({ label: "mobile", count: 2 });
    // Null referrer is bucketed as "Unknown".
    expect(s.topReferrers.find((r) => r.label === "Unknown")!.count).toBe(1);
  });

  it("does not count visits outside the window in the day series", () => {
    const rows = [row({ createdAt: "2026-01-01T00:00:00Z" })];
    const s = summarize(rows, 7, NOW);
    // Still counted in totalVisits (caller scopes the query), but not in byDay.
    expect(s.byDay.every((d) => d.count === 0)).toBe(true);
  });
});
