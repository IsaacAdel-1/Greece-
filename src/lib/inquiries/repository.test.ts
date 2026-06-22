import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  __resetInquiryMemory,
  countInquiries,
  countUnreadInquiries,
  deleteInquiry,
  getGenderBreakdown,
  listInquiries,
  saveInquiry,
  setInquiryRead,
} from "./repository";
import type { NewInquiry } from "./types";

/**
 * Exercises the in-memory fallback (no Supabase configured in tests). Verifies
 * the same contract the Supabase path implements.
 */

function make(over: Partial<NewInquiry> = {}): NewInquiry {
  return {
    name: "Sara Mohamed",
    email: "sara@example.com",
    message: "Interested in the Belgrave sofa.",
    productSlug: null,
    gender: null,
    genderGuess: "female",
    genderConfidence: 0.9,
    country: "EG",
    city: "Cairo",
    referrer: null,
    device: "mobile",
    browser: "Safari",
    ...over,
  };
}

beforeEach(() => __resetInquiryMemory());
afterEach(() => __resetInquiryMemory());

describe("inquiries repository (memory)", () => {
  it("saves and lists newest-first", async () => {
    await saveInquiry(make({ name: "First" }));
    await saveInquiry(make({ name: "Second" }));
    const all = await listInquiries();
    expect(all).toHaveLength(2);
    expect(all[0]!.name).toBe("Second");
    expect(await countInquiries()).toBe(2);
  });

  it("tracks unread count and toggling read", async () => {
    await saveInquiry(make());
    expect(await countUnreadInquiries()).toBe(1);
    const [item] = await listInquiries();
    expect(await setInquiryRead(item!.id, true)).toBe(true);
    expect(await countUnreadInquiries()).toBe(0);
  });

  it("deletes by id", async () => {
    await saveInquiry(make());
    const [item] = await listInquiries();
    expect(await deleteInquiry(item!.id)).toBe(true);
    expect(await countInquiries()).toBe(0);
    expect(await deleteInquiry("does-not-exist")).toBe(false);
  });

  it("builds a gender breakdown, declared beating guess", async () => {
    await saveInquiry(make({ gender: "male", genderGuess: "female" })); // declared wins
    await saveInquiry(make({ gender: null, genderGuess: "female" })); // guess used
    await saveInquiry(make({ gender: null, genderGuess: "unknown" })); // unknown
    const g = await getGenderBreakdown();
    expect(g).toEqual({ male: 1, female: 1, unknown: 1 });
  });
});
