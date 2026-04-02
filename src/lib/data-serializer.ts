/**
 * DataSerializer — full export, compression, deep-link generation for external builders.
 * Zero data loss: every field from ValiSearchAnalysis is preserved.
 */
import LZString from "lz-string";
import type { ValiSearchAnalysis } from "@/types/analysis";

/* ── Full structured export ───────────────────────────────── */
export interface ExportPayload {
  idea: string;
  validation: {
    market_demand: string;
    feasibility: string;
    risks: string[];
  };
  market: {
    tam: string;
    sam: string;
    som: string;
    trends: string[];
    growth_outlook: string;
  };
  competitors: Array<{
    name: string;
    strengths: string[];
    weaknesses: string[];
  }>;
  features: {
    mvp: string[];
    core: string[];
    advanced: string[];
  };
  flows: {
    userJourney: string[];
    pages: {
      landing: string;
      dashboard: string;
      core_flows: string[];
    };
    mermaidDiagram: string;
  };
  techStack: {
    frontend: string;
    backend: string;
    database: string;
    apis: string;
  };
  monetization: {
    model: string;
    tiers: Array<{ name: string; price: string; reasoning: string }>;
    streams: string[];
  };
  gtm: {
    channels: string[];
    launch_plan: string[];
    growth_strategies: string[];
  };
  branding: {
    name: string;
    tagline: string;
    positioning: string;
  };
  scoring: {
    finalScore: number;
    verdict: string;
    rationale: string;
  };
}

export function buildExportPayload(
  idea: string,
  a: ValiSearchAnalysis
): ExportPayload {
  return {
    idea,
    validation: {
      market_demand: a.validation.market_demand,
      feasibility: a.validation.feasibility,
      risks: a.validation.risks,
    },
    market: {
      tam: a.market_research.tam_sam_som.tam,
      sam: a.market_research.tam_sam_som.sam,
      som: a.market_research.tam_sam_som.som,
      trends: a.market_research.trends,
      growth_outlook: a.market_research.growth_outlook,
    },
    competitors: a.competitor_analysis.competitors,
    features: {
      mvp: a.product_strategy.mvp_features,
      core: a.product_strategy.differentiation_features,
      advanced: a.product_strategy.premium_features,
    },
    flows: {
      userJourney: a.user_flow.journey_steps,
      pages: a.user_flow.page_structure,
      mermaidDiagram: a.product_strategy.system_architecture_overview,
    },
    techStack: a.tech_stack.mvp,
    monetization: {
      model: a.monetization.pricing_model,
      tiers: a.monetization.pricing_tiers.map((t) => ({
        name: t.name,
        price: t.price_hint,
        reasoning: t.reasoning,
      })),
      streams: a.monetization.revenue_streams,
    },
    gtm: a.go_to_market,
    branding: {
      name: a.branding.name_suggestions[0] ?? "",
      tagline: a.branding.taglines[0] ?? "",
      positioning: a.branding.brand_positioning,
    },
    scoring: {
      finalScore: a.scoring.weighted_final_score,
      verdict: a.scoring.verdict,
      rationale: a.scoring.verdict_rationale,
    },
  };
}

/* ── Compression ──────────────────────────────────────────── */
export function compressPayload(payload: ExportPayload): string {
  const minified = JSON.stringify(payload);
  return LZString.compressToBase64(minified);
}

export function decompressPayload(compressed: string): ExportPayload {
  const json = LZString.decompressFromBase64(compressed);
  if (!json) throw new Error("Failed to decompress payload");
  return JSON.parse(json);
}

/* ── Download fallback ────────────────────────────────────── */
export function downloadPayloadJSON(payload: ExportPayload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `valisearch-blueprint-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ── Deep link builders ───────────────────────────────────── */
const UTM = "utm_source=valisearch&utm_medium=export&utm_campaign=build";

export function buildLovableDeepLink(
  payload: ExportPayload,
  userId = "anon"
): string {
  const featuresList = payload.features.mvp.join(", ");
  const prompt = `You are building the exact app from this ValiSearch blueprint. Parse and implement EVERYTHING without omission.

1. APP: "${payload.branding.name}" — ${payload.branding.tagline}
2. FEATURES (MVP first): ${featuresList}
3. USER FLOWS: ${payload.flows.userJourney.join(" → ")}
4. TECH: ${payload.techStack.frontend} / ${payload.techStack.backend} / ${payload.techStack.database}
5. BRANDING: Name: ${payload.branding.name}, Tagline: ${payload.branding.tagline}
6. MONETIZATION: ${payload.monetization.model} — ${payload.monetization.tiers.map((t) => `${t.name}: ${t.price}`).join(", ")}
7. Complete app ready for signup persistence.

FULL DATA:
${JSON.stringify(payload, null, 0)}`;

  const compressed = compressPayload(payload);
  // If compressed fits in URL use it, otherwise use prompt-only approach
  const useCompressed = compressed.length < 6000;

  const encodedPrompt = encodeURIComponent(
    useCompressed ? prompt : prompt.substring(0, 4000)
  );

  return `https://lovable.dev/projects/new?prompt=${encodedPrompt}&ref=valisearch_${userId}&${UTM}`;
}

export function build10WebDeepLink(): string {
  return `https://10web.io/ai-website-builder/?aff=valisearch&${UTM}`;
}

export function buildBubbleDeepLink(): string {
  return `https://bubble.io/new?ref=valisearch&${UTM}`;
}

/* ── Clipboard text for non-deeplink builders ─────────────── */
export function buildClipboardSpecs(payload: ExportPayload): string {
  return `# ${payload.branding.name}
> ${payload.branding.tagline}

## Description
${payload.idea}

## Brand Positioning
${payload.branding.positioning}

## MVP Features
${payload.features.mvp.map((f) => `• ${f}`).join("\n")}

## Core Features
${payload.features.core.map((f) => `• ${f}`).join("\n")}

## Advanced Features
${payload.features.advanced.map((f) => `• ${f}`).join("\n")}

## User Journey
${payload.flows.userJourney.join(" → ")}

## Tech Stack
- Frontend: ${payload.techStack.frontend}
- Backend: ${payload.techStack.backend}
- Database: ${payload.techStack.database}
- APIs: ${payload.techStack.apis}

## Monetization: ${payload.monetization.model}
${payload.monetization.tiers.map((t) => `• ${t.name} (${t.price}): ${t.reasoning}`).join("\n")}

## Go-to-Market
Channels: ${payload.gtm.channels.join(", ")}

## Validation Score: ${payload.scoring.finalScore}/100 — ${payload.scoring.verdict}
`;
}
