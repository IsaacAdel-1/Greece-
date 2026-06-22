/**
 * Privacy-preserving visitor identifier.
 *
 * We never store a raw IP. Instead we derive a one-way salted hash of
 * (day + ip + user-agent + secret). Because the day is part of the input, the
 * hash ROTATES every 24h — so the same person cannot be tracked across days,
 * yet within a single day we can de-duplicate to count unique visitors.
 */

const encoder = new TextEncoder();

export async function visitorHash(
  ip: string,
  userAgent: string,
  secret: string,
  day: string = new Date().toISOString().slice(0, 10),
): Promise<string> {
  const input = `${day}|${ip}|${userAgent}|${secret}`;
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(input));
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}
