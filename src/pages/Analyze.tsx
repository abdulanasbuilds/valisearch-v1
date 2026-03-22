import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const steps = [
  "Analyzing your idea…",
  "Scanning market trends…",
  "Identifying competitors…",
  "Building your strategy…",
];

export default function Analyze() {
  const navigate = useNavigate();
  const location = useLocation();
  const idea = (location.state as { idea?: string })?.idea || "Your startup idea";
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStep((s) => (s >= steps.length - 1 ? s : s + 1));
    }, 1800);

    const progressInterval = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : p + 1));
    }, 72);

    const redirect = setTimeout(() => {
      navigate("/dashboard", { state: { idea } });
    }, 7500);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
      clearTimeout(redirect);
    };
  }, [navigate, idea]);

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
        onClick={() => navigate("/dashboard", { state: { idea } })}
      >
        Skip to results →
      </Button>
    </div>
  );
}
