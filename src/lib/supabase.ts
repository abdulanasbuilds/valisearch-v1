import { createClient } from '@supabase/supabase-js';
import { ENV } from '@/config/env';

/**
 * Singleton instance of the Supabase client.
 * Uses environment variables for configuration.
 */
export const supabase = createClient(
  ENV.SUPABASE_URL,
  ENV.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: 'valisearch-auth',
    },
  }
);

/**
 * Convenience getter for the Supabase client.
 * Used across services and components.
 */
export const getSupabase = () => supabase;

// Types for the database generated from schema
export type Database = any;
