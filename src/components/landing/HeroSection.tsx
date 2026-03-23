import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { useAnalysisStore } from "@/store/useAnalysisStore";

const TYPED_PHRASES = [
  "an AI SaaS for remote teams…",
  "a marketplace for freelancers…",
  "a fitness app with smart coaching…",
  "a B2B tool for legal compliance…",
  "a subscription box for pet owners…",
];

export function HeroSection() {
  const [idea, setIdea] = useState("");
  const [typed, setTyped] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const { setIdea: storeSetIdea, runAnalysis } = useAnalysisStore();

  // Typewriter effect for placeholder
  useEffect(() => {
    if (idea) return; // stop when user is typing
    const phrase = TYPED_PHRASES[phraseIdx];
    const delay = deleting ? 35 : charIdx === phrase.length ? 1800 : 65;

    const t = setTimeout(() => {
      if (!deleting) {
        if (charIdx < phrase.length) {
          setTyped(phrase.slice(0, charIdx + 1));
          setCharIdx((c) => c + 1);
        } else {
          setDeleting(true);
        }
      } else {
        if (charIdx > 0) {
          setTyped(phrase.slice(0, charIdx - 1));
          setCharIdx((c) => c - 1);
        } else {
          setDeleting(false);
          setPhraseIdx((i) => (i + 1) % TYPED_PHRASES.length);
        }
      }
    }, delay);

    return () => clearTimeout(t);
  }, [typed, charIdx, deleting, phraseIdx, idea]);

  const handleAnalyze = () => {
    const val = idea.trim();
    if (!val) return;
    storeSetIdea(val);
    runAnalysis(val);
    navigate("/analyze");
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
      {/* Background orbs */}
      <div className="orb orb-purple absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] opacity-60" />
      <div className="orb orb-blue absolute top-1/3 -right-40 w-[500px] h-[500px] opacity-40" />
      <div className="orb orb-pink absolute bottom-1/4 -left-40 w-[400px] h-[400px] opacity-30" />

      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-100" />

      {/* Light beams */}
      <div className="beam absolute top-0 left-[30%] h-[60vh] w-[1px] opacity-60" style={{ animationDelay: "0s" }} />
      <div className="beam absolute top-0 left-[70%] h-[50vh] w-[1px] opacity-40" style={{ animationDelay: "2s" }} />
      <div className="beam absolute top-0 left-[50%] h-[55vh] w-[1px] opacity-30" style={{ animationDelay: "4s" }} />

      {/* Gradient fade to background at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />

      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-[13px] text-violet-300 font-medium mb-8 hover:border-violet-400/40 transition-colors cursor-default">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          AI-Powered Startup Validation
        </div>

        {/* Headline */}
        <h1 className="text-[clamp(2.8rem,8vw,6.5rem)] font-black leading-[1.02] tracking-[-0.04em] text-white max-w-[900px]">
          Validate your idea
          <br />
          <span className="gradient-text">before you build</span>
        </h1>

        {/* Sub */}
        <p className="mt-6 max-w-[560px] text-[17px] leading-[1.75] text-white/50">
          Market research, competitor analysis, product strategy, and monetization plan — generated in seconds, not weeks.
        </p>

        {/* CTA row */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
          <button
            data-testid="button-get-started-hero"
            onClick={() => document.getElementById("idea-input")?.focus()}
            className="glow-btn group flex items-center gap-2 px-7 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-[15px] font-semibold transition-all duration-200 shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:shadow-[0_0_50px_rgba(139,92,246,0.6)] hover:scale-[1.02]"
          >
            Get started — it's free
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>

          <button className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-[15px] font-medium text-white/60 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-200">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 border border-white/10">
              <Play className="h-3 w-3 fill-current ml-0.5" />
            </span>
            Watch demo
          </button>
        </div>

        {/* Trust line */}
        <p className="mt-5 text-[13px] text-white/25">
          No signup required · Results in under 30 seconds · Trusted by 12,000+ founders
        </p>

        {/* Input card */}
        <div className="mt-16 w-full max-w-[680px]">
          <div className="glass-card rounded-2xl p-3 shadow-[0_0_80px_rgba(139,92,246,0.15)]">
            <textarea
              id="idea-input"
              data-testid="input-idea"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder={`Describe ${typed}${idea ? "" : "|"}`}
              className="w-full resize-none rounded-xl bg-white/[0.03] px-5 py-4 text-[15px] leading-relaxed text-white placeholder:text-white/20 focus:outline-none focus:bg-white/[0.05] transition-colors min-h-[72px] max-h-[160px] border border-transparent focus:border-violet-500/30"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAnalyze();
                }
              }}
            />
            <div className="flex items-center justify-between pt-2 px-1">
              <span className="text-[12px] text-white/20 pl-2">Press Enter to submit</span>
              <button
                data-testid="button-validate"
                onClick={handleAnalyze}
                disabled={!idea.trim()}
                className="glow-btn flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-[14px] font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.02] shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
              >
                Validate Idea
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Product preview / floating mockup */}
        <div className="mt-20 w-full max-w-[1000px] animate-float">
          <div
            className="relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_40px_120px_rgba(0,0,0,0.6),0_0_80px_rgba(139,92,246,0.12)]"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.03]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 mx-4">
                <div className="h-5 rounded-md bg-white/[0.06] px-3 flex items-center gap-2 max-w-[280px] mx-auto">
                  <div className="w-2 h-2 rounded-full bg-green-400/60" />
                  <div className="h-1.5 w-32 rounded-full bg-white/20" />
                </div>
              </div>
            </div>

            {/* Dashboard mockup content */}
            <div className="aspect-[16/9] p-6 grid grid-cols-12 gap-4">
              {/* Sidebar */}
              <div className="col-span-2 flex flex-col gap-2">
                <div className="h-6 w-full rounded-lg bg-violet-500/20 border border-violet-500/30" />
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 rounded-md bg-white/[0.04]" style={{ opacity: 1 - i * 0.12 }} />
                ))}
                <div className="mt-auto">
                  <div className="h-4 w-3/4 rounded-md bg-white/[0.04]" />
                </div>
              </div>

              {/* Main area */}
              <div className="col-span-10 flex flex-col gap-4">
                {/* Score row */}
                <div className="flex gap-3">
                  {[
                    { label: "Score", val: "87", color: "text-green-400" },
                    { label: "Market", val: "9.2", color: "text-violet-400" },
                    { label: "Risk", val: "Low", color: "text-blue-400" },
                    { label: "Revenue", val: "$2.4M", color: "text-pink-400" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="flex-1 rounded-xl bg-white/[0.04] border border-white/[0.06] p-3"
                    >
                      <div className="text-[8px] text-white/30 mb-1">{stat.label}</div>
                      <div className={`text-[14px] font-bold ${stat.color}`}>{stat.val}</div>
                    </div>
                  ))}
                </div>

                {/* Content area */}
                <div className="flex-1 grid grid-cols-3 gap-3">
                  <div className="col-span-2 rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
                    <div className="h-2 w-24 rounded-full bg-white/20 mb-3" />
                    <div className="space-y-2">
                      {[100, 80, 90, 70, 60].map((w, i) => (
                        <div key={i} className="h-1.5 rounded-full bg-white/[0.08]" style={{ width: `${w}%` }} />
                      ))}
                    </div>
                    <div className="mt-4 h-16 rounded-lg bg-gradient-to-r from-violet-500/20 via-blue-500/10 to-transparent border border-violet-500/20" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex-1 rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
                      <div className="h-2 w-16 rounded-full bg-white/20 mb-2" />
                      <div className="h-8 w-8 rounded-full bg-violet-500/30 border border-violet-500/50 mx-auto mt-2" />
                    </div>
                    <div className="flex-1 rounded-xl bg-gradient-to-br from-violet-500/10 to-blue-500/10 border border-violet-500/20 p-3">
                      <div className="h-2 w-12 rounded-full bg-violet-400/40 mb-2" />
                      <div className="space-y-1">
                        <div className="h-1.5 rounded-full bg-violet-400/30 w-full" />
                        <div className="h-1.5 rounded-full bg-violet-400/20 w-4/5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background/60 to-transparent" />
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-16 gap-y-6">
          {[
            { value: "12,847+", label: "ideas validated" },
            { value: "4.9/5", label: "founder rating" },
            { value: "< 30s", label: "avg. analysis time" },
            { value: "8 sections", label: "per report" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-[22px] font-bold tracking-tight text-white">{stat.value}</div>
              <div className="text-[12px] text-white/30 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
