import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnalysisStore } from "@/store/useAnalysisStore";

export function HeroSection() {
  const [idea, setIdea] = useState("");
  const navigate = useNavigate();
  const { setIdea: storeSetIdea, runAnalysis } = useAnalysisStore();

  const handleAnalyze = () => {
    if (idea.trim()) {
      storeSetIdea(idea.trim());
      runAnalysis(idea.trim());
      navigate("/analyze");
    }
  };

  return (
    <section className="relative flex flex-col items-center justify-center pt-40 pb-24 sm:pt-48 sm:pb-32 overflow-hidden min-h-[90vh]">
      {/* Dot Grid Background */}
      <div className="absolute inset-0 dot-grid opacity-40" />

      {/* Animated Glow Beam */}
      <div className="absolute top-0 right-[20%] h-full glow-beam" style={{ animationDelay: "0s" }} />
      <div className="absolute top-0 right-[22%] h-full glow-beam opacity-50" style={{ animationDelay: "1s" }} />

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto max-w-[900px] text-center">
          <h1
            className="text-[clamp(3rem,8vw,5.5rem)] font-black leading-[1.05] tracking-[-0.04em] text-white"
            style={{ textWrap: "balance" }}
          >
            Everything App
            <br />
            for your teams
          </h1>

          <p
            className="mx-auto mt-7 max-w-[580px] text-[17px] leading-[1.7] text-muted-foreground/80"
            style={{ textWrap: "pretty" }}
          >
            Market research, competitor analysis, product strategy, and monetization plan — generated in seconds, not weeks.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-[640px]">
          <div className="glass-card rounded-[24px] p-2">
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your startup idea…"
              className="w-full resize-none rounded-[20px] bg-white/[0.03] px-6 py-4 text-[15px] leading-relaxed placeholder:text-muted-foreground/40 focus:outline-none focus:bg-white/[0.05] transition-colors min-h-[64px] max-h-[140px] border border-white/[0.05]"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAnalyze();
                }
              }}
            />
            <div className="flex items-center justify-between pt-2 px-2">
              <span className="text-[12px] text-muted-foreground/35 pl-3">Press Enter to submit</span>
              <Button
                onClick={handleAnalyze}
                disabled={!idea.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] h-11 px-7 rounded-[16px] text-[14px] font-semibold transition-all disabled:opacity-30 disabled:scale-100 shadow-lg shadow-primary/20"
              >
                Validate Idea
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="mt-4 text-center text-[13px] text-muted-foreground/35">
            No signup required · Results in under 30 seconds
          </p>
        </div>

        {/* Floating Mockup Preview */}
        <div className="mx-auto mt-20 max-w-[900px]">
          <div className="glass-card rounded-[32px] p-4 hover:scale-[1.01] transition-transform duration-500">
            <div className="rounded-[24px] bg-gradient-to-br from-primary/10 via-purple-500/5 to-primary/10 p-8 aspect-video flex items-center justify-center border border-white/[0.05]">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-[16px] bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-lg bg-primary/40 border border-primary/50" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-48 mx-auto rounded-full bg-white/[0.05]" />
                  <div className="h-3 w-36 mx-auto rounded-full bg-white/[0.05]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-20 flex flex-wrap items-center justify-center gap-x-14 gap-y-6">
          {[
            { value: "12,847", label: "ideas validated" },
            { value: "4.8/5", label: "founder rating" },
            { value: "< 30s", label: "avg. analysis time" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold tracking-tight text-white">{stat.value}</div>
              <div className="text-[12px] text-muted-foreground/45 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
