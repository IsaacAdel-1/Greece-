import { describe, expect, it } from "vitest";
import { inferGender } from "./infer";

describe("inferGender", () => {
  it("returns unknown for empty/invalid input", () => {
    for (const v of ["", "   ", null, undefined]) {
      expect(inferGender(v as string)).toEqual({
        gender: "unknown",
        confidence: 0,
        source: "none",
      });
    }
  });

  it("matches common Latin male names with high confidence", () => {
    for (const n of ["Ahmed", "mohamed", "Omar", "Mina", "Karim"]) {
      const g = inferGender(n);
      expect(g.gender).toBe("male");
      expect(g.confidence).toBeGreaterThanOrEqual(0.9);
      expect(g.source).toBe("dictionary");
    }
  });

  it("matches common Latin female names", () => {
    for (const n of ["Sara", "Yasmine", "Nour", "Mariam", "Heba"]) {
      expect(inferGender(n).gender).toBe("female");
    }
  });

  it("uses only the first token (full names)", () => {
    expect(inferGender("Ahmed Hassan Ali").gender).toBe("male");
    expect(inferGender("Sara Mohamed").gender).toBe("female");
  });

  it("is case- and diacritic-insensitive", () => {
    expect(inferGender("AHMED").gender).toBe("male");
    expect(inferGender("Sára").gender).toBe("female");
  });

  it("matches Arabic-script names from the dictionary", () => {
    expect(inferGender("محمد").gender).toBe("male");
    expect(inferGender("سارة").gender).toBe("female");
  });

  it("falls back to the Arabic feminine-ending heuristic", () => {
    // A plausible feminine name not in the dictionary, ending in taa marbuta.
    const g = inferGender("سميرة");
    expect(g.gender).toBe("female");
    expect(g.source).toBe("heuristic");
    expect(g.confidence).toBeLessThan(0.9);
  });

  it("returns unknown for unrecognized names", () => {
    expect(inferGender("Xqztra").gender).toBe("unknown");
  });
});
