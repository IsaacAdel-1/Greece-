import { describe, expect, it } from "vitest";
import { parseUserAgent } from "./ua";

describe("parseUserAgent", () => {
  it("treats empty/missing UA as a bot", () => {
    expect(parseUserAgent("").device).toBe("bot");
    expect(parseUserAgent(null).device).toBe("bot");
    expect(parseUserAgent(undefined).device).toBe("bot");
  });

  it("detects common crawlers as bots", () => {
    for (const ua of [
      "Googlebot/2.1 (+http://www.google.com/bot.html)",
      "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
      "facebookexternalhit/1.1",
      "WhatsApp/2.23",
      "curl/8.4.0",
    ]) {
      expect(parseUserAgent(ua)).toMatchObject({ device: "bot", browser: "Bot" });
    }
  });

  it("parses desktop Chrome on Windows", () => {
    const ua =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";
    expect(parseUserAgent(ua)).toEqual({
      device: "desktop",
      browser: "Chrome",
      os: "Windows",
    });
  });

  it("parses iPhone Safari as mobile/iOS", () => {
    const ua =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
    expect(parseUserAgent(ua)).toEqual({
      device: "mobile",
      browser: "Safari",
      os: "iOS",
    });
  });

  it("parses Android Chrome as mobile/Android", () => {
    const ua =
      "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36";
    expect(parseUserAgent(ua)).toMatchObject({
      device: "mobile",
      browser: "Chrome",
      os: "Android",
    });
  });

  it("classifies an Android tablet (no 'Mobile' token) as tablet", () => {
    const ua =
      "Mozilla/5.0 (Linux; Android 13; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";
    expect(parseUserAgent(ua).device).toBe("tablet");
  });

  it("detects Edge before Chrome", () => {
    const ua =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36 Edg/120.0";
    expect(parseUserAgent(ua).browser).toBe("Edge");
  });

  it("detects Firefox and macOS", () => {
    const ua =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0";
    expect(parseUserAgent(ua)).toEqual({
      device: "desktop",
      browser: "Firefox",
      os: "macOS",
    });
  });
});
