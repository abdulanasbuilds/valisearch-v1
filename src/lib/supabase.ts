/**
 * Supabase client — singleton instance for the browser.
 * Works with any Supabase project when env vars are set.
 * Falls back gracefully when not configured.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { ENV, isSupabaseConfigured } from "@/config/env";

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!_supabase) {
    _supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }

  return _supabase;
}

/**
 * Get supabase client or throw — use in places where
 * Supabase MUST be available (auth pages, DB calls).
 */
export function requireSupabase(): SupabaseClient {
  const client = getSupabase();
  if (!client) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
    );
  }
  return client;
}
