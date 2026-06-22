import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";

/**
 * Tests the create-product route's request handling. Auth is the middleware's
 * job; here we cover the route's own guards: CSRF (same-origin), validation, and
 * the "Supabase required" path (no DB configured in tests).
 */

const valid = {
  slug: "test-sofa",
  name: "Test Sofa",
  categorySlug: "living-room",
  subcategorySlug: "sofas",
  summary: "A test piece.",
  description: "A test piece used in the route test.",
  images: [{ src: "/x.webp", alt: "Test sofa", width: 1200, height: 1200 }],
  materials: [],
  dimensions: { width: 200, depth: 90, height: 80, unit: "cm" },
};

function makeReq(
  body: unknown,
  { sameOrigin = true }: { sameOrigin?: boolean } = {},
): NextRequest {
  return new NextRequest("http://localhost/api/admin/products", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      host: "localhost",
      origin: sameOrigin ? "http://localhost" : "http://evil.example",
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/admin/products", () => {
  it("rejects cross-site requests with 403", async () => {
    const res = await POST(makeReq(valid, { sameOrigin: false }));
    expect(res.status).toBe(403);
  });

  it("returns 422 with field errors for invalid input", async () => {
    const res = await POST(makeReq({ ...valid, slug: "Bad Slug" }));
    expect(res.status).toBe(422);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.fieldErrors.slug).toBeDefined();
  });

  it("returns 400 (Supabase required) when valid but no DB is configured", async () => {
    const res = await POST(makeReq(valid));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.error).toMatch(/supabase/i);
  });
});
