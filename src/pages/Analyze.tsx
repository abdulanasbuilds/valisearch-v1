import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { Button } from "@/components/ui/button";

const steps = [
  "Analyzing your idea…",
  "Scanning market trends…",
  "Identifying competitors…",
  "Building your strategy…",
];

export default function Analyze() {
  const navigate = useNavigate();
  const { idea, isAnalyzing, analysis, error, runAnalysis } = useAnalysisStore();

  // Start analysis on mount if we have an idea
  useEffect(() => {
    if (idea && !analysis && !isAnalyzing) {
      runAnalysis(idea);
    }
  }, []);

  // Navigate to dashboard when analysis is complete
  useEffect(() => {
    if (analysis && !isAnalyzing) {
      const timer = setTimeout(() => navigate("/dashboard"), 800);
      return () => clearTimeout(timer);
    }
  }, [analysis, isAnalyzing, navigate]);

  // Animated step index
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStep((s) => (s >= steps.length - 1 ? s : s + 1));
    }, 1800);

    const progressInterval = setInterval(() => {
      setProgress((p) => {
        // If analysis is done, jump to 100
        if (analysis) return 100;
        // Otherwise cap at 90 until done
        return p >= 90 ? 90 : p + 1;
      });
    }, 72);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [analysis]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-5 bg-background">
        <div className="max-w-md text-center">
          <div className="h-16 w-16 rounded-full bg-[hsl(var(--destructive))]/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠</span>
          </div>
          <h2 className="text-lg font-semibold mb-2">Analysis Failed</h2>
          <p className="text-[13px] text-muted-foreground mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate("/")}>
              Back to Home
            </Button>
            <Button onClick={() => runAnalysis(idea)}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 bg-background">
      {/* Pulsing indicator */}
      <div className="relative mb-10">
        <div className="h-20 w-20 rounded-full border border-primary/20 flex items-center justify-center">
          <div className="h-10 w-10 rounded-full bg-primary/20 animate-pulse" />
          <div className="absolute inset-0 rounded-full border border-primary/10 animate-ping" style={{ animationDuration: "2s" }} />
        </div>
      </div>

      <p className="text-[16px] font-semibold text-foreground" key={step}>
        {steps[step]}
      </p>
      <p className="mt-2 max-w-xs text-center text-[13px] text-muted-foreground">
        "{idea.slice(0, 80)}{idea.length > 80 ? "…" : ""}"
      </p>

      {/* Progress */}
      <div className="mt-8 w-full max-w-[280px]">
        <div className="h-1 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2.5 flex justify-between text-[11px] text-muted-foreground/50">
          <span>{Math.round(progress)}%</span>
          <span>Step {step + 1} of {steps.length}</span>
        </div>
      </div>

      {/* Step dots */}
      <div className="mt-5 flex gap-1.5">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1 w-6 rounded-full transition-colors duration-300 ${
              i <= step ? "bg-primary" : "bg-secondary"
            }`}
          />
        ))}
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="mt-8 text-[12px] text-muted-foreground/40 hover:text-muted-foreground h-7"
        onClick={() => navigate("/dashboard")}
      >
        Skip to results →
      </Button>
    </div>
  );
}
