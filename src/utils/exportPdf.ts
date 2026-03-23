import type { ValiSearchAnalysis } from "@/types/analysis";

/* ── Text / markdown report ─────────────────────────────── */
export function downloadReport(data: ValiSearchAnalysis) {
  const lines: string[] = [];
  const hr = "─".repeat(60);

  lines.push("VALISEARCH — STARTUP ANALYSIS REPORT");
  lines.push(hr);
  lines.push("");

  lines.push("1. OVERVIEW");
  lines.push(hr);
  lines.push(`Score: ${data.final_verdict.score}/100 — Verdict: ${data.final_verdict.verdict}`);
  lines.push("");
  lines.push(data.idea_analysis.summary);
  lines.push("");
  lines.push(`One-liner: ${data.idea_analysis.one_liner}`);
  lines.push("");

  lines.push("SCORING BREAKDOWN:");
  Object.entries(data.scoring.pillars).forEach(([key, pillar]) => {
    lines.push(`  ${key.replace(/_/g, " ").toUpperCase()}: ${pillar.score}/10 — ${pillar.explanation}`);
  });
  lines.push(`  WEIGHTED FINAL: ${data.scoring.weighted_final_score}/100`);
  lines.push("");

  lines.push("2. VALIDATION");
  lines.push(hr);
  lines.push(`Market Demand: ${data.validation.market_demand}`);
  lines.push(`Feasibility: ${data.validation.feasibility}`);
  lines.push("Risks:");
  data.validation.risks.forEach((r) => lines.push(`  ⚠ ${r}`));
  lines.push("");

  lines.push("3. MARKET RESEARCH");
  lines.push(hr);
  lines.push(`TAM: ${data.market_research.tam_sam_som.tam}`);
  lines.push(`SAM: ${data.market_research.tam_sam_som.sam}`);
  lines.push(`SOM: ${data.market_research.tam_sam_som.som}`);
  lines.push(data.market_research.growth_outlook);
  lines.push("Trends:");
  data.market_research.trends.forEach((t) => lines.push(`  • ${t}`));
  lines.push("");

  lines.push("4. COMPETITOR ANALYSIS");
  lines.push(hr);
  lines.push(data.competitor_analysis.summary);
  data.competitor_analysis.competitors.forEach((c) => {
    lines.push(`\n${c.name}`);
    lines.push(`  Strengths: ${c.strengths.join(", ")}`);
    lines.push(`  Weaknesses: ${c.weaknesses.join(", ")}`);
  });
  lines.push(`\nDifferentiation: ${data.competitor_analysis.differentiation_strategy}`);
  lines.push("");

  lines.push("5. PRODUCT STRATEGY");
  lines.push(hr);
  lines.push("MVP Features:");
  data.product_strategy.mvp_features.forEach((f) => lines.push(`  ✓ ${f}`));
  lines.push("Differentiators:");
  data.product_strategy.differentiation_features.forEach((f) => lines.push(`  ◆ ${f}`));
  lines.push("Premium Features:");
  data.product_strategy.premium_features.forEach((f) => lines.push(`  ★ ${f}`));
  lines.push("");

  lines.push("6. BRANDING");
  lines.push(hr);
  lines.push(`Name Suggestions: ${data.branding.name_suggestions.join(", ")}`);
  lines.push(`Taglines: ${data.branding.taglines.join(" | ")}`);
  lines.push(`Positioning: ${data.branding.brand_positioning}`);
  lines.push("");

  lines.push("7. MONETIZATION");
  lines.push(hr);
  lines.push(`Model: ${data.monetization.pricing_model}`);
  lines.push(`Strategy: ${data.monetization.strategy}`);
  data.monetization.pricing_tiers.forEach((t) =>
    lines.push(`${t.name} (${t.price_hint}) — ${t.reasoning}`)
  );
  lines.push("Revenue Streams:");
  data.monetization.revenue_streams.forEach((r) => lines.push(`  • ${r}`));
  lines.push("");

  lines.push("8. GO-TO-MARKET");
  lines.push(hr);
  lines.push("Channels:");
  data.go_to_market.channels.forEach((c) => lines.push(`  • ${c}`));
  lines.push("Launch Plan:");
  data.go_to_market.launch_plan.forEach((s) => lines.push(`  ${s}`));
  lines.push("Growth Strategies:");
  data.go_to_market.growth_strategies.forEach((g) => lines.push(`  • ${g}`));
  lines.push("");

  lines.push("9. IDEA EVOLUTION");
  lines.push(hr);
  lines.push(data.idea_evolution.improved_idea);
  lines.push("Key Changes:");
  data.idea_evolution.key_changes.forEach((k) => lines.push(`  • ${k}`));
  lines.push(`Target Audience: ${data.idea_evolution.refined_audience}`);
  lines.push("");

  lines.push("10. TECH STACK");
  lines.push(hr);
  lines.push(`MVP — Frontend: ${data.tech_stack.mvp.frontend}`);
  lines.push(`MVP — Backend: ${data.tech_stack.mvp.backend}`);
  lines.push(`MVP — Database: ${data.tech_stack.mvp.database}`);
  lines.push(`Scale — Frontend: ${data.tech_stack.scalable.frontend}`);
  lines.push(`Scale — Backend: ${data.tech_stack.scalable.backend}`);
  lines.push(`Cost Level: ${data.tech_stack.cost_level}`);
  lines.push("");

  lines.push("11. SPRINT BACKLOG");
  lines.push(hr);
  const allTasks = [
    ...data.kanban.backlog.map((t) => ({ ...t, col: "Backlog" })),
    ...data.kanban.in_progress.map((t) => ({ ...t, col: "In Progress" })),
    ...data.kanban.completed.map((t) => ({ ...t, col: "Completed" })),
  ];
  allTasks.forEach((t) => {
    lines.push(`[${t.col}] ${t.title} (${t.priority}, ${t.estimated_effort})`);
    lines.push(`  ${t.description}`);
  });
  lines.push("");

  lines.push("FINAL VERDICT");
  lines.push(hr);
  lines.push(`${data.final_verdict.verdict} (${data.final_verdict.score}/100)`);
  lines.push(data.final_verdict.quick_summary);
  lines.push(`\n${hr}`);
  lines.push("Generated by ValiSearch — valisearch.app");

  _download(lines.join("\n"), "ValiSearch-Report.txt", "text/plain;charset=utf-8");
}

