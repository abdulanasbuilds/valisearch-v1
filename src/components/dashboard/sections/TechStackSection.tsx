import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { SectionCard } from "../SectionCard";
import type { StackBlock } from "@/types/analysis";

// Initialize mermaid with dark theme
mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  themeVariables: {
    primaryColor: "#1e1b4b",
    primaryTextColor: "#c7d2fe",
    primaryBorderColor: "#4338ca",
    lineColor: "#6366f1",
    secondaryColor: "#0f172a",
    tertiaryColor: "#111",
    fontFamily: "Inter, sans-serif",
    fontSize: "13px",
  },
});

const COST_COLOR: Record<string, string> = {
  low: "bg-green-500/10 text-green-400 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  high: "bg-red-500/10 text-red-400 border-red-500/20",
};

function StackCard({ title, badge, stack }: { title: string; badge: string; stack: StackBlock }) {
  const rows = [
    { label: "Frontend", value: stack.frontend },
    { label: "Backend", value: stack.backend },
    { label: "Database", value: stack.database },
    { label: "APIs", value: stack.apis },
  ];

  return (
    <SectionCard>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[14px] font-semibold">{title}</h3>
        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.06] text-white/40 border border-white/[0.08]">
          {badge}
        </span>
      </div>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              {row.label}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {row.value
                .split(/[,+·]/)
                .map((t) => t.trim())
                .filter(Boolean)
                .map((tech) => (
                  <span
                    key={tech}
                    className="text-[12px] px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.07] text-white/70"
                  >
                    {tech}
                  </span>
                ))}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

/* ── Mermaid Architecture Diagram ── */
function ArchitectureDiagram({ stack }: { stack: { mvp: StackBlock; scalable: StackBlock } }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  const cleanLabel = (s: string) => s.split(/[,+·]/)[0].trim().replace(/[^a-zA-Z0-9 .]/g, "");

  const diagram = `graph TD
    subgraph Frontend
      F1["${cleanLabel(stack.mvp.frontend)}"]
      F2["${cleanLabel(stack.scalable.frontend)}"]
    end
    subgraph Backend
      B1["${cleanLabel(stack.mvp.backend)}"]
      B2["${cleanLabel(stack.scalable.backend)}"]
    end
    subgraph Database
      D1["${cleanLabel(stack.mvp.database)}"]
      D2["${cleanLabel(stack.scalable.database)}"]
    end
    subgraph APIs
      A1["${cleanLabel(stack.mvp.apis)}"]
    end
    F1 --> B1
    F2 --> B2
    B1 --> D1
    B2 --> D2
    B1 --> A1
    B2 --> A1`;

  useEffect(() => {
    if (!containerRef.current) return;
    const id = `mermaid-${Date.now()}`;
    containerRef.current.innerHTML = "";
    mermaid
      .render(id, diagram)
      .then(({ svg }) => {
        if (containerRef.current) containerRef.current.innerHTML = svg;
      })
      .catch(() => setError(true));
  }, [diagram]);

  if (error) {
    return (
      <SectionCard title="System Architecture">
        <p className="text-[13px] text-muted-foreground">Architecture diagram could not be rendered.</p>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="System Architecture">
      <p className="text-[12px] text-muted-foreground/60 mb-4">
        Auto-generated from AI-recommended tech stack
      </p>
      <div
        ref={containerRef}
        className="w-full overflow-x-auto rounded-lg bg-[rgba(255,255,255,0.02)] border border-white/[0.06] p-4 [&_svg]:mx-auto [&_svg]:max-w-full"
      />
    </SectionCard>
  );
}

export function TechStackSection() {
  const analysis = useAnalysisStore((s) => s.analysis);
  if (!analysis) return null;

  const { tech_stack } = analysis;

  return (
    <div className="space-y-4 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Tech Stack</h2>
        <p className="text-[13px] text-muted-foreground mt-1">
          AI-recommended technology for MVP and scale
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[13px] text-muted-foreground">Cost estimate:</span>
        <span
          className={`text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full border ${COST_COLOR[tech_stack.cost_level]}`}
        >
          {tech_stack.cost_level}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <StackCard title="MVP Stack" badge="Launch fast" stack={tech_stack.mvp} />
        <StackCard title="Scalable Stack" badge="Scale ready" stack={tech_stack.scalable} />
      </div>

      {/* Mermaid architecture diagram */}
      <ArchitectureDiagram stack={tech_stack} />

      <SectionCard title="Architecture Notes">
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          {analysis.product_strategy.system_architecture_overview}
        </p>
      </SectionCard>
    </div>
  );
}
