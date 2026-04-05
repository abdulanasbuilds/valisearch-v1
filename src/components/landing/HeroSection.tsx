import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CornerDownLeft, Sparkles } from "lucide-react";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { sanitizeIdea } from "@/lib/sanitize";

const REPORT = {
  idea: "AI-powered onboarding tool for B2B SaaS",
  score: 84,
  rows: [
    { label: "Market Opportunity", value: "Large · $4.2B TAM", tag: "green" },
    { label: "Competition", value: "Moderate · 6 direct", tag: "neutral" },
    { label: "Revenue Potential", value: "$1.2M ARR yr 2", tag: "green" },
    { label: "Technical Risk", value: "Low · Proven stack", tag: "green" },
    { label: "Time to Market", value: "Est. 4–6 months", tag: "neutral" },
  ],
  nav: ["Overview", "Market", "Competitors", "Monetization", "Product", "Branding", "Validation", "GTM"],
};

export function HeroSection() {
  const [idea, setIdea] = useState("");
  const [focused, setFocused] = useState(false);
  const [scoreVisible, setScoreVisible] = useState(false);
  const navigate = useNavigate();
  const { setIdea: storeSetIdea, runAnalysis } = useAnalysisStore();
  const scoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      document.querySelectorAll<HTMLElement>(".text-reveal").forEach((el) =>
        el.classList.add("visible")
      );
    }, 60);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".hero-reveal");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) (e.target as HTMLElement).classList.add("visible");
        }),
      { threshold: 0.08 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!scoreRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setScoreVisible(true);
      },
      { threshold: 0.5 }
    );
    observer.observe(scoreRef.current);
    return () => observer.disconnect();
  }, []);

  const MAX_IDEA_LEN = 500;

  const handleSubmit = () => {
    const val = sanitizeIdea(idea);
    if (!val) return;
    storeSetIdea(val);
    runAnalysis(val);
    navigate("/analyze");
  };

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% -5%, hsl(248 84% 67% / 0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col max-w-6xl mx-auto w-full px-5 md:px-8">
        <div className="pt-36 md:pt-44 pb-20">
          {/* Announcement pill */}
          <div className="text-reveal-wrap mb-8">
            <div className="text-reveal text-reveal-delay-1 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-3.5 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-[11.5px] font-medium text-primary/80">
                Now with multi-model AI analysis
              </span>
            </div>
          </div>

          {/* Kicker */}
          <div className="flex items-center gap-3 mb-8 overflow-hidden">
            <div className="text-reveal text-reveal-delay-1 flex items-center gap-2.5">
              <div className="h-px w-7 bg-white/20" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/30">
                Startup Validation · AI-Powered
              </span>
            </div>
          </div>

          {/* H1 */}
          <h1 className="text-[clamp(2.8rem,7vw,5.8rem)] font-black text-white leading-[1.02] tracking-[-0.04em] mb-8">
            <span className="text-reveal-wrap">
              <span className="text-reveal text-reveal-delay-1">Know if your idea</span>
            </span>
            <span className="text-reveal-wrap">
              <span className="text-reveal text-reveal-delay-2">is worth building—</span>
            </span>
            <span className="text-reveal-wrap">
              <span className="text-reveal text-reveal-delay-3 font-serif-display font-normal text-white/50">
                before you build it.
              </span>
            </span>
          </h1>

          {/* Sub */}
          <div className="text-reveal-wrap mb-10 max-w-[480px]">
            <p className="text-reveal text-reveal-delay-3 text-[16px] leading-[1.85] text-white/38">
              Paste your idea. Get a full market report in 30 seconds — competitor
              analysis, market size, monetization strategy, and more.
            </p>
          </div>

          {/* Input */}
          <div className="text-reveal-wrap">
            <div className="text-reveal text-reveal-delay-4 w-full max-w-[580px]">
              <div
                className={`relative rounded-xl border transition-all duration-300 ${
                  focused
                    ? "border-white/25 bg-white/[0.045] shadow-[0_0_0_3px_rgba(255,255,255,0.04)]"
                    : "border-white/[0.09] bg-white/[0.025] hover:border-white/15"
                }`}
              >
                <textarea
                  id="idea-input"
                  data-testid="input-idea"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value.slice(0, MAX_IDEA_LEN))}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="Describe your startup idea…"
                  className="w-full resize-none bg-transparent px-5 py-4 pr-14 text-[15px] leading-relaxed text-white/90 placeholder:text-white/18 focus:outline-none min-h-[70px] max-h-[140px]"
                  rows={2}
                  maxLength={MAX_IDEA_LEN}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                />
                <button
                  data-testid="button-validate"
                  onClick={handleSubmit}
                  disabled={!idea.trim()}
                  className="absolute bottom-3 right-3 flex items-center justify-center w-9 h-9 rounded-lg bg-white text-black disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/90 transition-all duration-150 active:scale-[0.94]"
                >
                  <CornerDownLeft className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center justify-between mt-2.5 px-0.5">
                <span className="text-[11.5px] text-white/20">
                  Press{" "}
                  <kbd className="font-mono bg-white/[0.07] border border-white/[0.08] px-1.5 py-0.5 rounded text-[10px]">
                    ↵
                  </kbd>{" "}
                  to validate
                  {idea.length >= MAX_IDEA_LEN * 0.85 && (
                    <span
                      className={`ml-2 ${
                        idea.length >= MAX_IDEA_LEN ? "text-destructive/70" : "text-white/30"
                      }`}
                    >
                      {idea.length}/{MAX_IDEA_LEN}
                    </span>
                  )}
                </span>
                <button
                  data-testid="button-get-started-hero"
                  onClick={handleSubmit}
                  disabled={!idea.trim()}
                  className="group flex items-center gap-1.5 text-[12px] font-medium text-white/28 hover:text-white/55 disabled:opacity-0 transition-all duration-200"
                >
                  Analyze idea
                  <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="hero-reveal reveal mt-14 flex flex-wrap items-center gap-x-10 gap-y-4">
            {[
              { n: "10,000+", label: "ideas validated" },
              { n: "~30s", label: "to results" },
              { n: "18", label: "intelligence sections" },
              { n: "4.9★", label: "avg. rating" },
            ].map(({ n, label }, i) => (
              <div
                key={label}
                className="stat-animate flex items-baseline gap-2"
                style={{ animationDelay: `${0.45 + i * 0.08}s` }}
              >
                <span className="text-[19px] font-bold text-white/80 tracking-tight tabular-nums">
                  {n}
                </span>
                <span className="text-[12px] text-white/25">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Product preview */}
        <div className="hero-reveal reveal reveal-delay-5 w-full pb-24">
          <div className="preview-border relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0d0d0d] shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 h-10 px-5 border-b border-white/[0.06] bg-white/[0.01]">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2.5 h-2.5 rounded-full bg-white/10" />
                ))}
              </div>
              <div className="flex-1 mx-3 flex justify-center">
                <div className="h-[22px] w-[240px] rounded-md bg-white/[0.05] flex items-center px-3 gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400/60" />
                  <span className="text-[10.5px] text-white/20 font-mono">
                    app.valisearch.io/report
                  </span>
                </div>
              </div>
            </div>

            {/* App layout */}
            <div className="grid sm:grid-cols-[192px_1fr] h-[420px] md:h-[500px]">
              {/* Sidebar */}
              <div className="hidden sm:flex flex-col border-r border-white/[0.05] p-4">
                <div className="mb-4 px-1">
                  <span className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-white/18">
                    Report sections
                  </span>
                </div>
                <nav className="flex flex-col gap-0.5">
                  {REPORT.nav.map((item, i) => (
                    <div
                      key={item}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-default select-none transition-colors ${
                        i === 0
                          ? "bg-white/[0.07] text-white/85"
                          : "text-white/28 hover:text-white/45 hover:bg-white/[0.03]"
                      }`}
                    >
                      <div
                        className={`w-[5px] h-[5px] rounded-full shrink-0 ${
                          i === 0 ? "bg-primary" : "bg-white/15"
                        }`}
                      />
                      <span className="text-[12px] font-medium">{item}</span>
                    </div>
                  ))}
                </nav>

                <div ref={scoreRef} className="mt-auto pt-4 border-t border-white/[0.05]">
                  <div className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-white/20 mb-1.5">
                    Validation Score
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-[34px] font-black text-white/90 leading-none">
                      {REPORT.score}
                    </span>
                    <span className="text-[13px] text-white/25 font-medium">/100</span>
                  </div>
                  <div className="h-[3px] w-full rounded-full bg-white/[0.07] overflow-hidden">
                    <div
                      className="score-bar h-full rounded-full bg-white/70"
                      style={{ width: scoreVisible ? `${REPORT.score}%` : "0%" }}
                    />
                  </div>
                  <div className="mt-1.5 text-[10px] text-white/20">
                    Strong · Recommended to build
                  </div>
                </div>
              </div>

              {/* Main */}
              <div className="p-6 md:p-8 flex flex-col gap-5 overflow-hidden">
                <div>
                  <div className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-white/20 mb-1.5">
                    Idea
                  </div>
                  <p className="text-[15px] font-semibold text-white/82 leading-snug">
                    {REPORT.idea}
                  </p>
                </div>

                <div className="flex-1">
                  <div className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-white/20 mb-3">
                    Key Findings
                  </div>
                  <div className="divide-y divide-white/[0.045]">
                    {REPORT.rows.map((row) => (
                      <div key={row.label} className="flex items-center justify-between py-2.5">
                        <span className="text-[13px] text-white/38">{row.label}</span>
                        <span
                          className={`text-[13px] font-medium ${
                            row.tag === "green" ? "text-white/78" : "text-white/50"
                          }`}
                        >
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4 mt-auto">
                  <div className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-white/20 mb-2">
                    AI Summary
                  </div>
                  <p className="text-[12.5px] leading-[1.75] text-white/32">
                    Strong opportunity in a growing segment with measurable demand signals. Existing
                    solutions lack modern UX and AI-native features, creating a clear wedge. Target
                    mid-market SaaS teams (50–500 seats) at $49/mo.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-3 text-center text-[11.5px] text-white/18">
            Sample output · Your results will vary based on your idea
          </p>
        </div>
      </div>
    </section>
  );
}
