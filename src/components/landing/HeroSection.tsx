import { useNavigate } from "react-router-dom";

function HeroMockup() {
  return (
    <div className="relative">
      {/* Purple radial glow behind */}
      <div
        className="absolute inset-0 -m-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(108,71,255,0.18) 0%, rgba(108,71,255,0) 60%)",
        }}
      />

      <div
        className="relative rounded-xl border border-white/[0.08] bg-[#111111] overflow-hidden"
        style={{ boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06] bg-[#0E0E0E]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
          <span className="ml-4 text-[11px] text-white/30 font-mono">
            valisearch.app/dashboard
          </span>
        </div>

        <div className="p-6">
          {/* Score row */}
          <div className="flex items-end justify-between mb-5">
            <div>
              <div className="text-[11px] uppercase tracking-[0.15em] text-[#888888] font-semibold mb-2">
                Idea Score
              </div>
              <div className="text-[64px] font-black leading-none text-white tabular-nums tracking-tighter">
                72
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] uppercase tracking-[0.15em] text-[#888888] font-semibold mb-2">
                Status
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#22C55E]/10 border border-[#22C55E]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                <span className="text-[12px] font-semibold text-[#22C55E]">
                  Validated
                </span>
              </div>
            </div>
          </div>

          {/* Score bar */}
          <div className="h-1.5 w-full rounded-full bg-white/[0.05] overflow-hidden mb-6">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#22C55E] to-[#22C55E]/70"
              style={{ width: "72%" }}
            />
          </div>

          {/* Metric pills */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {[
              { l: "Market", v: "$2.4B" },
              { l: "Competitors", v: "8" },
              { l: "Complexity", v: "Medium" },
            ].map((m) => (
              <div
                key={m.l}
                className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5"
              >
                <div className="text-[10px] uppercase tracking-wider text-[#888888] font-semibold">
                  {m.l}
                </div>
                <div className="text-[14px] font-bold text-white mt-1">{m.v}</div>
              </div>
            ))}
          </div>

          {/* Mini competitor table */}
          <div className="rounded-lg border border-white/[0.06] overflow-hidden">
            <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/[0.06] text-[11px] uppercase tracking-wider text-[#888888] font-semibold flex items-center justify-between">
              <span>Competitor Landscape</span>
              <span className="text-white/40">Score</span>
            </div>
            {[
              { n: "Productly", s: "84" },
              { n: "Validatr.io", s: "67" },
              { n: "IdeaForge", s: "53" },
            ].map((c, i) => (
              <div
                key={c.n}
                className={`px-4 py-3 flex items-center justify-between text-[13px] ${
                  i !== 2 ? "border-b border-white/[0.04]" : ""
                }`}
              >
                <span className="text-white/80 font-medium">{c.n}</span>
                <span className="text-white/40 font-mono tabular-nums">{c.s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative pt-[140px] pb-32 overflow-hidden">
      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-[55%_45%] gap-16 items-center">
          {/* Left column */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6C47FF] mb-6">
              AI Startup Intelligence Platform
            </div>

            <h1
              className="text-[44px] sm:text-[64px] lg:text-[80px] font-black text-[#F0F0F0] leading-[1.05]"
              style={{ letterSpacing: "-0.03em" }}
            >
              Validate your
              <br />
              <span
                className="font-normal italic"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                startup idea
              </span>
              <br />
              before you build.
            </h1>

            <p className="mt-6 text-[18px] text-[#888888] leading-[1.7] max-w-[460px]">
              Turn a raw idea into a complete investor-ready intelligence report in 30
              seconds. Market sizing, competitor analysis, product strategy, branding,
              revenue models, and a sprint-ready Kanban board.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate("/register")}
                className="bg-[#6C47FF] hover:bg-[#7C5AFF] text-white text-[16px] font-semibold px-7 py-3.5 rounded-lg transition-colors"
              >
                Validate my idea free
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="border border-white/[0.15] hover:border-white/30 text-[#F0F0F0] text-[16px] font-medium px-7 py-3.5 rounded-lg transition-colors"
              >
                See how it works →
              </button>
            </div>

            <div className="mt-12">
              <div className="text-[12px] tracking-[0.15em] uppercase text-[#555555] font-semibold mb-5">
                Trusted by founders building at
              </div>
              <div className="flex flex-wrap items-center gap-x-10 gap-y-3 opacity-40 text-[13px] font-bold tracking-[0.05em] text-white">
                <span>NOTION</span>
                <span>LINEAR</span>
                <span>SUPABASE</span>
                <span>VERCEL</span>
                <span>STRIPE</span>
              </div>
            </div>
          </div>

          {/* Right column — mockup */}
          <div className="hidden lg:block">
            <HeroMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
