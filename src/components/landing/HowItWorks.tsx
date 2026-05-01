const STEPS = [
  {
    no: "01",
    title: "Describe your idea",
    body: "Type your startup concept in plain English. No template, no form. Just your idea.",
  },
  {
    no: "02",
    title: "AI analyzes everything",
    body: "Our multi-model AI runs 18 simultaneous analysis modules — market, competitors, product, revenue, branding, and more.",
  },
  {
    no: "03",
    title: "Get your intelligence report",
    body: "A complete 18-section dashboard appears. Score, strategy, sprint board — ready in 30 seconds.",
  },
  {
    no: "04",
    title: "Build with confidence",
    body: "Export to Lovable, Bubble, or 10Web. Or download your PDF report for investors.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 relative">
      <div className="section-container">
        <div className="text-center mb-20">
          <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6C47FF] mb-5">
            How it works
          </div>
          <h2
            className="text-[36px] md:text-[48px] font-bold text-[#F0F0F0] tracking-tight max-w-[640px] mx-auto leading-[1.1]"
            style={{ letterSpacing: "-0.02em" }}
          >
            From idea to intelligence in 4 steps
          </h2>
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-[10px] left-[5%] right-[5%] h-px bg-white/[0.08]" />

          {STEPS.map((step) => (
            <div key={step.no} className="relative">
              <div className="text-[13px] font-bold text-[#6C47FF] tracking-wider mb-3 relative">
                <span className="bg-[#0A0A0A] pr-3 relative z-10">{step.no}</span>
              </div>
              <h3 className="text-[18px] font-semibold text-[#F0F0F0] mb-2">
                {step.title}
              </h3>
              <p className="text-[15px] text-[#888888] leading-[1.6]">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
