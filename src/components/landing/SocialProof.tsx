const LOGOS = [
  "Stripe", "Linear", "Notion", "Vercel", "Loom",
  "Figma", "Airtable", "Webflow", "Intercom", "Rippling",
];

export function SocialProof() {
  const doubled = [...LOGOS, ...LOGOS];

  return (
    <section className="border-t border-white/[0.04] py-9 overflow-hidden">
      <p className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-white/12 mb-7">
        Built by founders from
      </p>

      <div className="relative">
        <div
          className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-background to-transparent"
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-background to-transparent"
        />

        <div className="overflow-hidden">
          <div className="marquee-track">
            {doubled.map((name, i) => (
              <span
                key={i}
                className="text-[12.5px] font-semibold text-white/12 shrink-0 tracking-[-0.01em] hover:text-white/28 transition-colors duration-300 cursor-default"
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
