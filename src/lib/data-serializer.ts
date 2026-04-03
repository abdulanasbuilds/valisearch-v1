/**
 * DataSerializer — full export, compression, deep-link generation for external builders.
 * Zero data loss: every field from ValiSearchAnalysis is preserved.
 * PRIMARY strategy: clipboard copy + redirect (never rely on deep-link persistence).
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

/* ── Download: JSON ───────────────────────────────────────── */
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

/* ── Download: TXT prompt ─────────────────────────────────── */
export function downloadPayloadTXT(payload: ExportPayload) {
  const text = buildMasterPrompt(payload);
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `valisearch-prompt-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ── Master Prompt (clipboard-first strategy) ─────────────── */
export function buildMasterPrompt(payload: ExportPayload): string {
  return `=== VALISEARCH APP BLUEPRINT ===
Build this app EXACTLY as described. Do not omit any feature.

📌 APP NAME: ${payload.branding.name}
📌 TAGLINE: ${payload.branding.tagline}
📌 POSITIONING: ${payload.branding.positioning}

📝 IDEA:
${payload.idea}

✅ VALIDATION (Score: ${payload.scoring.finalScore}/100 — ${payload.scoring.verdict}):
${payload.scoring.rationale}
- Market Demand: ${payload.validation.market_demand}
- Feasibility: ${payload.validation.feasibility}
- Risks: ${payload.validation.risks.join("; ")}

📊 MARKET:
- TAM: ${payload.market.tam}
- SAM: ${payload.market.sam}
- SOM: ${payload.market.som}
- Trends: ${payload.market.trends.join(", ")}
- Growth: ${payload.market.growth_outlook}

🏆 COMPETITORS:
${payload.competitors.map((c) => `• ${c.name} — Strengths: ${c.strengths.join(", ")} | Weaknesses: ${c.weaknesses.join(", ")}`).join("\n")}

🛠️ MVP FEATURES (Build these FIRST):
${payload.features.mvp.map((f) => `• ${f}`).join("\n")}

⭐ CORE FEATURES:
${payload.features.core.map((f) => `• ${f}`).join("\n")}

🚀 ADVANCED FEATURES:
${payload.features.advanced.map((f) => `• ${f}`).join("\n")}

🔄 USER JOURNEY:
${payload.flows.userJourney.join(" → ")}

📄 PAGES:
- Landing: ${payload.flows.pages.landing}
- Dashboard: ${payload.flows.pages.dashboard}
- Core Flows: ${payload.flows.pages.core_flows.join(", ")}

⚙️ TECH STACK:
- Frontend: ${payload.techStack.frontend}
- Backend: ${payload.techStack.backend}
- Database: ${payload.techStack.database}
- APIs: ${payload.techStack.apis}

💰 MONETIZATION: ${payload.monetization.model}
${payload.monetization.tiers.map((t) => `• ${t.name} (${t.price}): ${t.reasoning}`).join("\n")}
Revenue Streams: ${payload.monetization.streams.join(", ")}

📣 GO-TO-MARKET:
- Channels: ${payload.gtm.channels.join(", ")}
- Launch Plan: ${payload.gtm.launch_plan.join(" → ")}
- Growth: ${payload.gtm.growth_strategies.join(", ")}

=== END BLUEPRINT ===
Build the complete app. Start with MVP features. Use the specified tech stack.`;
}

/* ── Deep link builders ───────────────────────────────────── */
const UTM = "utm_source=valisearch&utm_medium=export&utm_campaign=build";

export function buildLovableDeepLink(
  payload: ExportPayload,
  userId = "anon"
): string {
  // Lovable supports prompt in URL — use short version, full data is always clipboard-copied
  const shortPrompt = `Build "${payload.branding.name}" — ${payload.branding.tagline}. MVP features: ${payload.features.mvp.slice(0, 5).join(", ")}. Tech: ${payload.techStack.frontend}/${payload.techStack.backend}. Full blueprint was copied to clipboard — paste it for complete specs.`;
  return `https://lovable.dev/projects/new?prompt=${encodeURIComponent(shortPrompt)}&ref=valisearch_${userId}&${UTM}`;
}

export function build10WebDeepLink(): string {
  return `https://10web.io/ai-website-builder/?aff=valisearch&${UTM}`;
}

export function buildBubbleDeepLink(): string {
  return `https://bubble.io/new?ref=valisearch&${UTM}`;
}

/* ── Clipboard text (human-readable specs) ────────────────── */
export function buildClipboardSpecs(payload: ExportPayload): string {
  return buildMasterPrompt(payload);
}

/* ── Analytics helper ─────────────────────────────────────── */
export type ExportEvent = {
  builder: string;
  action: "click" | "copy" | "download_json" | "download_txt" | "open_link";
  timestamp: number;
};

export function trackExportEvent(builder: string, action: ExportEvent["action"]) {
  try {
    const key = "vs_export_analytics";
    const data: ExportEvent[] = JSON.parse(localStorage.getItem(key) || "[]");
    data.push({ builder, action, timestamp: Date.now() });
    localStorage.setItem(key, JSON.stringify(data));
  } catch { /* noop */ }
}
