/**
 * Client-side rate limiting — supplements server-side limits.
 * Uses localStorage to track attempts across page reloads.
 */

const STORAGE_KEY = "vs_rate_limit";
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS_FREE = 3;

interface RateLimitEntry {
  timestamps: number[];
}

function getEntries(): RateLimitEntry {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { timestamps: [] };
    return JSON.parse(raw);
  } catch {
    return { timestamps: [] };
  }
}

function saveEntries(entry: RateLimitEntry): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
  } catch {
    // Storage full — silently fail
  }
}

/** Check if user can make another analysis attempt */
export function canAttemptAnalysis(): boolean {
  const now = Date.now();
  const entry = getEntries();
  const recent = entry.timestamps.filter((t) => now - t < WINDOW_MS);
  return recent.length < MAX_ATTEMPTS_FREE;
}

/** Record an analysis attempt */
export function recordAnalysisAttempt(): void {
  const now = Date.now();
  const entry = getEntries();
  const recent = entry.timestamps.filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  saveEntries({ timestamps: recent });
}

/** Get remaining attempts */
export function getRemainingAttempts(): number {
  const now = Date.now();
  const entry = getEntries();
  const recent = entry.timestamps.filter((t) => now - t < WINDOW_MS);
  return Math.max(0, MAX_ATTEMPTS_FREE - recent.length);
}

/** Get time until next attempt is available (ms) */
export function getTimeUntilNextAttempt(): number {
  const now = Date.now();
  const entry = getEntries();
  const recent = entry.timestamps.filter((t) => now - t < WINDOW_MS).sort();
  if (recent.length < MAX_ATTEMPTS_FREE) return 0;
  return (recent[0] + WINDOW_MS) - now;
}

// ─── Server-side rate limit (for edge functions) ──────────────────────────
const EDGE_WINDOW_MS = 60_000;
const EDGE_MAX_REQUESTS = 40;
const buckets = new Map<string, number[]>();

export function rateLimitAllow(key: string, isDev = false): boolean {
  if (isDev) return true;
  const now = Date.now();
  const prev = buckets.get(key) ?? [];
  const recent = prev.filter((t) => now - t < EDGE_WINDOW_MS);
  if (recent.length >= EDGE_MAX_REQUESTS) return false;
  recent.push(now);
  buckets.set(key, recent);
  return true;
}

export function clientIpFromRequest(request: Request): string {
  const xf = request.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}
