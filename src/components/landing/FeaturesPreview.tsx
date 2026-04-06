import { useEffect, useRef, useCallback } from "react";

const FEATURES = [
  {
    n: "01",
    title: "Validation Score",
    body: "A 0–100 composite score across market demand, feasibility, competition, and timing.",
  },
  {
    n: "02",
    title: "Competitor Map",
    body: "Who's building this, their market position, pricing, weaknesses, and the gap you can exploit.",
  },
  {
    n: "03",
    title: "Market Sizing",
    body: "TAM, SAM, SOM with cited growth projections and macro trend signals.",
  },
  {
    n: "04",
    title: "Monetization Plan",
    body: "Pricing model recommendations, revenue streams, and realistic Year 1–3 projections.",
  },
  {
    n: "05",
    title: "Product Roadmap",
    body: "Prioritized MVP features, differentiating bets, and a premium feature ladder.",
  },
  {
    n: "06",
    title: "Brand & GTM",
    body: "Naming directions, positioning, ideal customer profile, and first acquisition channels.",
  },
];

export function FeaturesPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll<HTMLElement>(".reveal, .reveal-scale") ?? [];
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) (e.target as HTMLElement).classList.add("visible");
      }),
      { threshold: 0.07 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const cards = gridRef.current?.querySelectorAll<HTMLElement>(".feature-card") ?? [];
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
      card.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
    });
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    grid.addEventListener("mousemove", handleMouseMove);
    return () => grid.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <section id="features" ref={sectionRef} className="border-t border-white/[0.04] py-24 md:py-36">
      <div className="max-w-[1120px] mx-auto px-5 md:px-6">

        <div className="grid md:grid-cols-2 gap-8 mb-16 items-end">
          <div>
            <div className="reveal flex items-center gap-2.5 mb-6">
              <div className="h-px w-5 bg-white/12" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/20">
                Eighteen-section report
              </span>
            </div>
            <h2 className="reveal reveal-delay-1 text-[clamp(1.8rem,4.5vw,3.2rem)] font-black text-white leading-[1.06] tracking-[-0.035em]">
              Everything a founder<br className="hidden sm:block" />
              needs to{" "}
              <span className="font-serif-display font-normal text-white/35">decide.</span>
            </h2>
          </div>
          <p className="reveal reveal-delay-2 text-[14px] leading-[1.8] text-white/28 md:pb-1 max-w-[380px]">
            Most validation tools give you a vibe check. ValiSearch gives you the complete
            picture — the same dimensions experienced founders evaluate.
          </p>
        </div>

        <div
          ref={gridRef}
          className="reveal-scale grid sm:grid-cols-2 lg:grid-cols-3 gap-px rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.04]"
        >
          {FEATURES.map((f) => (
            <div
              key={f.n}
              className="feature-card relative bg-background p-6 transition-colors duration-300 hover:bg-white/[0.015] cursor-default select-none group"
            >
              <div className="feature-glow" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[9.5px] font-mono font-bold text-white/12 tracking-widest">{f.n}</span>
                  <span className="text-white/8 text-[11px] group-hover:text-white/20 transition-colors">→</span>
                </div>
                <h3 className="text-[14px] font-semibold text-white/65 mb-2 group-hover:text-white/85 transition-colors duration-200">
                  {f.title}
                </h3>
                <p className="text-[12px] leading-[1.75] text-white/22">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
