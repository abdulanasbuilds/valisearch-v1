const INTEGRATIONS = [
  "OpenAI",
  "Supabase",
  "Stripe",
  "Groq",
  "Gemini",
  "Lovable",
  "Bubble",
  "10Web",
  "Notion",
  "Slack",
];

export function Integrations() {
  return (
    <section className="py-32">
      <div className="section-container">
        <div className="text-center mb-16">
          <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6C47FF] mb-5">
            Integrations
          </div>
          <h2
            className="text-[36px] md:text-[48px] font-bold text-[#F0F0F0] tracking-tight leading-[1.1]"
            style={{ letterSpacing: "-0.02em" }}
          >
            Works with your entire stack
          </h2>
          <p className="mt-5 text-[17px] text-[#888888] max-w-[520px] mx-auto leading-[1.6]">
            ValiSearch connects to the tools you already use and exports directly to the
            builders you build with.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-[920px] mx-auto">
          {INTEGRATIONS.map((name) => (
            <div
              key={name}
              className="flex flex-col items-center justify-center gap-3 rounded-[10px] border border-white/[0.06] bg-white/[0.03] p-5 hover:border-white/[0.15] transition-colors"
            >
              <div className="w-10 h-10 rounded-md bg-white/[0.05] border border-white/[0.06] flex items-center justify-center text-[14px] font-bold text-[#F0F0F0]">
                {name.charAt(0)}
              </div>
              <div className="text-[13px] text-[#F0F0F0] font-medium">{name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
