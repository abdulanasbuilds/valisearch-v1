import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const FRAMEWORKS = [
  { id: "market_breakdown", name: "Market Intelligence", desc: "analyzing market..." },
  { id: "problem_prioritization", name: "Problem Landscape", desc: "identifying pain points..." },
  { id: "offer_creation", name: "Offer Architecture", desc: "building your offer..." },
  { id: "distribution_plan", name: "Growth Playbook", desc: "mapping distribution..." },
  { id: "viral_content", name: "Content Engine", desc: "generating viral hooks..." },
  { id: "competitor_weakness", name: "Competitive Intelligence", desc: "mapping competitors..." },
  { id: "scale_system", name: "Scale Roadmap", desc: "projecting path to $10K MRR..." },
];

export default function Analyze() {
  const navigate = useNavigate();
  const { idea, isAnalyzing, analysis, error, runAnalysis } = useAnalysisStore();
  const [completedFrameworks, setCompletedFrameworks] = useState<Set<string>>(new Set());
  const [allDone, setAllDone] = useState(false);

  // Start analysis on mount
  useEffect(() => {
    if (idea && !analysis && !isAnalyzing && !error) {
      runAnalysis(idea);
    }
  }, [idea, analysis, isAnalyzing, error, runAnalysis]);

  // Simulate progressive framework completion
  const simulateProgress = useCallback(() => {
    const shuffled = [...FRAMEWORKS].sort(() => Math.random() - 0.5);
    const timers: ReturnType<typeof setTimeout>[] = [];

    shuffled.forEach((fw, i) => {
      const delay = 2000 + Math.random() * 12000 + i * 800;
      const timer = setTimeout(() => {
        setCompletedFrameworks((prev) => {
          const next = new Set(prev);
          next.add(fw.id);
          return next;
        });
      }, delay);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (analysis || error) return;
    return simulateProgress();
  }, [analysis, error, simulateProgress]);

  // When actual backend returns, fast-forward all
  useEffect(() => {
    if (analysis && !isAnalyzing) {
      setCompletedFrameworks(new Set(FRAMEWORKS.map((f) => f.id)));
      setTimeout(() => setAllDone(true), 600);
    }
  }, [analysis, isAnalyzing]);

  // Navigate after done
  const { lastAnalysisId } = useAnalysisStore();
  useEffect(() => {
    if (allDone) {
      const timer = setTimeout(() => {
        if (lastAnalysisId) {
          navigate(`/workspace/${lastAnalysisId}`);
        } else {
          navigate("/workspace");
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [allDone, navigate, lastAnalysisId]);

  // Error handling
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => navigate("/workspace"), 3000);
      return () => clearTimeout(timer);
    }
  }, [error, navigate]);

  const progress = Math.round((completedFrameworks.size / FRAMEWORKS.length) * 100);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-5 bg-background">
        <div className="max-w-md text-center">
          <div className="h-16 w-16 rounded-full bg-[hsl(var(--destructive))]/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠</span>
          </div>
          <h2 className="text-lg font-semibold mb-2">Analysis Failed</h2>
          <p className="text-[13px] text-muted-foreground mb-6">AI analysis failed. Showing sample report.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate("/")}>Back to Home</Button>
            <Button onClick={() => navigate("/workspace")}>Go to Workspace</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 bg-background">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="relative mb-6 inline-block">
          <div className="h-16 w-16 rounded-full border border-primary/20 flex items-center justify-center mx-auto">
            <div className="h-8 w-8 rounded-full bg-primary/20 animate-pulse" />
            {!allDone && <div className="absolute inset-0 rounded-full border border-primary/10 animate-ping" style={{ animationDuration: "2s" }} />}
          </div>
        </div>
        <h2 className="text-lg font-bold text-foreground">
          {allDone ? "Analysis Complete ✓" : "Running Intelligence Engine"}
        </h2>
        <p className="mt-1.5 max-w-xs mx-auto text-[13px] text-muted-foreground">
          "{idea.slice(0, 80)}{idea.length > 80 ? "…" : ""}"
        </p>
      </div>

      {/* Framework Cards */}
      <div className="w-full max-w-md space-y-2 mb-6">
        {FRAMEWORKS.map((fw) => {
          const done = completedFrameworks.has(fw.id);
          return (
            <div
              key={fw.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-500 ${
                done
                  ? "bg-green-500/[0.04] border-green-500/15"
                  : "bg-white/[0.02] border-white/[0.06]"
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                done ? "bg-green-500/20" : "bg-white/[0.04]"
              }`}>
                {done ? (
                  <Check className="w-3.5 h-3.5 text-green-400" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-primary/50 animate-pulse" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] font-medium transition-colors ${done ? "text-foreground" : "text-muted-foreground"}`}>
                  {fw.name}
                </p>
                <p className="text-[10px] text-muted-foreground/50">
                  {done ? "Complete" : fw.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md">
        <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-muted-foreground/50">
          <span>{progress}%</span>
          <span>{completedFrameworks.size} / {FRAMEWORKS.length} frameworks</span>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="mt-6 text-[12px] text-muted-foreground/40 hover:text-muted-foreground h-7"
        onClick={() => navigate("/workspace")}
      >
        Skip to results →
      </Button>
    </div>
  );
}
