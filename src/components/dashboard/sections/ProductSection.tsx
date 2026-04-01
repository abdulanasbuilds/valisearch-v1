import { useAnalysisStore } from "@/store/useAnalysisStore";
import { SectionCard } from "../SectionCard";
import { Check, Diamond, Lock, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function ProductSection() {
  const analysis = useAnalysisStore((s) => s.analysis);
  const navigate = useNavigate();
  if (!analysis) return null;

  const { product_strategy } = analysis;

  const generateSprints = () => {
    // Navigate to Kanban — the KanbanSection already auto-populates from analysis.kanban
    toast.success("Sprint tasks generated from MVP features!");
    navigate("/dashboard/kanban");
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Product Strategy</h2>
          <p className="text-[13px] text-muted-foreground mt-1">Feature prioritization and product roadmap</p>
        </div>
        <Button size="sm" variant="outline" className="gap-2 h-8 text-[12px]" onClick={generateSprints}>
          <GitBranch className="h-3.5 w-3.5" /> Generate Sprints
        </Button>
      </div>

      <SectionCard title="MVP Features" description="Must-have features for initial launch">
        <ul className="space-y-2">
          {product_strategy.mvp_features.map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-[13px]">
              <Check className="h-3.5 w-3.5 text-[hsl(var(--success))] shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Differentiators" description="Features that set you apart">
        <ul className="space-y-2">
          {product_strategy.differentiation_features.map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-[13px]">
              <Diamond className="h-3.5 w-3.5 text-primary shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </SectionCard>

      <div className="relative">
        <SectionCard title="Premium Features" description="Advanced capabilities for power users" className="opacity-50 blur-[1px]">
          <ul className="space-y-2">
            {product_strategy.premium_features.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-[13px]">
                <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </SectionCard>
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/60 backdrop-blur-sm">
          <div className="text-center">
            <Lock className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
            <p className="text-[13px] font-medium">Upgrade to unlock premium insights</p>
            <button className="mt-2 text-[12px] text-primary hover:underline">Learn more →</button>
          </div>
        </div>
      </div>

      <SectionCard title="System Architecture">
        <p className="text-[13px] leading-relaxed text-muted-foreground">{product_strategy.system_architecture_overview}</p>
      </SectionCard>
    </div>
  );
}
