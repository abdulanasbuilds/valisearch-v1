/**
 * Environment variable configuration — production-grade.
 *
 * PUBLIC variables (VITE_ prefix) are safe for the browser.
 * SECRET variables must ONLY live in Supabase Edge Functions.
 */

function getEnvVar(name: string, fallback?: string): string {
  const value = import.meta.env[name] || fallback;
  if (!value && fallback === undefined) {
    console.warn(`[env] Missing environment variable: ${name}`);
  }
  return value || "";
}

// ─── Client-side environment variables (safe for browser) ─────────────────
export const ENV = {
  SUPABASE_URL: getEnvVar("VITE_SUPABASE_URL"),
  SUPABASE_ANON_KEY: getEnvVar("VITE_SUPABASE_ANON_KEY"),
  STRIPE_PUBLISHABLE_KEY: getEnvVar("VITE_STRIPE_PUBLISHABLE_KEY"),
  APP_URL: getEnvVar("VITE_APP_URL", typeof window !== "undefined" ? window.location.origin : ""),
  APP_NAME: getEnvVar("VITE_APP_NAME", "ValiSearch"),
} as const;

/** Check if Supabase is configured */
export function isSupabaseConfigured(): boolean {
  return !!(ENV.SUPABASE_URL && ENV.SUPABASE_ANON_KEY);
}

/** Check if Stripe is configured */
export function isStripeConfigured(): boolean {
  return !!ENV.STRIPE_PUBLISHABLE_KEY;
}

// ─── Server-side env var names (reference only — NOT available in browser) ──
// These secrets must be added to your Supabase Edge Function environment:
//
// AI Providers:
//   OPENAI_API_KEY, OPENROUTER_API_KEY, GROQ_API_KEY, GEMINI_API_KEY
//
// Search/Data APIs:
//   SERPAPI_KEY, BRAVE_SEARCH_API_KEY
//
// Payments:
//   STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
//
// Supabase (auto-available in edge functions):
//   SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
