/**
 * Frontend API service — production-grade.
 *
 * When Supabase is configured: routes AI calls through Edge Functions.
 * When not configured: falls back to mock data (demo mode).
 *
 * NO secret API keys touch the browser — ever.
 */

import type { ValiSearchAnalysis } from "@/types/analysis";
import { getMockAnalysis } from "@/services/analysis.service";
import { getSupabase } from "@/lib/supabase";
import { isSupabaseConfigured } from "@/config/env";
import { sanitizeIdea } from "@/lib/sanitize";

const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

/* ── Result caching ─────────────────────────────────────── */
function cacheKey(idea: string): string {
  return `vs_cache__${idea.trim().toLowerCase().replace(/\W+/g, "_").slice(0, 60)}`;
}

function getCached(idea: string): ValiSearchAnalysis | null {
  try {
    const raw = localStorage.getItem(cacheKey(idea));
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL_MS) {
      localStorage.removeItem(cacheKey(idea));
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setCache(idea: string, data: ValiSearchAnalysis) {
  try {
    localStorage.setItem(cacheKey(idea), JSON.stringify({ data, ts: Date.now() }));
  } catch {
    /* storage full */
  }
}

export function clearCacheForIdea(idea: string) {
  localStorage.removeItem(cacheKey(idea));
}

export function clearAllCache() {
  Object.keys(localStorage)
    .filter((k) => k.startsWith("vs_cache__"))
    .forEach((k) => localStorage.removeItem(k));
}

/* ── Credits (legacy compat) ────────────────────────────── */
export function getCredits(): number {
  return 999;
}
export function deductCredit() {}
export function hasCredits(): boolean {
  return true;
}

/* ── Key checks (legacy compat — keys are now in edge functions) ── */
export function getOpenRouterKey(): string | null {
  return null;
}
export function getGroqKey(): string | null {
  return null;
}
export function getGeminiKey(): string | null {
  return null;
}
export function hasAnyApiKey(): boolean {
  return isSupabaseConfigured(); // If Supabase is set up, edge functions have the keys
}
export function saveApiKey(_provider: string, _key: string) {}
export function clearApiKeys() {}

/* ── Input validation ───────────────────────────────────── */
const MAX_IDEA_LENGTH = 2000;
const MIN_IDEA_LENGTH = 10;

function validateIdea(raw: string): string {
  const trimmed = sanitizeIdea(raw);
  if (!trimmed) throw new Error("Please describe your startup idea.");
  if (trimmed.length < MIN_IDEA_LENGTH)
    throw new Error(`Your idea is too short — please add at least ${MIN_IDEA_LENGTH} characters.`);
  if (trimmed.length > MAX_IDEA_LENGTH)
    throw new Error(`Your idea exceeds the ${MAX_IDEA_LENGTH}-character limit. Please shorten it.`);
  return trimmed;
}

/* ── Main export ─────────────────────────────────────────── */
export async function analyzeIdea(idea: string): Promise<{
  result: ValiSearchAnalysis;
  source: "ai" | "mock";
}> {
  const trimmed = validateIdea(idea);

  // Cache hit
  const cached = getCached(trimmed);
  if (cached) {
    console.info("[valisearch] Cache hit — skipping API call");
    return { result: cached, source: "ai" };
  }

  // Try Supabase Edge Function
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.functions.invoke("analyze", {
        body: { idea: trimmed },
      });

      if (error) throw new Error(error.message || "Edge function error");

      if (data?.result) {
        setCache(trimmed, data.result);
        return { result: data.result, source: data.source || "ai" };
      }
    } catch (e) {
      console.warn("[valisearch] Edge function failed, using mock:", e);
    }
  }

  // Mock fallback — always works
  await new Promise((resolve) => setTimeout(resolve, 2200));
  return { result: getMockAnalysis(trimmed), source: "mock" };
}

export async function fetchCompetitorData(topic: string) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data } = await supabase.functions.invoke("competitors", {
        body: { idea: topic },
      });
      return data || { topic, raw_results: [] };
    } catch {
      /* fall through */
    }
  }
  return { topic, raw_results: [] };
}

export async function fetchMarketData(topic: string) {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data } = await supabase.functions.invoke("market", {
        body: { idea: topic },
      });
      return data || { topic, extra_signals: [] };
    } catch {
      /* fall through */
    }
  }
  return { topic, extra_signals: [] };
}
