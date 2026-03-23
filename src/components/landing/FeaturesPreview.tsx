import { useEffect, useRef } from "react";
import { Target, Swords, Layers, DollarSign, TrendingUp, Palette, ChevronRight } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Validation Score",
    description: "Instant viability assessment with market demand, feasibility, and risk breakdown — scored out of 100.",
    accent: "from-violet-500/20 to-purple-500/10",
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/15 border-violet-500/30",
  },
  {
    icon: Swords,
    title: "Competitor Intelligence",
    description: "Who's building this, their weaknesses, market gaps you can exploit, and how to differentiate.",
    accent: "from-blue-500/20 to-cyan-500/10",
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/15 border-blue-500/30",
  },
  {
    icon: Layers,
    title: "Product Roadmap",
    description: "Prioritized MVP features, differentiators, and a premium feature path for Series A.",
    accent: "from-pink-500/20 to-rose-500/10",
    iconColor: "text-pink-400",
    iconBg: "bg-pink-500/15 border-pink-500/30",
  },
  {
    icon: DollarSign,
    title: "Monetization Plan",
    description: "Pricing models, revenue streams, and realistic financial projections for your market.",
    accent: "from-green-500/20 to-emerald-500/10",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/15 border-emerald-500/30",
  },
  {
    icon: TrendingUp,
    title: "Market Sizing",
    description: "TAM, SAM, SOM with growth outlook, trend signals, and macro indicators.",
    accent: "from-orange-500/20 to-amber-500/10",
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/15 border-amber-500/30",
  },
  {
    icon: Palette,
    title: "Brand & Naming",
    description: "Name ideas, taglines, brand positioning, and voice guidelines tailored to your audience.",
    accent: "from-cyan-500/20 to-teal-500/10",
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/15 border-cyan-500/30",
  },
];

export function FeaturesPreview() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = section.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="py-28 sm:py-36 border-t border-white/[0.06]">
      {/* Section orbs */}
      <div className="orb orb-purple absolute left-0 w-[600px] h-[600px] opacity-20 -translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-20 reveal">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 text-[12px] text-violet-400 font-medium mb-5">
            Full startup blueprint
          </div>
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-black tracking-[-0.03em] text-white leading-[1.08]">
            Everything investors
            <br />
            <span className="gradient-text">want to see</span>
          </h2>
          <p className="mt-5 text-[16px] leading-[1.75] text-white/45 max-w-lg mx-auto">
            Eight dimensions that matter — from market size to brand voice. In seconds, not weeks.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`grad-border p-6 group cursor-default reveal reveal-delay-${(i % 3) + 1}`}
            >
              {/* Gradient accent top */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${f.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border ${f.iconBg} mb-4 transition-transform duration-300 group-hover:scale-110`}>
                  <f.icon className={`h-5 w-5 ${f.iconColor}`} />
                </div>

                <h3 className="text-[15px] font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-[13px] leading-[1.7] text-white/40 group-hover:text-white/55 transition-colors duration-300">
                  {f.description}
                </p>

                <div className="mt-4 flex items-center gap-1 text-[12px] text-white/20 group-hover:text-white/40 transition-colors duration-300">
                  <span>Learn more</span>
                  <ChevronRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
