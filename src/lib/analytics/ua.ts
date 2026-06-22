/**
 * Tiny, dependency-free User-Agent parser.
 *
 * We deliberately avoid a heavyweight UA library: for analytics we only need
 * coarse buckets (device class, browser family, OS family), and a small set of
 * ordered checks is faster, auditable, and adds no supply-chain surface. This
 * is heuristic by nature — UA strings are messy — so treat the output as
 * approximate, which is all dashboard charts require.
 */

export type DeviceClass = "mobile" | "tablet" | "desktop" | "bot";

export interface ParsedUA {
  device: DeviceClass;
  browser: string;
  os: string;
}

const BOT_RE =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora link preview|whatsapp|telegrambot|preview|monitor|headless|lighthouse|pingdom|gtmetrix|curl|wget|python-requests|axios|node-fetch/i;

/** Order matters: more specific tokens must be tested before generic ones. */
function detectBrowser(ua: string): string {
  if (/edg(a|ios|e)?\//i.test(ua)) return "Edge";
  if (/opr\/|opera/i.test(ua)) return "Opera";
  if (/samsungbrowser/i.test(ua)) return "Samsung Internet";
  if (/firefox|fxios/i.test(ua)) return "Firefox";
  // Chrome must come before Safari (Chrome UA also contains "Safari").
  if (/chrome|crios|chromium/i.test(ua)) return "Chrome";
  if (/safari/i.test(ua)) return "Safari";
  return "Other";
}

function detectOS(ua: string): string {
  if (/windows nt/i.test(ua)) return "Windows";
  if (/android/i.test(ua)) return "Android";
  // iOS check must precede macOS: iPad UAs can include "Mac OS X".
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  if (/mac os x|macintosh/i.test(ua)) return "macOS";
  if (/cros/i.test(ua)) return "ChromeOS";
  if (/linux/i.test(ua)) return "Linux";
  return "Other";
}

function detectDevice(ua: string): DeviceClass {
  if (BOT_RE.test(ua)) return "bot";
  // iPad reports as desktop Safari on iPadOS 13+, so check tablet tokens early.
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/i.test(ua))
    return "tablet";
  if (/mobi|iphone|ipod|android.*mobile|windows phone|blackberry/i.test(ua))
    return "mobile";
  return "desktop";
}

/** Parse a raw User-Agent header into coarse analytics buckets. */
export function parseUserAgent(uaRaw: string | null | undefined): ParsedUA {
  const ua = (uaRaw ?? "").trim();
  if (!ua) return { device: "bot", browser: "Other", os: "Other" };

  // Bots get a uniform parse — their browser/OS tokens are noise.
  if (BOT_RE.test(ua)) return { device: "bot", browser: "Bot", os: "Other" };

  return {
    device: detectDevice(ua),
    browser: detectBrowser(ua),
    os: detectOS(ua),
  };
}
