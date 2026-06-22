import { NextResponse, type NextRequest } from "next/server";
import { validateInquiry } from "@/lib/validation/inquiry";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp, getGeo } from "@/lib/http";
import { parseUserAgent } from "@/lib/analytics/ua";
import { inferGender } from "@/lib/gender/infer";
import { saveInquiry } from "@/lib/inquiries/repository";

/**
 * Inquiry submission endpoint.
 *
 * Security measures, in order:
 *  1. Rate limiting per client IP (fixed window) — blunts spam/abuse.
 *  2. Honeypot field (`company`) — must be empty; bots that fill it are dropped
 *     with a fake success so they don't learn they were caught.
 *  3. Zod validation + normalization — the SAME schema the client uses, so
 *     nothing untrusted reaches downstream logic. Output is trimmed/typed.
 *
 * Delivery is intentionally pluggable: today it logs (dev) / would email
 * (prod). Wire a real provider with EMAIL_API_KEY from the environment — never
 * hardcode secrets.
 */

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // 1. Rate limit: 5 inquiries per minute per IP.
  const ip = clientIp(req);
  const limit = rateLimit(`inquiry:${ip}`, 5, 60_000);
  if (!limit.success) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again shortly." },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000)),
          ),
        },
      },
    );
  }

  // Parse body defensively — malformed JSON should not throw a 500.
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  // 2. Honeypot: a filled `company` field means a bot. Pretend success.
  if (
    body &&
    typeof body === "object" &&
    "company" in body &&
    typeof (body as Record<string, unknown>).company === "string" &&
    ((body as Record<string, unknown>).company as string).length > 0
  ) {
    return NextResponse.json({ ok: true });
  }

  // 3. Validate + normalize with the shared schema.
  const result = validateInquiry(body);
  if (!result.success) {
    return NextResponse.json(
      { ok: false, fieldErrors: result.errors },
      { status: 422 },
    );
  }

  const { name, email, message, productSlug, gender } = result.data;

  // Derive context server-side from trusted signals (never client-supplied).
  const geo = getGeo(req);
  const { device, browser } = parseUserAgent(req.headers.get("user-agent"));

  // Gender: prefer the visitor's own declaration; keep a name-based guess as a
  // clearly-labelled fallback for leads who didn't declare one.
  const declared =
    gender === "male" || gender === "female" || gender === "unspecified"
      ? gender
      : null;
  const guess = inferGender(name);

  // --- Persist ---
  await saveInquiry({
    name,
    email,
    message,
    productSlug: productSlug || null,
    gender: declared,
    genderGuess: guess.gender,
    genderConfidence: guess.confidence,
    country: geo.country,
    city: geo.city,
    referrer: null, // external referrer isn't reliably available on this POST
    device,
    browser,
  });

  // --- Delivery (pluggable) ---
  // In production, also send via your transactional email provider here, e.g.:
  //   await sendEmail({ to: process.env.INQUIRY_NOTIFY_EMAIL, ... })
  // Keys come from the environment; nothing is hardcoded.
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console -- dev-only visibility
    console.info("[inquiry] received", {
      name,
      email,
      productSlug: productSlug || null,
      messagePreview: message.slice(0, 80),
    });
  }

  return NextResponse.json({ ok: true });
}
