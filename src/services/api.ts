/**
 * Frontend API service — centralized AI proxy pattern.
 * All AI calls route through a single internal proxy concept.
 * Keys: VITE_ env vars (platform-managed, never user-facing)
 * Caching: localStorage per-idea hash (avoids duplicate API calls)
 */

import type { ValiSearchAnalysis } from "@/types/analysis";
import { getMockAnalysis } from "@/services/analysis.service";
import { parseModelJson } from "@/lib/ai/json";
import { SYSTEM_ANALYSIS, buildAnalyzeUserPrompt } from "@/lib/ai/prompts";

const MAX_TOKENS = 8192;
const TEMP = 0.35;
const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

/* ── Key resolution (env vars only — no localStorage) ──── */
export function getOpenRouterKey(): string | null {
  return import.meta.env.VITE_OPENROUTER_API_KEY || null;
}
export function getGroqKey(): string | null {
  return import.meta.env.VITE_GROQ_API_KEY || null;
}
export function getGeminiKey(): string | null {
  return import.meta.env.VITE_GEMINI_API_KEY || null;
}
export function hasAnyApiKey(): boolean {
  return !!(getOpenRouterKey() || getGroqKey() || getGeminiKey());
}

/** @deprecated No-op — keys are now platform-managed */
export function saveApiKey(_provider: string, _key: string) {}
/** @deprecated No-op — keys are now platform-managed */
export function clearApiKeys() {}

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
  } catch { return null; }
}
function setCache(idea: string, data: ValiSearchAnalysis) {
  try {
    localStorage.setItem(cacheKey(idea), JSON.stringify({ data, ts: Date.now() }));
  } catch { /* full */ }
}
export function clearCacheForIdea(idea: string) {
  localStorage.removeItem(cacheKey(idea));
}
export function clearAllCache() {
  Object.keys(localStorage).filter((k) => k.startsWith("vs_cache__")).forEach((k) => localStorage.removeItem(k));
}

/* ── Credits (managed by useCreditStore) ────────────────── */
export function getCredits(): number {
  return 999; // Legacy compat — real credits in useCreditStore
}
export function deductCredit() {}
export function hasCredits(): boolean {
  return true;
}

/* ── AI provider calls ──────────────────────────────────── */
async function callOpenRouter(idea: string, apiKey: string): Promise<ValiSearchAnalysis | null> {
  const model = import.meta.env.VITE_OPENROUTER_MODEL || "google/gemma-2-9b-it:free";
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "https://valisearch.app",
      "X-Title": "ValiSearch",
    },
    body: JSON.stringify({
      model, max_tokens: MAX_TOKENS, temperature: TEMP,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_ANALYSIS },
        { role: "user", content: buildAnalyzeUserPrompt(idea) },
      ],
    }),
  });
  if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content;
  if (!raw) throw new Error("OpenRouter: empty response");
  return parseModelJson<ValiSearchAnalysis>(raw);
}

async function callGroq(idea: string, apiKey: string): Promise<ValiSearchAnalysis | null> {
  const model = import.meta.env.VITE_GROQ_MODEL || "llama-3.1-8b-instant";
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model, max_tokens: MAX_TOKENS, temperature: TEMP,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_ANALYSIS },
        { role: "user", content: buildAnalyzeUserPrompt(idea) },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Groq ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content;
  if (!raw) throw new Error("Groq: empty response");
  return parseModelJson<ValiSearchAnalysis>(raw);
}

async function callGemini(idea: string, apiKey: string): Promise<ValiSearchAnalysis | null> {
  const model = import.meta.env.VITE_GEMINI_MODEL || "gemini-1.5-flash";
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${SYSTEM_ANALYSIS}\n\n${buildAnalyzeUserPrompt(idea)}` }] }],
        generationConfig: { maxOutputTokens: MAX_TOKENS, temperature: TEMP, responseMimeType: "application/json" },
      }),
    }
  );
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!raw) throw new Error("Gemini: empty response");
  return parseModelJson<ValiSearchAnalysis>(raw);
}

async function runProviderChain(idea: string): Promise<{ result: ValiSearchAnalysis; source: "ai" }> {
  const errors: string[] = [];
  const providers: Array<{ name: string; fn: () => Promise<ValiSearchAnalysis | null> }> = [];

  const orKey = getOpenRouterKey();
  if (orKey) providers.push({ name: "OpenRouter", fn: () => callOpenRouter(idea, orKey) });

  const groqKey = getGroqKey();
  if (groqKey) providers.push({ name: "Groq", fn: () => callGroq(idea, groqKey) });

  const geminiKey = getGeminiKey();
  if (geminiKey) providers.push({ name: "Gemini", fn: () => callGemini(idea, geminiKey) });

  for (const { name, fn } of providers) {
    try {
      const result = await fn();
      if (result) return { result, source: "ai" };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`${name}: ${msg}`);
      console.warn(`[valisearch:ai] ${name} failed →`, msg);
    }
  }
  throw new Error(`All AI providers failed:\n${errors.join("\n")}`);
}

/* ── Input validation ───────────────────────────────────── */
const MAX_IDEA_LENGTH = 500;
const MIN_IDEA_LENGTH = 10;

function validateIdea(raw: string): string {
  const trimmed = raw.trim();
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

  // Cache hit → skip API call entirely
  const cached = getCached(trimmed);
  if (cached) {
    console.info("[valisearch] Cache hit — skipping API call");
    return { result: cached, source: "ai" };
  }

  // Try AI providers first, fall back to mock
  if (hasAnyApiKey()) {
    try {
      const { result, source } = await runProviderChain(trimmed);
      setCache(trimmed, result);
      return { result, source };
    } catch (e) {
      console.warn("[valisearch] AI providers failed, using mock data:", e);
    }
  }

  // Mock fallback — always available
  await new Promise((resolve) => setTimeout(resolve, 2200));
  return { result: getMockAnalysis(trimmed), source: "mock" };
}

export async function fetchCompetitorData(_topic: string) {
  return { topic: _topic, raw_results: [] };
}
export async function fetchMarketData(_topic: string) {
  return { topic: _topic, extra_signals: [] };
}
