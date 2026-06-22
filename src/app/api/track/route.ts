import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp, getGeo, isSameOrigin, referrerHost } from "@/lib/http";
import { parseUserAgent } from "@/lib/analytics/ua";
import { visitorHash } from "@/lib/analytics/visitor";
import { recordVisit } from "@/lib/analytics/events";

/**
 * Page-view tracking endpoint (called by the client PageTracker on navigation).
 *
 * Security & privacy:
 *  - Same-origin only: rejects cross-site calls (this is not a public beacon).
 *  - Rate limited per IP so it can't be used to flood the table.
 *  - Stores NO raw IP — only a salted daily hash for unique counting.
 *  - Validates/normalizes the single client-supplied field (`path`); everything
 *    else (geo, device, referrer) is derived server-side from trusted headers.
 *
 * Always returns 204 (even on validation failure) so the client never retries
 * and analytics never affects the user experience.
 */

export const runtime = "nodejs";

const bodySchema = z.object({
  // Only a same-origin pathname is accepted; query/host are stripped client- and
  // server-side. Cap length to avoid junk.
  path: z.string().trim().min(1).max(512),
  // The visitor's external referrer (document.referrer), captured client-side.
  // The fetch's own Referer header is always our page, so it's useless here.
  ref: z.string().trim().max(1024).optional(),
});

/** Keep only the pathname; drop origin, query and fragments. */
function sanitizePath(raw: string): string {
  let p = raw;
  try {
    // Resolve against a dummy base so absolute or relative inputs both work.
    p = new URL(raw, "http://x").pathname;
  } catch {
    p = raw.split("?")[0]!.split("#")[0]!;
  }
  if (!p.startsWith("/")) p = `/${p}`;
  return p.slice(0, 512);
}

export async function POST(req: NextRequest) {
  // Not a public beacon — only our own pages may call it.
  if (!isSameOrigin(req)) {
    return new NextResponse(null, { status: 204 });
  }

  const ip = clientIp(req);
  if (!rateLimit(`track:${ip}`, 60, 60_000).success) {
    return new NextResponse(null, { status: 204 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return new NextResponse(null, { status: 204 });

  const ua = req.headers.get("user-agent") ?? "";
  const { device, browser, os } = parseUserAgent(ua);

  // Don't record obvious bots — keeps human analytics clean.
  if (device === "bot") return new NextResponse(null, { status: 204 });

  const geo = getGeo(req);
  const secret = process.env.AUTH_SECRET ?? "no-secret";
  const hash = await visitorHash(ip, ua, secret);

  // Treat a referrer pointing back at our own host as an internal navigation.
  const host = req.headers.get("host");
  let ref = referrerHost(parsed.data.ref);
  if (ref && host && ref === host) ref = null;

  try {
    await recordVisit({
      path: sanitizePath(parsed.data.path),
      referrerHost: ref,
      country: geo.country,
      city: geo.city,
      device,
      browser,
      os,
      visitorHash: hash,
    });
  } catch {
    // Analytics must never surface an error to the visitor.
  }

  return new NextResponse(null, { status: 204 });
}
