import { useAnalysisStore } from "@/store/useAnalysisStore";
import { SectionCard } from "../SectionCard";
import { TrendingUp, Users, Target, Layers } from "lucide-react";

export function IdeaEvolutionSection() {
  const analysis = useAnalysisStore((s) => s.analysis);
  if (!analysis) return null;

  const { idea_evolution } = analysis;

  return (
    <div className="space-y-4 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Idea Evolution</h2>
        <p className="text-[13px] text-muted-foreground mt-1">
          AI-refined version of your idea with strategic improvements
        </p>
      </div>

      <SectionCard>
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center shrink-0">
            <TrendingUp className="h-4 w-4 text-indigo-400" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-1">Refined Idea</div>
            <p className="text-[14px] leading-relaxed text-white/85 font-medium">{idea_evolution.improved_idea}</p>
          </div>
        </div>

        <div className="ml-11 space-y-1.5">
          {idea_evolution.key_changes.map((change, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-indigo-400/50 shrink-0" />
              <span className="text-[12.5px] text-muted-foreground">{change}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid md:grid-cols-3 gap-4">
        <SectionCard>
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-blue-400" />
            <span className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground/70">Target Audience</span>
          </div>
          <p className="text-[13px] text-muted-foreground leading-relaxed">{idea_evolution.refined_audience}</p>
        </SectionCard>

        <SectionCard>
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-green-400" />
            <span className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground/70">Why It Matters</span>
          </div>
          <p className="text-[13px] text-muted-foreground leading-relaxed">{idea_evolution.why_it_matters}</p>
        </SectionCard>

        <SectionCard>
          <div className="flex items-center gap-2 mb-3">
            <Layers className="h-4 w-4 text-purple-400" />
            <span className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground/70">Positioning Angles</span>
          </div>
          <div className="space-y-2">
            {idea_evolution.positioning_angles.map((angle, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-purple-400/50 shrink-0" />
                <span className="text-[12.5px] text-muted-foreground">{angle}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