/* ── JSON export ─────────────────────────────────────────── */
export function downloadReportJson(data: ValiSearchAnalysis) {
  const json = JSON.stringify(data, null, 2);
  _download(json, "ValiSearch-Report.json", "application/json;charset=utf-8");
}

/* ── Markdown export ─────────────────────────────────────── */
export function downloadReportMarkdown(data: ValiSearchAnalysis) {
  const md: string[] = [];

  md.push(`# ValiSearch Report\n`);
  md.push(`**Score:** ${data.final_verdict.score}/100 · **Verdict:** ${data.final_verdict.verdict}\n`);
  md.push(`> ${data.idea_analysis.one_liner}\n`);

  md.push(`## Summary\n${data.idea_analysis.summary}\n`);

  md.push(`## Market\n- TAM: ${data.market_research.tam_sam_som.tam}\n- SAM: ${data.market_research.tam_sam_som.sam}\n- SOM: ${data.market_research.tam_sam_som.som}\n`);
  md.push(`Growth: ${data.market_research.growth_outlook}\n`);

  md.push(`## Competitors\n${data.competitor_analysis.summary}\n`);
  data.competitor_analysis.competitors.forEach((c) => {
    md.push(`### ${c.name}\n- **Strengths:** ${c.strengths.join(", ")}\n- **Weaknesses:** ${c.weaknesses.join(", ")}\n`);
  });

  md.push(`## Monetization\n${data.monetization.strategy}\n`);
  data.monetization.pricing_tiers.forEach((t) => {
    md.push(`- **${t.name}** (${t.price_hint}) — ${t.reasoning}`);
  });
  md.push("");

  md.push(`## Tech Stack (MVP)\n- Frontend: ${data.tech_stack.mvp.frontend}\n- Backend: ${data.tech_stack.mvp.backend}\n- Database: ${data.tech_stack.mvp.database}\n`);

  md.push(`## Sprint Backlog\n`);
  data.kanban.backlog.forEach((t) => {
    md.push(`- [ ] **${t.title}** (${t.priority}, ${t.estimated_effort}) — ${t.description}`);
  });
  md.push("");

  md.push(`---\n*Generated by [ValiSearch](https://valisearch.app)*`);

  _download(md.join("\n"), "ValiSearch-Report.md", "text/markdown;charset=utf-8");
}

function _download(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
