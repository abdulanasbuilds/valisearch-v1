/**
 * Supabase client — singleton instance for the browser.
 * Works with any Supabase project when env vars are set.
 * Falls back gracefully when not configured.
 * 
 * Supports both NEW publishable key (sb_publishable_k_...) and 
 * LEGACY anon key (eyJhbG... JWT) for backward compatibility.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { ENV, isSupabaseConfigured, getSupabaseKey } from "@/config/env";

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!_supabase) {
    const key = getSupabaseKey();
    _supabase = createClient(ENV.SUPABASE_URL, key, {
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
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY)."
    );
  }
  return client;
}
