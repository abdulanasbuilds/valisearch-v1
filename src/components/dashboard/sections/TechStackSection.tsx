import { useAnalysisStore } from "@/store/useAnalysisStore";
import { SectionCard } from "../SectionCard";
import type { StackBlock } from "@/types/analysis";

const COST_COLOR: Record<string, string> = {
  low:    "bg-green-500/10 text-green-400 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  high:   "bg-red-500/10 text-red-400 border-red-500/20",
};

function StackCard({
  title,
  badge,
  stack,
}: {
  title: string;
  badge: string;
  stack: StackBlock;
}) {
  const rows: { label: string; value: string }[] = [
    { label: "Frontend",  value: stack.frontend },
    { label: "Backend",   value: stack.backend },
    { label: "Database",  value: stack.database },
    { label: "APIs",      value: stack.apis },
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
              {row.value.split(/[,+·]/).map((t) => t.trim()).filter(Boolean).map((tech) => (
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
        <span className={`text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full border ${COST_COLOR[tech_stack.cost_level]}`}>
          {tech_stack.cost_level}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <StackCard title="MVP Stack" badge="Launch fast" stack={tech_stack.mvp} />
        <StackCard title="Scalable Stack" badge="Scale ready" stack={tech_stack.scalable} />
      </div>

      <SectionCard title="Architecture Notes">
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          {analysis.product_strategy.system_architecture_overview}
        </p>
      </SectionCard>
    </div>
  );
}
