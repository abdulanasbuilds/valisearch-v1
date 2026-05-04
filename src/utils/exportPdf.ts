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

/* ── PDF export (print-to-PDF via browser) ───────────────── */
export function downloadReportPdf(data: ValiSearchAnalysis) {
  const pillars = Object.entries(data.scoring.pillars)
    .map(([key, p]) => `
      <tr>
        <td>${key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</td>
        <td><strong>${p.score}/10</strong></td>
        <td>${p.explanation}</td>
      </tr>`)
    .join("");

  const competitors = data.competitor_analysis.competitors
    .map((c) => `
      <div class="card">
        <h4>${c.name}</h4>
        <p><strong>Strengths:</strong> ${c.strengths.join(", ")}</p>
        <p><strong>Weaknesses:</strong> ${c.weaknesses.join(", ")}</p>
      </div>`)
    .join("");

  const pricingTiers = data.monetization.pricing_tiers
    .map((t) => `
      <div class="card">
        <h4>${t.name} <span class="badge">${t.price_hint}</span></h4>
        <p>${t.reasoning}</p>
      </div>`)
    .join("");

  const mvpFeatures = data.product_strategy.mvp_features
    .map((f) => `<li>${f}</li>`).join("");

  const risks = data.validation.risks
    .map((r) => `<li>${r}</li>`).join("");

  const kanbanAll = [
    ...data.kanban.backlog.map((t) => ({ ...t, col: "Backlog" })),
    ...data.kanban.in_progress.map((t) => ({ ...t, col: "In Progress" })),
    ...data.kanban.completed.map((t) => ({ ...t, col: "Completed" })),
  ];

  const kanbanRows = kanbanAll
    .map((t) => `
      <tr>
        <td>${t.title}</td>
        <td><span class="badge badge-${t.priority.toLowerCase()}">${t.priority}</span></td>
        <td>${t.estimated_effort}</td>
        <td>${t.col}</td>
      </tr>`)
    .join("");

  const trends = data.market_research.trends.map((t) => `<li>${t}</li>`).join("");
  const channels = data.go_to_market.channels.map((c) => `<li>${c}</li>`).join("");
  const growthStrategies = data.go_to_market.growth_strategies.map((g) => `<li>${g}</li>`).join("");
  const launchPlan = data.go_to_market.launch_plan.map((s) => `<li>${s}</li>`).join("");
  const revenueStreams = data.monetization.revenue_streams.map((r) => `<li>${r}</li>`).join("");
  const namesSugg = data.branding.name_suggestions.join(", ");
  const taglines = data.branding.taglines.join(" · ");
  const keyChanges = data.idea_evolution.key_changes.map((k) => `<li>${k}</li>`).join("");
  const gapOps = data.competitor_analysis.gap_opportunities.map((g) => `<li>${g}</li>`).join("");

  const verdictColor =
    data.final_verdict.verdict === "Strong"
      ? "#10b981"
      : data.final_verdict.verdict === "Moderate"
        ? "#f59e0b"
        : "#ef4444";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>ValiSearch Report — ${data.branding.name_suggestions[0]}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; color: #1a1a1a; background: #fff; line-height: 1.6; }
  .page { max-width: 900px; margin: 0 auto; padding: 32px 40px; }
  h1 { font-size: 28px; font-weight: 900; color: #0a0a0a; margin-bottom: 4px; }
  h2 { font-size: 16px; font-weight: 800; color: #0a0a0a; margin: 28px 0 10px; padding-bottom: 6px; border-bottom: 2px solid #e5e7eb; text-transform: uppercase; letter-spacing: 0.05em; }
  h3 { font-size: 13px; font-weight: 700; color: #374151; margin: 14px 0 6px; }
  h4 { font-size: 12px; font-weight: 700; margin-bottom: 4px; }
  p  { margin: 4px 0 8px; color: #374151; }
  li { margin: 2px 0; color: #4b5563; }
  ul { padding-left: 18px; margin: 6px 0; }
  .header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 3px solid #0a0a0a; }
  .logo { font-size: 11px; font-weight: 900; background: #0a0a0a; color: #fff; padding: 3px 8px; border-radius: 5px; letter-spacing: 0.05em; }
  .score-circle { text-align: right; }
  .score-big { font-size: 48px; font-weight: 900; color: ${verdictColor}; line-height: 1; }
  .score-label { font-size: 11px; color: #9ca3af; }
  .verdict-pill { display: inline-block; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; background: ${verdictColor}20; color: ${verdictColor}; border: 1px solid ${verdictColor}50; margin-top: 4px; }
  .one-liner { font-size: 15px; font-weight: 700; color: #374151; font-style: italic; margin: 8px 0 4px; }
  .summary-text { color: #6b7280; font-size: 12px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
  .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px 14px; background: #f9fafb; margin: 4px 0; }
  .card h4 { color: #111827; }
  .metric { text-align: center; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; }
  .metric .value { font-size: 20px; font-weight: 900; color: #111827; }
  .metric .label { font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 2px; }
  .badge { display: inline-block; padding: 1px 7px; border-radius: 10px; font-size: 10px; font-weight: 700; background: #e5e7eb; color: #374151; }
  .badge-high { background: #fee2e2; color: #b91c1c; }
  .badge-medium { background: #fef3c7; color: #92400e; }
  .badge-low { background: #d1fae5; color: #065f46; }
  table { width: 100%; border-collapse: collapse; margin: 8px 0; }
  th { background: #f3f4f6; text-align: left; padding: 7px 10px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #6b7280; }
  td { padding: 7px 10px; border-bottom: 1px solid #f3f4f6; color: #374151; vertical-align: top; }
  tr:last-child td { border-bottom: none; }
  .stack-row { display: flex; gap: 10px; margin: 6px 0; flex-wrap: wrap; }
  .stack-tag { background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 6px; padding: 3px 9px; font-size: 10.5px; font-weight: 600; color: #374151; }
  . { margin-top: 32px; padding-top: 12px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 10px; color: #9ca3af; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page { padding: 0; }
    h2 { page-break-before: auto; }
  }
</style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div class="header">
    <div>
      <div class="logo">VS ValiSearch</div>
      <div class="one-liner">${data.idea_analysis.one_liner}</div>
      <div class="summary-text">${data.idea_analysis.summary}</div>
    </div>
    <div class="score-circle">
      <div class="score-big">${data.final_verdict.score}</div>
      <div class="score-label">out of 100</div>
      <div class="verdict-pill">${data.final_verdict.verdict}</div>
    </div>
  </div>

  <!-- Scoring Breakdown -->
  <h2>Scoring Breakdown</h2>
  <table>
    <thead><tr><th>Pillar</th><th>Score</th><th>Analysis</th></tr></thead>
    <tbody>${pillars}</tbody>
  </table>
  <p style="margin-top:8px;font-size:11px;color:#6b7280;">${data.final_verdict.quick_summary}</p>

  <!-- Validation -->
  <h2>Validation</h2>
  <div class="grid-2">
    <div class="card"><h4>Market Demand</h4><p>${data.validation.market_demand}</p></div>
    <div class="card"><h4>Feasibility</h4><p>${data.validation.feasibility}</p></div>
  </div>
  <h3>Risk Factors</h3>
  <ul>${risks}</ul>

  <!-- Market Research -->
  <h2>Market Research</h2>
  <div class="grid-3">
    <div class="metric"><div class="value">${data.market_research.tam_sam_som.tam}</div><div class="label">TAM — Total Addressable</div></div>
    <div class="metric"><div class="value">${data.market_research.tam_sam_som.sam}</div><div class="label">SAM — Serviceable</div></div>
    <div class="metric"><div class="value">${data.market_research.tam_sam_som.som}</div><div class="label">SOM — Obtainable</div></div>
  </div>
  <p style="margin-top:10px;">${data.market_research.growth_outlook}</p>
  <h3>Key Trends</h3>
  <ul>${trends}</ul>

  <!-- Competitors -->
  <h2>Competitor Analysis</h2>
  <p>${data.competitor_analysis.summary}</p>
  ${competitors}
  <h3>Differentiation Strategy</h3>
  <p>${data.competitor_analysis.differentiation_strategy}</p>
  <h3>Gap Opportunities</h3>
  <ul>${gapOps}</ul>

  <!-- Product Strategy -->
  <h2>Product Strategy</h2>
  <div class="grid-2">
    <div>
      <h3>MVP Features</h3>
      <ul>${mvpFeatures}</ul>
    </div>
    <div>
      <h3>Premium Features</h3>
      <ul>${data.product_strategy.premium_features.map((f) => `<li>${f}</li>`).join("")}</ul>
    </div>
  </div>

  <!-- Branding -->
  <h2>Branding</h2>
  <div class="grid-2">
    <div class="card"><h4>Name Suggestions</h4><p>${namesSugg}</p></div>
    <div class="card"><h4>Taglines</h4><p>${taglines}</p></div>
  </div>
  <div class="card" style="margin-top:8px;"><h4>Brand Positioning</h4><p>${data.branding.brand_positioning}</p></div>

  <!-- Revenue & Monetization -->
  <h2>Revenue Intelligence</h2>
  <div class="grid-3">${pricingTiers}</div>
  <h3>Revenue Streams</h3>
  <ul>${revenueStreams}</ul>
  <div class="grid-2" style="margin-top:10px;">
    <div class="card"><h4>Pricing Model</h4><p>${data.monetization.pricing_model}</p></div>
    <div class="card"><h4>Strategy</h4><p>${data.monetization.strategy}</p></div>
  </div>

  <!-- Go-To-Market -->
  <h2>Go-To-Market</h2>
  <div class="grid-2">
    <div><h3>Channels</h3><ul>${channels}</ul></div>
    <div><h3>Growth Strategies</h3><ul>${growthStrategies}</ul></div>
  </div>
  <h3>Launch Plan</h3>
  <ul>${launchPlan}</ul>

  <!-- Idea Evolution -->
  <h2>Idea Evolution</h2>
  <div class="card"><p>${data.idea_evolution.improved_idea}</p></div>
  <h3>Key Changes</h3>
  <ul>${keyChanges}</ul>
  <p><strong>Refined Target Audience:</strong> ${data.idea_evolution.refined_audience}</p>

  <!-- Tech Stack -->
  <h2>Tech Stack</h2>
  <div class="grid-2">
    <div class="card">
      <h4>MVP Stack <span class="badge">${data.tech_stack.cost_level} cost</span></h4>
      <div class="stack-row">
        ${[data.tech_stack.mvp.frontend, data.tech_stack.mvp.backend, data.tech_stack.mvp.database, data.tech_stack.mvp.apis]
      .filter(Boolean).map((t) => `<span class="stack-tag">${t}</span>`).join("")}
      </div>
    </div>
    <div class="card">
      <h4>Scalable Stack</h4>
      <div class="stack-row">
        ${[data.tech_stack.scalable.frontend, data.tech_stack.scalable.backend, data.tech_stack.scalable.database, data.tech_stack.scalable.apis]
      .filter(Boolean).map((t) => `<span class="stack-tag">${t}</span>`).join("")}
      </div>
    </div>
  </div>
  <p style="margin-top:6px;color:#6b7280;font-size:11px;">${data.product_strategy.system_architecture_overview}</p>

  <!-- Sprint Backlog -->
  <h2>Sprint Backlog</h2>
  <table>
    <thead><tr><th>Task</th><th>Priority</th><th>Effort</th><th>Status</th></tr></thead>
    <tbody>${kanbanRows}</tbody>
  </table>

  <!-- Footer -->
  <div class="footer">
    Generated by <strong>ValiSearch</strong> — AI Startup Intelligence Platform · valisearch.app
  </div>
</div>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.onload = () => {
    setTimeout(() => {
      win.print();
    }, 400);
  };
}

import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";

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

export async function downloadReportDocx(data: ValiSearchAnalysis) {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: `ValiSearch Report — ${data.branding.name_suggestions[0]}`,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: `Score: ${data.final_verdict.score}/100 — Verdict: ${data.final_verdict.verdict}`,
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ children: [new TextRun({ text: data.idea_analysis.one_liner, italics: true })] }),
          new Paragraph({ text: data.idea_analysis.summary }),
          
          new Paragraph({ text: "Market Research", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: `TAM: ${data.market_research.tam_sam_som.tam}` }),
          new Paragraph({ text: `SAM: ${data.market_research.tam_sam_som.sam}` }),
          new Paragraph({ text: `SOM: ${data.market_research.tam_sam_som.som}` }),
          new Paragraph({ text: data.market_research.growth_outlook }),

          new Paragraph({ text: "Competitors", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: data.competitor_analysis.summary }),
          ...data.competitor_analysis.competitors.flatMap(c => [
            new Paragraph({ text: c.name, heading: HeadingLevel.HEADING_3 }),
            new Paragraph({ text: `Strengths: ${c.strengths.join(', ')}` }),
            new Paragraph({ text: `Weaknesses: ${c.weaknesses.join(', ')}` })
          ]),

          new Paragraph({ text: "Monetization", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: data.monetization.strategy }),
          ...data.monetization.pricing_tiers.map(t => new Paragraph({ text: `${t.name} (${t.price_hint}) — ${t.reasoning}` })),

          new Paragraph({ text: "Sprint Backlog", heading: HeadingLevel.HEADING_2 }),
          ...data.kanban.backlog.map(t => new Paragraph({ text: `[Backlog] ${t.title} (${t.priority}) — ${t.description}` })),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "ValiSearch-Report.docx");
}
