import { useEffect, useRef, useCallback } from "react";

const FEATURES = [
  {
    n: "01",
    title: "Validation Score",
    body: "A 0–100 composite score across market demand, feasibility, competition, and timing. Backed by data — not gut feel.",
  },
  {
    n: "02",
    title: "Competitor Map",
    body: "Who's already building this, their market position, pricing, weaknesses, and the gap you can exploit.",
  },
  {
    n: "03",
    title: "Market Sizing",
    body: "TAM, SAM, SOM with cited growth projections and macro trend signals. The numbers investors actually ask about.",
  },
  {
    n: "04",
    title: "Monetization Plan",
    body: "Pricing model recommendations, revenue stream options, and realistic Year 1–3 projections for your segment.",
  },
  {
    n: "05",
    title: "Product Roadmap",
    body: "Prioritized MVP features, differentiating bets, and a premium feature ladder mapped to customer segments.",
  },
  {
    n: "06",
    title: "Brand & GTM",
    body: "Naming directions, positioning statement, ideal customer profile, and the first acquisition channels to test.",
  },
];

export function FeaturesPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  /* ── scroll reveals ─────────────────────────────────── */
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

  /* ── cursor-tracking glow per card ─────────────────── */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const cards = gridRef.current?.querySelectorAll<HTMLElement>(".feature-card") ?? [];
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mx", `${x}%`);
      card.style.setProperty("--my", `${y}%`);
    });
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    grid.addEventListener("mousemove", handleMouseMove);
    return () => grid.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <section id="features" ref={sectionRef} className="border-t border-white/[0.05] py-28 md:py-36">
      <div className="max-w-6xl mx-auto px-5 md:px-8">

        {/* Header */}
        <div className="grid md:grid-cols-2 gap-10 mb-20 items-end">
          <div>
            <div className="reveal flex items-center gap-3 mb-7">
              <div className="h-px w-7 bg-white/15" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/25">
                Eight-section report
              </span>
            </div>
            <h2 className="reveal reveal-delay-1 text-[clamp(2rem,4.5vw,3.6rem)] font-black text-white leading-[1.06] tracking-[-0.035em]">
              Everything a founder<br />
              needs to{" "}
              <span className="font-serif-display font-normal text-white/42">decide.</span>
            </h2>
          </div>
          <p className="reveal reveal-delay-2 text-[15px] leading-[1.85] text-white/35 md:pb-1 max-w-[400px]">
            Most validation tools give you a vibe check. ValiSearch gives you the complete
            picture — the same dimensions that experienced founders evaluate before committing to an idea.
          </p>
        </div>

        {/* Feature grid with cursor glow */}
        <div
          ref={gridRef}
          className="reveal-scale grid sm:grid-cols-2 lg:grid-cols-3 divide-y divide-x-0 sm:divide-x divide-white/[0.05] border border-white/[0.05] rounded-2xl overflow-hidden"
        >
          {FEATURES.map((f, i) => (
            <div
              key={f.n}
              className="feature-card relative bg-[#0A0A0A] p-7 transition-colors duration-300 hover:bg-white/[0.02] cursor-default select-none"
            >
              {/* Cursor glow layer */}
              <div className="feature-glow" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-mono font-bold text-white/18 tracking-widest">
                    {f.n}
                  </span>
                  {/* Tiny right-arrow that reveals on hover */}
                  <span className="text-white/10 text-[12px] group-hover:text-white/30 transition-colors">→</span>
                </div>
                <h3 className="text-[15px] font-semibold text-white/72 mb-3 transition-colors duration-200 group-hover:text-white">
                  {f.title}
                </h3>
                <p className="text-[13px] leading-[1.8] text-white/30">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
