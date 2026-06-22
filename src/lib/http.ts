import type { NextRequest } from "next/server";

/**
 * Small request helpers shared by API routes. Centralized so IP/geo extraction
 * (and its trust assumptions) live in exactly one place.
 */

/**
 * Best-effort client IP. Behind Vercel/most proxies `x-forwarded-for` is a
 * comma-separated list with the real client first. Used only for rate limiting
 * and as a salted-hash input — never stored raw.
 */
export function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export interface Geo {
  country: string | null;
  city: string | null;
}

/**
 * Coarse geo from edge headers. Vercel injects `x-vercel-ip-*` on every request
 * at no cost and without any third-party call. Absent in local dev → nulls.
 */
export function getGeo(req: NextRequest): Geo {
  const country = req.headers.get("x-vercel-ip-country");
  const cityRaw = req.headers.get("x-vercel-ip-city");
  // Vercel URL-encodes city names (e.g. "Cairo", "New%20York").
  let city: string | null = null;
  if (cityRaw) {
    try {
      city = decodeURIComponent(cityRaw);
    } catch {
      city = cityRaw;
    }
  }
  return { country: country || null, city };
}

/** Extract just the host from a referrer URL; null if absent/invalid/self. */
export function referrerHost(
  referrer: string | null | undefined,
): string | null {
  if (!referrer) return null;
  try {
    return new URL(referrer).host || null;
  } catch {
    return null;
  }
}

/**
 * Same-origin check for state-changing requests (defense-in-depth CSRF guard).
 * A cross-site form/script POST cannot forge the Origin header, and our admin
 * cookie is SameSite=Lax, so legitimate mutations always carry a matching
 * Origin (or Referer) for the deployment host.
 */
export function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!host) return false;

  // Prefer Origin; fall back to Referer (some browsers omit Origin on GET-like
  // navigations, but our mutations are POST/PATCH/DELETE which always send it).
  const source = origin ?? req.headers.get("referer");
  if (!source) {
    // No Origin and no Referer: only allow if the request isn't cross-site.
    // Treat as untrusted to be safe.
    return false;
  }
  try {
    return new URL(source).host === host;
  } catch {
    return false;
  }
}
