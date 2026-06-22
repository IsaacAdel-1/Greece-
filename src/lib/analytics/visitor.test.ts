import { describe, expect, it } from "vitest";
import { visitorHash } from "./visitor";

describe("visitorHash", () => {
  it("is deterministic for the same inputs on the same day", async () => {
    const a = await visitorHash("1.2.3.4", "UA", "secret", "2026-06-16");
    const b = await visitorHash("1.2.3.4", "UA", "secret", "2026-06-16");
    expect(a).toBe(b);
  });

  it("rotates across days (cannot link a visitor day-to-day)", async () => {
    const day1 = await visitorHash("1.2.3.4", "UA", "secret", "2026-06-16");
    const day2 = await visitorHash("1.2.3.4", "UA", "secret", "2026-06-17");
    expect(day1).not.toBe(day2);
  });

  it("differs by IP, user-agent and secret", async () => {
    const base = await visitorHash("1.2.3.4", "UA", "secret", "2026-06-16");
    expect(await visitorHash("9.9.9.9", "UA", "secret", "2026-06-16")).not.toBe(base);
    expect(await visitorHash("1.2.3.4", "OTHER", "secret", "2026-06-16")).not.toBe(base);
    expect(await visitorHash("1.2.3.4", "UA", "other", "2026-06-16")).not.toBe(base);
  });

  it("produces a 32-char hex string (no raw IP)", async () => {
    const h = await visitorHash("1.2.3.4", "UA", "secret", "2026-06-16");
    expect(h).toMatch(/^[0-9a-f]{32}$/);
    expect(h).not.toContain("1.2.3.4");
  });
});
