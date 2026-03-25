import { Zap, Search, BarChart3, Map, TrendingUp, Shield, Sparkles } from "lucide-react";

const POWERED_BY = [
  { name: "OpenRouter", desc: "AI processing" },
  { name: "Groq", desc: "Fast inference" },
  { name: "OpenAI", desc: "GPT models" },
  { name: "Anthropic", desc: "Claude models" },
  { name: "Gemini", desc: "Google AI" },
  { name: "Supabase", desc: "Database & backend" },
  { name: "Stripe", desc: "Payments" },
  { name: "Brave Search", desc: "Market data" },
  { name: "Namecheap", desc: "Domain API" },
  { name: "GoDaddy", desc: "Domain API" },
];

const STATS = [
  { value: "10,000+", label: "Ideas analyzed" },
  { value: "~30s", label: "Avg. analysis time" },
  { value: "17+", label: "AI-powered insight domains" },
];

const VALUE_POINTS = [
  { icon: Zap, title: "Instant idea validation", desc: "Get a ValiScore and risk assessment in seconds." },
  { icon: Search, title: "Deep competitor insights", desc: "AI-powered competitive landscape analysis." },
  { icon: Map, title: "AI-generated product roadmap", desc: "From MVP features to go-to-market strategy." },
  { icon: BarChart3, title: "Execution-ready plans", desc: "Kanban boards, tech stacks, and monetization models." },
];

export function TrustSection() {
  return (
    <div className="relative">
      {/* Hero sub-section */}
      <section className="border-t border-border py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-4">
            Built for founders, powered by modern AI
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Turn your idea into a validated startup using advanced AI, market intelligence, and execution-ready insights.
          </p>

          {/* Solo founder badge */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-[11px] font-medium text-muted-foreground tracking-wide">
              Built independently using AI tools for founders worldwide
            </span>
          </div>
        </div>
      </section>

      {/* Powered-by grid */}
      <section className="border-t border-border py-16 px-6">
        <p className="text-center text-[10.5px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-10">
          Powered by
        </p>
        <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {POWERED_BY.map((tool) => (
            <div
              key={tool.name}
              className="group flex flex-col items-center justify-center rounded-lg border border-border bg-card/60 backdrop-blur-sm px-3 py-4 transition-all duration-300 hover:border-primary/30 hover:bg-primary/[0.04] hover:scale-[1.04]"
            >
              <span className="text-[12.5px] font-semibold text-foreground/80 group-hover:text-foreground transition-colors">
                {tool.name}
              </span>
              <span className="text-[10px] text-muted-foreground mt-0.5">{tool.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-border py-16 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center rounded-lg border border-border bg-card/60 backdrop-blur-sm py-8 px-4 transition-all duration-300 hover:border-primary/30"
            >
              <span className="text-3xl font-bold text-foreground tracking-tight">{s.value}</span>
              <span className="text-[11.5px] text-muted-foreground mt-1.5">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Why founders use ValiSearch */}
      <section className="border-t border-border py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 mb-4">
              <Shield className="h-3 w-3 text-primary" />
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Why ValiSearch
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
              Why founders use ValiSearch
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VALUE_POINTS.map((point) => (
              <div
                key={point.title}
                className="group flex gap-4 rounded-lg border border-border bg-card/60 backdrop-blur-sm p-5 transition-all duration-300 hover:border-primary/30 hover:bg-primary/[0.04]"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <point.icon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-[13.5px] font-semibold text-foreground mb-1">{point.title}</h3>
                  <p className="text-[12px] text-muted-foreground leading-relaxed">{point.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Credibility note */}
          <p className="text-center text-[10.5px] text-muted-foreground/60 mt-10">
            <TrendingUp className="inline h-3 w-3 mr-1 -mt-px" />
            AI-powered insights across market analysis, competitor research, branding, and execution planning.
          </p>
        </div>
      </section>
    </div>
  );
}
