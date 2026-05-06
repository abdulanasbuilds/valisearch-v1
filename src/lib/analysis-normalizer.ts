import { getFullFallbackAnalysis } from "@/data/fallback";
import { getMockAnalysis } from "@/services/analysis.service";

const FRAMEWORK_IDS = [
  "market_breakdown",
  "problem_prioritization",
  "offer_creation",
  "distribution_plan",
  "viral_content",
  "competitor_weakness",
  "scale_system",
] as const;

function hasContent(value: unknown) {
  if (!value || typeof value !== "object") return false;
  return Object.keys(value as Record<string, unknown>).length > 0;
}

export function normalizeAnalysis(raw: unknown, idea = "AI-powered productivity tool") {
  const legacy = getMockAnalysis(idea);
  if (!raw || typeof raw !== "object") return legacy;

  const record = raw as Record<string, unknown>;
  const looksLikeV2 = FRAMEWORK_IDS.some((id) => id in record) || "data_sources" in record || "overall_score" in record;
  if (!looksLikeV2) return record;

  const fallback = getFullFallbackAnalysis() as Record<string, unknown>;
  const hydrated = FRAMEWORK_IDS.reduce<Record<string, unknown>>((acc, id) => {
    acc[id] = hasContent(record[id]) ? record[id] : fallback[id];
    return acc;
  }, {});

  const score = typeof record.overall_score === "number" ? record.overall_score : legacy.final_verdict.score;
  return {
    ...legacy,
    ...record,
    ...hydrated,
    overall_score: score,
    final_verdict: { ...legacy.final_verdict, score },
    scoring: { ...legacy.scoring, weighted_final_score: score },
  };
}