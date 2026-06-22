import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  __resetVisitMemory,
  getAnalyticsSummary,
  recordVisit,
} from "./events";
import type { VisitInput } from "./types";

function visit(over: Partial<VisitInput> = {}): VisitInput {
  return {
    path: "/",
    referrerHost: null,
    country: "EG",
    city: "Cairo",
    device: "desktop",
    browser: "Chrome",
    os: "Windows",
    visitorHash: "hash-1",
    ...over,
  };
}

beforeEach(() => __resetVisitMemory());
afterEach(() => __resetVisitMemory());

describe("analytics events (memory)", () => {
  it("records visits and summarizes them", async () => {
    await recordVisit(visit({ path: "/products/a", visitorHash: "v1" }));
    await recordVisit(visit({ path: "/products/a", visitorHash: "v1" }));
    await recordVisit(visit({ path: "/", visitorHash: "v2" }));

    const s = await getAnalyticsSummary(30);
    expect(s.source).toBe("memory");
    expect(s.totalVisits).toBe(3);
    expect(s.uniqueVisitors).toBe(2);
    expect(s.topPaths[0]).toEqual({ label: "/products/a", count: 2 });
    expect(s.topCountries[0]).toEqual({ label: "EG", count: 3 });
    // Today's bucket (last day in the series) holds all three.
    expect(s.byDay.at(-1)!.count).toBe(3);
  });

  it("starts empty after reset", async () => {
    const s = await getAnalyticsSummary(7);
    expect(s.totalVisits).toBe(0);
    expect(s.byDay).toHaveLength(7);
  });
});
