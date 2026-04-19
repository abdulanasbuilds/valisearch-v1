import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { Button } from "@/components/ui/button";

const steps = [
  "Reading your idea...",
  "Analysing market size...",
  "Researching competitors...",
  "Building product strategy...",
  "Calculating revenue models...",
  "Generating branding ideas...",
  "Creating sprint board...",
  "Finalising your report..."
];

export default function Analyze() {
  const navigate = useNavigate();
  const { idea, isAnalyzing, analysis, error, runAnalysis } = useAnalysisStore();
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  // Start analysis on mount if we have an idea
  useEffect(() => {
    if (idea && !analysis && !isAnalyzing && !error) {
      runAnalysis(idea);
    }
  }, [idea, analysis, isAnalyzing, error, runAnalysis]);

  // Navigate to dashboard when analysis is complete
  useEffect(() => {
    if (analysis && !isAnalyzing) {
      setProgress(100);
      const timer = setTimeout(() => navigate("/dashboard"), 800);
      return () => clearTimeout(timer);
    }
  }, [analysis, isAnalyzing, navigate]);

  useEffect(() => {
    if (error) {
      setProgress(100);
      const timer = setTimeout(() => navigate("/dashboard"), 3000);
      return () => clearTimeout(timer);
    }
  }, [error, navigate]);

  useEffect(() => {
    if (analysis || error) return;
    
    const stepInterval = setInterval(() => {
      setStep((s) => (s >= steps.length - 1 ? s : s + 1));
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (analysis) return 100;
        return p >= 90 ? 90 : p + 1;
      });
    }, 150);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [analysis, error]);

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
            <Button variant="outline" onClick={() => navigate("/")}>
              Back to Home
            </Button>
            <Button onClick={() => navigate("/dashboard")}>
              Go to Dashboard
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
