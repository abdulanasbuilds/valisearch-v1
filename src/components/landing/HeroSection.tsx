import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CornerDownLeft } from "lucide-react";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { sanitizeIdea } from "@/lib/sanitize";

const REPORT = {
  idea: "AI-powered onboarding tool for B2B SaaS",
  score: 84,
  rows: [
    { label: "Market Opportunity", value: "Large · $4.2B TAM", positive: true },
    { label: "Competition", value: "Moderate · 6 direct", positive: false },
    { label: "Revenue Potential", value: "$1.2M ARR yr 2", positive: true },
    { label: "Technical Risk", value: "Low · Proven stack", positive: true },
    { label: "Time to Market", value: "Est. 4–6 months", positive: false },
  ],
  nav: ["Overview", "Market", "Competitors", "Monetization", "Product", "Branding", "Validation", "GTM"],
};

export function HeroSection() {
  const [idea, setIdea] = useState("");
  const [focused, setFocused] = useState(false);
  const [scoreVisible, setScoreVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();
  const { setIdea: storeSetIdea, runAnalysis } = useAnalysisStore();
  const scoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!scoreRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setScoreVisible(true); },
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
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 50% at 50% -10%, hsl(248 84% 67% / 0.06) 0%, transparent 60%)",
          }}
        />
        <div className="absolute inset-0 grid-bg opacity-40" />
      </div>

      <div className="relative z-10 flex flex-col max-w-[1120px] mx-auto w-full px-5 md:px-6">
        <div className="pt-32 md:pt-40 lg:pt-48 pb-16 md:pb-24">

          {/* Kicker */}
          <div
            className={`mb-6 transition-all duration-700 delay-100 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
          >
            <div className="inline-flex items-center gap-2">
              <div className="h-px w-5 bg-white/15" />
              <span className="text-[10.5px] font-medium uppercase tracking-[0.18em] text-white/25">
                Startup validation · AI-powered
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="mb-7 max-w-[720px]">
            <span
              className={`block text-[clamp(2.5rem,6.5vw,5.2rem)] font-black text-white leading-[1.04] tracking-[-0.045em] transition-all duration-700 delay-150 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              Know if your idea
            </span>
            <span
              className={`block text-[clamp(2.5rem,6.5vw,5.2rem)] font-black text-white leading-[1.04] tracking-[-0.045em] transition-all duration-700 delay-200 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              is worth building—
            </span>
            <span
              className={`block text-[clamp(2.5rem,6.5vw,5.2rem)] font-serif-display font-normal text-white/40 leading-[1.1] tracking-[-0.03em] transition-all duration-700 delay-[250ms] ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              before you build it.
            </span>
          </h1>

          {/* Subtext */}
          <p
            className={`text-[15px] leading-[1.8] text-white/30 max-w-[440px] mb-9 transition-all duration-700 delay-300 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
          >
            Paste your idea. Get a full market report in 30 seconds —
            competitor analysis, market size, monetization strategy, and more.
          </p>

          {/* Input */}
          <div
            className={`w-full max-w-[560px] transition-all duration-700 delay-[350ms] ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
          >
            <div
              className={`relative rounded-xl border transition-all duration-300 ${
                focused
                  ? "border-white/20 bg-white/[0.04] shadow-[0_0_0_3px_rgba(255,255,255,0.03)]"
                  : "border-white/[0.08] bg-white/[0.02] hover:border-white/12"
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
                className="w-full resize-none bg-transparent px-5 py-4 pr-14 text-[14.5px] leading-relaxed text-white/85 placeholder:text-white/15 focus:outline-none min-h-[64px] max-h-[130px]"
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
                className="absolute bottom-3 right-3 flex items-center justify-center w-8 h-8 rounded-lg bg-white text-black disabled:opacity-15 disabled:cursor-not-allowed hover:bg-white/90 transition-all duration-150 active:scale-[0.94]"
              >
                <CornerDownLeft className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between mt-2 px-0.5">
              <span className="text-[11px] text-white/15">
                Press{" "}
                <kbd className="font-mono bg-white/[0.05] border border-white/[0.06] px-1.5 py-0.5 rounded text-[10px]">
                  ↵
                </kbd>{" "}
                to validate
                {idea.length >= MAX_IDEA_LEN * 0.85 && (
                  <span className={`ml-2 ${idea.length >= MAX_IDEA_LEN ? "text-destructive/60" : "text-white/25"}`}>
                    {idea.length}/{MAX_IDEA_LEN}
                  </span>
                )}
              </span>
              <button
                data-testid="button-get-started-hero"
                onClick={handleSubmit}
                disabled={!idea.trim()}
                className="group flex items-center gap-1 text-[11.5px] font-medium text-white/20 hover:text-white/50 disabled:opacity-0 transition-all duration-200"
              >
                Analyze
                <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          {/* Stats strip */}
          <div
            className={`mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 transition-all duration-700 delay-[450ms] ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
          >
            {[
              { n: "10,000+", label: "ideas validated" },
              { n: "~30s", label: "to full report" },
              { n: "18", label: "intelligence sections" },
            ].map(({ n, label }) => (
              <div key={label} className="flex items-baseline gap-1.5">
                <span className="text-[16px] font-bold text-white/65 tracking-tight tabular-nums">{n}</span>
                <span className="text-[11px] text-white/20">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Product preview */}
        <div
          className={`w-full pb-20 transition-all duration-1000 delay-500 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="preview-border relative rounded-2xl overflow-hidden border border-white/[0.06] bg-[#0c0c0c] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)]">
            {/* Chrome */}
            <div className="flex items-center gap-2 h-9 px-4 border-b border-white/[0.04] bg-white/[0.008]">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-white/[0.07]" />
                ))}
              </div>
              <div className="flex-1 mx-8 flex justify-center">
                <div className="h-5 w-52 rounded-md bg-white/[0.035] flex items-center px-2.5 gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/50" />
                  <span className="text-[10px] text-white/15 font-mono">app.valisearch.io/report</span>
                </div>
              </div>
            </div>

            {/* App */}
            <div className="grid sm:grid-cols-[180px_1fr] h-[380px] md:h-[460px]">
              {/* Sidebar */}
              <div className="hidden sm:flex flex-col border-r border-white/[0.04] p-3.5">
                <div className="mb-3.5 px-1">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/15">
                    Report
                  </span>
                </div>
                <nav className="flex flex-col gap-px">
                  {REPORT.nav.map((item, i) => (
                    <div
                      key={item}
                      className={`flex items-center gap-2 px-2.5 py-[7px] rounded-md cursor-default select-none transition-colors text-[11.5px] font-medium ${
                        i === 0
                          ? "bg-white/[0.05] text-white/75"
                          : "text-white/22 hover:text-white/38 hover:bg-white/[0.02]"
                      }`}
                    >
                      <div className={`w-1 h-1 rounded-full shrink-0 ${i === 0 ? "bg-primary" : "bg-white/10"}`} />
                      {item}
                    </div>
                  ))}
                </nav>

                <div ref={scoreRef} className="mt-auto pt-3 border-t border-white/[0.04]">
                  <div className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white/15 mb-1">
                    Validation Score
                  </div>
                  <div className="flex items-baseline gap-1 mb-1.5">
                    <span className="text-[28px] font-black text-white/85 leading-none tabular-nums">
                      {REPORT.score}
                    </span>
                    <span className="text-[11px] text-white/20">/100</span>
                  </div>
                  <div className="h-[2.5px] w-full rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="score-bar h-full rounded-full bg-white/60"
                      style={{ width: scoreVisible ? `${REPORT.score}%` : "0%" }}
                    />
                  </div>
                  <div className="mt-1 text-[9.5px] text-white/15">Strong · Recommended</div>
                </div>
              </div>

              {/* Main */}
              <div className="p-5 md:p-7 flex flex-col gap-4 overflow-hidden">
                <div>
                  <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/15 mb-1">Idea</div>
                  <p className="text-[14px] font-semibold text-white/75 leading-snug">{REPORT.idea}</p>
                </div>

                <div className="flex-1">
                  <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/15 mb-2.5">
                    Key Findings
                  </div>
                  <div className="divide-y divide-white/[0.035]">
                    {REPORT.rows.map((row) => (
                      <div key={row.label} className="flex items-center justify-between py-2">
                        <span className="text-[12px] text-white/30">{row.label}</span>
                        <span className={`text-[12px] font-medium ${row.positive ? "text-white/70" : "text-white/42"}`}>
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-white/[0.04] bg-white/[0.015] p-3.5 mt-auto">
                  <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/15 mb-1.5">
                    AI Summary
                  </div>
                  <p className="text-[11.5px] leading-[1.7] text-white/25">
                    Strong opportunity in a growing segment with measurable demand signals. Existing
                    solutions lack modern UX and AI-native features, creating a clear wedge.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-2.5 text-center text-[10.5px] text-white/12">
            Sample output · Your results will vary based on your idea
          </p>
        </div>
      </div>
    </section>
  );
}
