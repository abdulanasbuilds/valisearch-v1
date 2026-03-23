import { useAnalysisStore } from "@/store/useAnalysisStore";
import { SectionCard } from "../SectionCard";

function FlowArrow() {
  return (
    <div className="flex flex-col items-center gap-0 shrink-0">
      <div className="w-px h-4 bg-white/[0.12]" />
      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="text-white/20">
        <path d="M6 8L0 0h12L6 8z" fill="currentColor" />
      </svg>
    </div>
  );
}

function FlowNode({
  label,
  sub,
  accent,
}: {
  label: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-xl border px-5 py-3 text-center transition-colors ${
      accent
        ? "border-indigo-500/40 bg-indigo-500/10"
        : "border-white/[0.09] bg-white/[0.03] hover:bg-white/[0.06]"
    }`}>
      <div className={`text-[13px] font-semibold ${accent ? "text-indigo-300" : "text-white/75"}`}>
        {label}
      </div>
      {sub && <div className="text-[11px] text-white/30 mt-0.5">{sub}</div>}
    </div>
  );
}

export function UserFlowSection() {
  const analysis = useAnalysisStore((s) => s.analysis);
  if (!analysis) return null;

  const { user_flow, product_strategy } = analysis;

  return (
    <div className="space-y-4 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold tracking-tight">User Flow</h2>
        <p className="text-[13px] text-muted-foreground mt-1">
          Visual user journey through your product
        </p>
      </div>

      {/* Journey steps — vertical flow */}
      <SectionCard title="User Journey">
        <div className="flex flex-col items-center gap-0 max-w-sm mx-auto">
          {user_flow.journey_steps.map((step, i) => (
            <div key={i} className="w-full flex flex-col items-center">
              <FlowNode label={step} accent={i === 0} />
              {i < user_flow.journey_steps.length - 1 && <FlowArrow />}
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Page structure */}
      <div className="grid md:grid-cols-3 gap-4">
        <SectionCard title="Landing Page">
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            {user_flow.page_structure.landing}
          </p>
        </SectionCard>
        <SectionCard title="Dashboard">
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            {user_flow.page_structure.dashboard}
          </p>
        </SectionCard>
        <SectionCard title="Core Flows">
          <div className="space-y-2">
            {user_flow.page_structure.core_flows.map((flow, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/60 shrink-0" />
                <span className="text-[13px] text-muted-foreground">{flow}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* User flow steps from product strategy */}
      <SectionCard title="Step-by-Step Flow">
        <div className="space-y-3">
          {product_strategy.user_flow_steps.map((step, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full border border-white/[0.08] bg-white/[0.04] text-[11px] font-bold text-white/40">
                {i + 1}
              </div>
              <div className="pt-1 text-[13px] text-muted-foreground leading-relaxed">{step}</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
