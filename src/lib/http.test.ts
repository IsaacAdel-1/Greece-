import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { clientIp, getGeo, isSameOrigin, referrerHost } from "./http";

function req(headers: Record<string, string>): NextRequest {
  return new NextRequest("http://localhost/api/x", { method: "POST", headers });
}

describe("clientIp", () => {
  it("takes the first hop of x-forwarded-for", () => {
    expect(clientIp(req({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" }))).toBe("1.2.3.4");
  });
  it("falls back to x-real-ip then 'unknown'", () => {
    expect(clientIp(req({ "x-real-ip": "9.9.9.9" }))).toBe("9.9.9.9");
    expect(clientIp(req({}))).toBe("unknown");
  });
});

describe("getGeo", () => {
  it("reads and decodes Vercel geo headers", () => {
    expect(
      getGeo(req({ "x-vercel-ip-country": "EG", "x-vercel-ip-city": "New%20Cairo" })),
    ).toEqual({ country: "EG", city: "New Cairo" });
  });
  it("returns nulls when absent", () => {
    expect(getGeo(req({}))).toEqual({ country: null, city: null });
  });
});

describe("referrerHost", () => {
  it("extracts the host", () => {
    expect(referrerHost("https://www.google.com/search?q=sofa")).toBe("www.google.com");
  });
  it("returns null for empty/invalid", () => {
    expect(referrerHost(null)).toBeNull();
    expect(referrerHost("not a url")).toBeNull();
  });
});

describe("isSameOrigin", () => {
  it("accepts a matching Origin", () => {
    expect(isSameOrigin(req({ origin: "http://localhost", host: "localhost" }))).toBe(true);
  });
  it("rejects a cross-site Origin", () => {
    expect(isSameOrigin(req({ origin: "http://evil.com", host: "localhost" }))).toBe(false);
  });
  it("falls back to Referer when Origin is absent", () => {
    expect(isSameOrigin(req({ referer: "http://localhost/contact", host: "localhost" }))).toBe(true);
  });
  it("rejects when neither Origin nor Referer is present", () => {
    expect(isSameOrigin(req({ host: "localhost" }))).toBe(false);
  });
});
