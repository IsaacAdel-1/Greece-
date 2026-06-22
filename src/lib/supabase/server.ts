import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase access.
 *
 * This module uses the SERVICE ROLE key, which bypasses Row Level Security and
 * must NEVER reach the browser. The `server-only` import above makes the build
 * fail if any client component imports this file, so the key cannot leak into a
 * client bundle.
 *
 * The whole app is designed to run with OR without Supabase:
 *  - When SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set, data is read from
 *    and written to the database.
 *  - When they are absent (e.g. fresh clone, local dev before setup), every
 *    consumer falls back to the static seed data / no-ops, so the public site
 *    keeps working and nothing throws.
 *
 * Call `getSupabaseAdmin()` and branch on `null`, or guard with
 * `isSupabaseConfigured()` first.
 */

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** True when the server has working Supabase credentials. */
export function isSupabaseConfigured(): boolean {
  return Boolean(url && serviceKey);
}

/** Storage bucket holding uploaded product images (public-read). */
export const STORAGE_BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET || "product-images";

// Cache the client across requests within a single server process. The SDK is
// safe to reuse and creating one per request would leak connections.
let cached: SupabaseClient | null = null;

/**
 * Returns a service-role Supabase client, or `null` when Supabase is not
 * configured. Callers MUST handle the null case (fall back to seed data).
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (cached) return cached;

  cached = createClient(url!, serviceKey!, {
    auth: {
      // This is a stateless server client — never persist or refresh sessions.
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  return cached;
}
