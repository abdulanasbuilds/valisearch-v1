import { useEffect, useRef } from "react";

const COMPANIES = [
  "Y Combinator",
  "TechStars",
  "Sequoia Capital",
  "Andreessen Horowitz",
  "Accel Partners",
  "Notion Capital",
  "First Round",
  "Index Ventures",
  "Lightspeed",
  "Bessemer",
];

export function SocialProof() {
  const trackRef = useRef<HTMLDivElement>(null);

  // Duplicate items for seamless loop
  const doubled = [...COMPANIES, ...COMPANIES];

  return (
    <section className="py-16 border-t border-white/[0.06] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-white/20">
          Trusted by founders from the world's best companies
        </p>
      </div>

      {/* Fade edges */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none bg-gradient-to-r from-background to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none bg-gradient-to-l from-background to-transparent" />

        <div className="overflow-hidden">
          <div ref={trackRef} className="marquee-track">
            {doubled.map((name, i) => (
              <span
                key={i}
                className="text-[15px] font-semibold text-white/20 select-none shrink-0 hover:text-white/40 transition-colors duration-300"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
