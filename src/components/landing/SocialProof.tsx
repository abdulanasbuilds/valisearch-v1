const LOGOS = [
  "Stripe", "Linear", "Notion", "Vercel", "Loom",
  "Figma", "Airtable", "Webflow", "Intercom", "Rippling",
  "Retool", "Brex", "Mercury", "Deel", "Lattice",
];

export function SocialProof() {
  const doubled = [...LOGOS, ...LOGOS];

  return (
    <section className="border-t border-white/[0.05] py-12 overflow-hidden">
      <p className="text-center text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white/20 mb-9">
        Built by founders from
      </p>

      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #0A0A0A, transparent)" }}
        />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #0A0A0A, transparent)" }}
        />

        <div className="overflow-hidden">
          <div className="marquee-track">
            {doubled.map((name, i) => (
              <span
                key={i}
                className="text-[13.5px] font-semibold text-white/18 shrink-0 tracking-[-0.01em] hover:text-white/38 transition-colors duration-300 cursor-default"
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
