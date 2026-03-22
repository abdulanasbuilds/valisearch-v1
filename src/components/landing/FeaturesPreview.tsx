import { Target, Swords, Layers, DollarSign, TrendingUp, Palette } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Validation Score",
    description: "Instant viability assessment with market demand, feasibility, and risk analysis.",
  },
  {
    icon: Swords,
    title: "Competitor Intelligence",
    description: "Who's already building this, their weaknesses, and the gaps you can exploit.",
  },
  {
    icon: Layers,
    title: "Product Roadmap",
    description: "MVP features, differentiators, and a premium feature path — prioritized.",
  },
  {
    icon: DollarSign,
    title: "Monetization Plan",
    description: "Pricing models, revenue streams, and projections for your specific market.",
  },
  {
    icon: TrendingUp,
    title: "Market Sizing",
    description: "TAM, SAM, SOM with growth outlook and macro trend analysis.",
  },
  {
    icon: Palette,
    title: "Brand & Naming",
    description: "Name suggestions, taglines, brand positioning, and voice guidelines.",
  },
];

export function FeaturesPreview() {
  return (
    <section id="features" className="py-20 sm:py-28 border-t border-border/30">
      <div className="container mx-auto px-5">
        <div className="mx-auto max-w-md text-center mb-14">
          <h2 className="text-2xl font-bold tracking-[-0.02em] sm:text-3xl">
            A full startup blueprint, not a summary
          </h2>
          <p className="mt-3 text-[14px] text-muted-foreground leading-relaxed">
            Each analysis covers eight dimensions that investors and founders actually care about.
          </p>
        </div>

        <div className="mx-auto max-w-4xl grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="card-surface-hover group rounded-xl p-5"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                <f.icon className="h-[18px] w-[18px]" />
              </div>
              <h3 className="text-[14px] font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
