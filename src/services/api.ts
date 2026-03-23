/**
 * Frontend API service — handles AI calls directly from the browser.
 * Provider chain: OpenRouter → Groq → Gemini → mock fallback
 * API keys read from: localStorage (user-set) → VITE_ env vars
 */

import type { ValiSearchAnalysis } from "@/types/analysis";
import { getMockAnalysis } from "@/services/analysis.service";
import { parseModelJson } from "@/lib/ai/json";
import { SYSTEM_ANALYSIS, buildAnalyzeUserPrompt } from "@/lib/ai/prompts";

const MAX_TOKENS = 8192;
const TEMP = 0.35;

/* ── Key resolution ─────────────────────────────────────── */
export function getOpenRouterKey(): string | null {
  return localStorage.getItem("vs_openrouter_key") || import.meta.env.VITE_OPENROUTER_API_KEY || null;
}
export function getGroqKey(): string | null {
  return localStorage.getItem("vs_groq_key") || import.meta.env.VITE_GROQ_API_KEY || null;
}
export function getGeminiKey(): string | null {
  return localStorage.getItem("vs_gemini_key") || import.meta.env.VITE_GEMINI_API_KEY || null;
}
export function hasAnyApiKey(): boolean {
  return !!(getOpenRouterKey() || getGroqKey() || getGeminiKey());
}
export function saveApiKey(provider: "openrouter" | "groq" | "gemini", key: string) {
  localStorage.setItem(`vs_${provider}_key`, key.trim());
}
export function clearApiKeys() {
  ["openrouter", "groq", "gemini"].forEach((p) => localStorage.removeItem(`vs_${p}_key`));
}

/* ── Credits ────────────────────────────────────────────── */
const FREE_CREDITS = 3;
export function getCredits(): number {
  const stored = localStorage.getItem("vs_credits");
  if (stored === null) {
    localStorage.setItem("vs_credits", String(FREE_CREDITS));
    return FREE_CREDITS;
  }
  return parseInt(stored, 10);
}
export function deductCredit() {
  const current = getCredits();
  localStorage.setItem("vs_credits", String(Math.max(0, current - 1)));
}
export function hasCredits(): boolean {
  return hasAnyApiKey() || getCredits() > 0;
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
      model,
      max_tokens: MAX_TOKENS,
      temperature: TEMP,
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
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: MAX_TOKENS,
      temperature: TEMP,
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
  const prompt = `${SYSTEM_ANALYSIS}\n\n${buildAnalyzeUserPrompt(idea)}`;
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
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

/* ── Provider chain ─────────────────────────────────────── */
async function runProviderChain(idea: string): Promise<{ result: ValiSearchAnalysis; source: "ai" }> {
  const errors: string[] = [];

  const orKey = getOpenRouterKey();
  if (orKey) {
    try {
      const result = await callOpenRouter(idea, orKey);
      if (result) return { result, source: "ai" };
    } catch (e) {
      errors.push(`OpenRouter: ${e instanceof Error ? e.message : String(e)}`);
      console.warn("[valisearch:ai] OpenRouter failed →", e);
    }
  }

  const groqKey = getGroqKey();
  if (groqKey) {
    try {
      const result = await callGroq(idea, groqKey);
      if (result) return { result, source: "ai" };
    } catch (e) {
      errors.push(`Groq: ${e instanceof Error ? e.message : String(e)}`);
      console.warn("[valisearch:ai] Groq failed →", e);
    }
  }

  const geminiKey = getGeminiKey();
  if (geminiKey) {
    try {
      const result = await callGemini(idea, geminiKey);
      if (result) return { result, source: "ai" };
    } catch (e) {
      errors.push(`Gemini: ${e instanceof Error ? e.message : String(e)}`);
      console.warn("[valisearch:ai] Gemini failed →", e);
    }
  }

  throw new Error(`All AI providers failed:\n${errors.join("\n")}`);
}

/* ── Main export ─────────────────────────────────────────── */
export async function analyzeIdea(idea: string): Promise<{
  result: ValiSearchAnalysis;
  source: "ai" | "mock";
}> {
  const trimmed = idea.trim();
  if (!trimmed) throw new Error("Please describe your startup idea.");

  if (hasAnyApiKey()) {
    return runProviderChain(trimmed);
  }

  if (getCredits() > 0) {
    deductCredit();
    try {
      return await runProviderChain(trimmed);
    } catch {
      // All AI providers failed — use mock
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 2200));
  return { result: getMockAnalysis(trimmed), source: "mock" };
}

export async function fetchCompetitorData(_topic: string) {
  return { topic: _topic, raw_results: [] };
}
export async function fetchMarketData(_topic: string) {
  return { topic: _topic, extra_signals: [] };
}
