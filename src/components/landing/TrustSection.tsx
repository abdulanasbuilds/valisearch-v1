import { useEffect, useRef } from "react";
import { Zap, Search, BarChart3, Map } from "lucide-react";

const POWERED_BY = [
  "OpenRouter", "Groq", "OpenAI", "Anthropic",
  "Gemini", "Supabase", "Stripe", "Brave Search",
];

const STATS = [
  { value: "10,000+", label: "Ideas analyzed" },
  { value: "~30s", label: "Avg. analysis time" },
  { value: "17+", label: "Insight domains" },
];

const VALUE_POINTS = [
  { icon: Zap, title: "Instant validation", desc: "Get a ValiScore and risk assessment in seconds." },
  { icon: Search, title: "Competitor insights", desc: "AI-powered competitive landscape analysis." },
  { icon: Map, title: "Product roadmap", desc: "From MVP features to go-to-market strategy." },
  { icon: BarChart3, title: "Execution plans", desc: "Kanban boards, tech stacks, monetization models." },
];

export function TrustSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll<HTMLElement>(".reveal") ?? [];
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) (e.target as HTMLElement).classList.add("visible");
      }),
      { threshold: 0.08 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef}>
      {/* Powered-by strip */}
      <div className="border-t border-white/[0.04] py-10 overflow-hidden">
        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-white/15 mb-7">
          Powered by
        </p>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none bg-gradient-to-r from-background to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none bg-gradient-to-l from-background to-transparent" />
          <div className="overflow-hidden">
            <div className="powered-marquee-track">
              {[...POWERED_BY, ...POWERED_BY].map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="shrink-0 text-[12px] font-semibold text-white/15 tracking-[-0.01em] hover:text-white/30 transition-colors duration-300 cursor-default px-5"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-t border-white/[0.04] py-14 px-5 md:px-6">
        <div className="max-w-[800px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="reveal flex flex-col items-center rounded-xl border border-white/[0.06] bg-white/[0.015] py-7 px-4 transition-all duration-300 hover:border-white/[0.1] hover:bg-white/[0.025]"
            >
              <span className="text-[28px] font-bold text-white/80 tracking-tight tabular-nums">{s.value}</span>
              <span className="text-[11px] text-white/25 mt-1">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Why ValiSearch */}
      <div className="border-t border-white/[0.04] py-20 md:py-28 px-5 md:px-6">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-14">
            <div className="reveal flex items-center justify-center gap-2.5 mb-5">
              <div className="h-px w-5 bg-white/12" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/20">
                Why ValiSearch
              </span>
              <div className="h-px w-5 bg-white/12" />
            </div>
            <h2 className="reveal reveal-delay-1 text-[clamp(1.6rem,3.5vw,2.6rem)] font-black text-white leading-[1.1] tracking-[-0.035em]">
              Why founders use ValiSearch
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {VALUE_POINTS.map((point, i) => (
              <div
                key={point.title}
                className={`reveal reveal-delay-${i + 1} group flex gap-3.5 rounded-xl border border-white/[0.06] bg-white/[0.015] p-5 transition-all duration-300 hover:border-white/[0.1] hover:bg-white/[0.025]`}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  <point.icon className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h3 className="text-[13px] font-semibold text-white/70 mb-0.5 group-hover:text-white/85 transition-colors">
                    {point.title}
                  </h3>
                  <p className="text-[12px] text-white/25 leading-relaxed">{point.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
