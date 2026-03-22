export function SocialProof() {
  const companies = ["TechStars", "Y Combinator", "Sequoia", "a16z", "Accel", "Notion Capital"];

  return (
    <section className="py-10 border-t border-border/30">
      <div className="container mx-auto px-5">
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground/40 mb-6">
          Backed by founders from
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {companies.map((name) => (
            <span
              key={name}
              className="text-[14px] font-medium text-muted-foreground/25 select-none"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
