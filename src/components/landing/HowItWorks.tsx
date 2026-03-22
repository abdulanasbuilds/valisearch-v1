const steps = [
  {
    num: "01",
    title: "Describe your idea",
    description: "Write a few sentences about what you want to build. No business jargon needed.",
  },
  {
    num: "02",
    title: "AI runs the analysis",
    description: "Six specialized agents evaluate market demand, competitors, risks, and opportunities.",
  },
  {
    num: "03",
    title: "Get your blueprint",
    description: "A structured report with validation score, strategy, branding, and a monetization plan.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <div className="container mx-auto px-5">
        <div className="mx-auto max-w-md text-center mb-14">
          <h2 className="text-2xl font-bold tracking-[-0.02em] sm:text-3xl">
            How it works
          </h2>
          <p className="mt-3 text-[14px] text-muted-foreground leading-relaxed">
            From raw idea to investor-ready analysis in three steps.
          </p>
        </div>

        <div className="mx-auto max-w-3xl grid gap-px bg-border/40 rounded-xl overflow-hidden border border-border/40 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.num} className="bg-card p-7 sm:p-8">
              <span className="text-[12px] font-mono font-medium text-primary/70 tracking-wide">{step.num}</span>
              <h3 className="mt-3 text-[15px] font-semibold leading-snug">{step.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
