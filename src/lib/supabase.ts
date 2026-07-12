import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase factories for custom data: creators, referrals, UGC, loyalty,
 * subscribers. Returns null when env vars are absent so callers can fall back
 * to mock data without crashing. See supabase/schema.sql for the tables.
 */
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(URL && ANON);

/** Browser/client component client (anon key, RLS-protected). */
export function getSupabaseClient(): SupabaseClient | null {
  if (!URL || !ANON) return null;
  return createClient(URL, ANON);
}

/** Server-only admin client (service role — never expose to the browser). */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!URL || !SERVICE) {
    console.warn("[stub] Supabase service role missing — using mock data.");
    return null;
  }
  return createClient(URL, SERVICE, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
