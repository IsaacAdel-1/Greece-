import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";
import { __resetRateLimiter } from "@/lib/rate-limit";
import {
  __resetVisitMemory,
  getAnalyticsSummary,
} from "@/lib/analytics/events";

const HUMAN_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36";

function trackReq(
  body: unknown,
  {
    sameOrigin = true,
    ua = HUMAN_UA,
    ip = "10.0.0.1",
  }: { sameOrigin?: boolean; ua?: string; ip?: string } = {},
): NextRequest {
  const headers: Record<string, string> = {
    "content-type": "application/json",
    host: "localhost",
    "user-agent": ua,
    "x-forwarded-for": ip,
  };
  headers.origin = sameOrigin ? "http://localhost" : "http://evil.example";
  return new NextRequest("http://localhost/api/track", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  __resetRateLimiter();
  __resetVisitMemory();
});
afterEach(() => {
  __resetRateLimiter();
  __resetVisitMemory();
});

describe("POST /api/track", () => {
  it("records a same-origin human page view (204)", async () => {
    const res = await POST(trackReq({ path: "/products/aria-sectional" }));
    expect(res.status).toBe(204);
    const s = await getAnalyticsSummary(7);
    expect(s.totalVisits).toBe(1);
    expect(s.topPaths[0]!.label).toBe("/products/aria-sectional");
  });

  it("ignores cross-site requests", async () => {
    await POST(trackReq({ path: "/" }, { sameOrigin: false }));
    expect((await getAnalyticsSummary(7)).totalVisits).toBe(0);
  });

  it("does not record bots", async () => {
    await POST(trackReq({ path: "/" }, { ua: "Googlebot/2.1" }));
    expect((await getAnalyticsSummary(7)).totalVisits).toBe(0);
  });

  it("strips query strings and host from the path", async () => {
    await POST(trackReq({ path: "https://evil.com/products/x?utm=1#frag" }));
    const s = await getAnalyticsSummary(7);
    expect(s.topPaths[0]!.label).toBe("/products/x");
  });

  it("ignores a malformed body without throwing", async () => {
    const res = await POST(trackReq({ nope: true }));
    expect(res.status).toBe(204);
    expect((await getAnalyticsSummary(7)).totalVisits).toBe(0);
  });
});
