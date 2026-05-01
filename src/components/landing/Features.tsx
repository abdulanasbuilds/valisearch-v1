import { useNavigate } from "react-router-dom";

function ScoreVisual() {
  const dims = [
    { l: "Uniqueness", v: 78 },
    { l: "Market demand", v: 84 },
    { l: "Stickiness", v: 65 },
    { l: "Monetization", v: 71 },
    { l: "Scalability", v: 80 },
    { l: "Complexity", v: 58 },
  ];
  const r = 64;
  const c = 2 * Math.PI * r;
  const offset = c - (72 / 100) * c;
  return (
    <div className="w-full">
      <div className="flex items-center gap-8 mb-8">
        <div className="relative w-[160px] h-[160px] flex-shrink-0">
          <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
            <circle cx="80" cy="80" r={r} stroke="rgba(255,255,255,0.06)" strokeWidth="6" fill="none" />
            <circle
              cx="80"
              cy="80"
              r={r}
              stroke="#6C47FF"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-[40px] font-extrabold text-[#F0F0F0] leading-none tabular-nums">72</div>
            <div className="text-[10px] uppercase tracking-wider text-[#888888] mt-1">Score</div>
          </div>
        </div>
        <div className="flex-1 space-y-2.5">
          {dims.map((d) => (
            <div key={d.l}>
              <div className="flex justify-between text-[12px] mb-1">
                <span className="text-[#888888]">{d.l}</span>
                <span className="text-[#F0F0F0] font-mono tabular-nums">{d.v}</span>
              </div>
              <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
                <div className="h-full bg-[#6C47FF] rounded-full" style={{ width: `${d.v}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MarketVisual() {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="relative w-full max-w-[360px] aspect-square">
        {/* TAM */}
        <div className="absolute inset-0 rounded-2xl border border-[#6C47FF]/30 bg-[#6C47FF]/[0.04] flex items-start justify-start p-4">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#888888]">TAM</div>
            <div className="text-[20px] font-bold text-[#F0F0F0]">$24B</div>
          </div>
        </div>
        {/* SAM */}
        <div className="absolute inset-[18%] rounded-xl border border-[#6C47FF]/40 bg-[#6C47FF]/[0.07] flex items-start justify-start p-4">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#888888]">SAM</div>
            <div className="text-[18px] font-bold text-[#F0F0F0]">$6.2B</div>
          </div>
        </div>
        {/* SOM */}
        <div className="absolute inset-[36%] rounded-lg border border-[#6C47FF]/60 bg-[#6C47FF]/[0.12] flex items-center justify-center">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-wider text-[#888888]">SOM</div>
            <div className="text-[16px] font-bold text-[#F0F0F0]">$420M</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KanbanVisual() {
  const cols = [
    { t: "Backlog", items: ["Auth flow", "Onboarding", "Payment integration"] },
    { t: "In Progress", items: ["Dashboard UI", "API spec"] },
    { t: "Done", items: ["Brand identity", "Landing page"] },
  ];
  return (
    <div className="w-full grid grid-cols-3 gap-3">
      {cols.map((col) => (
        <div key={col.t} className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-3">
          <div className="text-[10px] uppercase tracking-wider text-[#888888] font-semibold mb-3 flex justify-between">
            <span>{col.t}</span>
            <span>{col.items.length}</span>
          </div>
          <div className="space-y-2">
            {col.items.map((it) => (
              <div
                key={it}
                className="rounded-md bg-[#161616] border border-white/[0.06] px-3 py-2.5 text-[12px] text-[#F0F0F0]"
              >
                {it}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FeatureBlock({
  label,
  headline,
  body,
  visual,
  reverse = false,
}: {
  label: string;
  headline: string;
  body: string;
  visual: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className="relative py-24">
      <div className="section-container grid lg:grid-cols-[55%_45%] gap-12 lg:gap-20 items-center">
        <div className={reverse ? "lg:order-2" : ""}>
          <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6C47FF] mb-5">
            {label}
          </div>
          <h2
            className="text-[36px] md:text-[48px] font-bold text-[#F0F0F0] leading-[1.1] mb-6"
            style={{ letterSpacing: "-0.02em" }}
          >
            {headline}
          </h2>
          <p className="text-[17px] text-[#888888] leading-[1.7] max-w-[480px]">{body}</p>
        </div>
        <div className={reverse ? "lg:order-1" : ""}>
          <div className="rounded-xl border border-white/[0.08] bg-[#111111] p-8">
            {visual}
          </div>
        </div>
      </div>
    </div>
  );
}

function GlowDivider() {
  return (
    <div className="relative h-px w-full">
      <div
        className="absolute left-1/2 -translate-x-1/2 -top-32 w-[800px] h-64 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(108,71,255,0.10) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

export function Features() {
  return (
    <section id="features">
      <FeatureBlock
        label="Validation Engine"
        headline="AI that thinks like a serial founder"
        body="ValiSearch scores your idea across 6 dimensions — uniqueness, market demand, stickiness, monetization potential, scalability, and technical complexity. Get a 0-100 confidence score with specific reasoning for every dimension."
        visual={<ScoreVisual />}
      />
      <GlowDivider />
      <FeatureBlock
        reverse
        label="Market Intelligence"
        headline="Know your market before you spend a dollar"
        body="Real TAM, SAM, and SOM estimates with sourced reasoning. Google Trends integration shows whether your market is growing or shrinking. Competitor landscape maps show exactly where gaps exist."
        visual={<MarketVisual />}
      />
      <GlowDivider />
      <FeatureBlock
        label="Sprint Planner"
        headline="Validation to build-ready in one session"
        body="The only validation platform with a built-in Kanban sprint board. Your validated features become actionable development tasks — drag, prioritize, and export to Linear, Jira, or Notion."
        visual={<KanbanVisual />}
      />
    </section>
  );
}
