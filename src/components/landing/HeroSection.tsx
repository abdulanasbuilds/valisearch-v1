import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const [idea, setIdea] = useState("");
  const navigate = useNavigate();

  const handleAnalyze = () => {
    if (idea.trim()) {
      navigate("/analyze", { state: { idea: idea.trim() } });
    }
  };

  return (
    <section className="relative flex flex-col items-center justify-center pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
      {/* Subtle radial glow — just one, understated */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-primary/[0.06] blur-[140px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-5">
        <div className="mx-auto max-w-[680px] text-center">
          <h1
            className="text-[clamp(2rem,5.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.035em] text-foreground"
            style={{ textWrap: "balance" }}
          >
            Validate your startup idea before writing a single line of code
          </h1>

          <p
            className="mx-auto mt-5 max-w-[480px] text-[15px] leading-[1.65] text-muted-foreground"
            style={{ textWrap: "pretty" }}
          >
            Market research, competitor analysis, product strategy, and monetization plan — generated in seconds, not weeks.
          </p>
        </div>

        {/* Input area */}
        <div className="mx-auto mt-10 max-w-[560px]">
          <div className="rounded-xl border border-border/60 bg-card p-1.5">
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your startup idea…"
              className="w-full resize-none rounded-lg bg-transparent px-4 py-3 text-[14px] leading-relaxed placeholder:text-muted-foreground/50 focus:outline-none min-h-[48px] max-h-[120px]"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAnalyze();
                }
              }}
            />
            <div className="flex items-center justify-between pt-1 px-1">
              <span className="text-[11px] text-muted-foreground/40 pl-2">Press Enter to submit</span>
              <Button
                onClick={handleAnalyze}
                disabled={!idea.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-5 rounded-lg text-[13px] font-medium active:scale-[0.97] transition-transform disabled:opacity-30"
              >
                Validate Idea
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <p className="mt-3 text-center text-[12px] text-muted-foreground/40">
            No signup required · Results in under 30 seconds
          </p>
        </div>

        {/* Stats row — social proof embedded in hero */}
        <div className="mx-auto mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {[
            { value: "12,847", label: "ideas validated" },
            { value: "4.8/5", label: "founder rating" },
            { value: "< 30s", label: "avg. analysis time" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-lg font-semibold tracking-tight text-foreground">{stat.value}</div>
              <div className="text-[11px] text-muted-foreground/50 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
