import { useEffect, useRef, useState } from "react";

export function ProductPreview() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const sidebarItems = [
    "Overview",
    "Validation",
    "Market Feasibility",
    "Market Research",
    "Competitors",
    "Product",
    "Branding",
    "Revenue",
    "Monetization",
    "Go-To-Market",
    "Idea Evolution",
    "Flow Editor",
    "User Flow",
    "Sprint Planner",
    "Tech Stack",
    "Build Mode",
    "IDE Bridge",
    "API Settings",
  ];

  return (
    <section ref={ref} className="py-28 bg-[#0A0A0A]">
      <div className="max-w-[1200px] mx-auto px-5">
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className={`text-[48px] font-bold text-[#F0F0F0] leading-tight transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            See your idea transformed
          </h2>
          <p
            className={`mt-4 text-[18px] text-[#888888] transition-all duration-700 delay-100 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Every analysis section is interactive. Navigate, explore, and export.
          </p>
        </div>

        {/* Browser Mockup */}
        <div
          className={`transition-all duration-1000 delay-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="browser-mockup">
            {/* Browser Chrome */}
            <div className="browser-chrome">
              <div className="flex gap-2">
                <div className="browser-dot browser-dot-red" />
                <div className="browser-dot browser-dot-yellow" />
                <div className="browser-dot browser-dot-green" />
              </div>
              <div className="flex-1 mx-4 flex justify-center">
                <div className="h-6 bg-[#1A1A1A] rounded-md flex items-center px-3 gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
                  <span className="text-[12px] text-[#888888] font-mono">
                    app.valisearch.io/report
                  </span>
                </div>
              </div>
            </div>

            {/* App Content */}
            <div className="grid grid-cols-[220px_1fr] h-[500px]">
              {/* Sidebar */}
              <div className="border-r border-white/[0.06] bg-[#0A0A0A] p-4 overflow-y-auto">
                <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#888888] mb-3 px-2">
                  Analysis Sections
                </div>
                <nav className="space-y-0.5">
                  {sidebarItems.map((item, i) => (
                    <div
                      key={item}
                      className={`px-2 py-1.5 rounded-md text-[13px] transition-colors cursor-default ${
                        i === 0
                          ? "bg-white/[0.05] text-[#F0F0F0] font-medium"
                          : "text-[#888888] hover:text-[#F0F0F0] hover:bg-white/[0.02]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-1 h-1 rounded-full ${
                            i === 0 ? "bg-[#6C47FF]" : "bg-[#444444]"
                          }`}
                        />
                        {item}
                      </div>
                    </div>
                  ))}
                </nav>
              </div>

              {/* Main Content */}
              <div className="p-6 bg-[#0A0A0A] overflow-y-auto">
                {/* Overview Section Mock */}
                <div className="mb-6">
                  <h2 className="text-[24px] font-bold text-[#F0F0F0] mb-1">
                    AI-powered onboarding tool for B2B SaaS
                  </h2>
                  <p className="text-[14px] text-[#888888]">
                    Complete analysis report generated 2 minutes ago
                  </p>
                </div>

                {/* Score Cards */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-[#111111] border border-white/[0.06] rounded-lg p-4">
                    <div className="text-[11px] text-[#888888] uppercase tracking-wide mb-2">
                      Idea Score
                    </div>
                    <div className="text-[36px] font-black text-[#22C55E]">84</div>
                    <div className="text-[12px] text-[#888888]">Strong · Recommended</div>
                  </div>
                  <div className="bg-[#111111] border border-white/[0.06] rounded-lg p-4">
                    <div className="text-[11px] text-[#888888] uppercase tracking-wide mb-2">
                      Market Size
                    </div>
                    <div className="text-[36px] font-black text-[#F0F0F0]">$2.4B</div>
                    <div className="text-[12px] text-[#888888]">TAM · Growing</div>
                  </div>
                  <div className="bg-[#111111] border border-white/[0.06] rounded-lg p-4">
                    <div className="text-[11px] text-[#888888] uppercase tracking-wide mb-2">
                      Complexity
                    </div>
                    <div className="text-[36px] font-black text-[#EAB308]">Med</div>
                    <div className="text-[12px] text-[#888888]">2-3 months MVP</div>
                  </div>
                </div>

                {/* Key Findings */}
                <div className="bg-[#111111] border border-white/[0.06] rounded-lg p-4">
                  <div className="text-[11px] text-[#888888] uppercase tracking-wide mb-3">
                    Key Findings
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: "Market Opportunity", value: "Large · $4.2B TAM", positive: true },
                      { label: "Competition", value: "Moderate · 6 direct", positive: false },
                      { label: "Revenue Potential", value: "$1.2M ARR yr 2", positive: true },
                      { label: "Technical Risk", value: "Low · Proven stack", positive: true },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0"
                      >
                        <span className="text-[14px] text-[#888888]">{row.label}</span>
                        <span
                          className={`text-[14px] font-medium ${
                            row.positive ? "text-[#22C55E]" : "text-[#EAB308]"
                          }`}
                        >
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Callout Pills */}
        <div
          className={`flex flex-wrap justify-center gap-4 mt-8 transition-all duration-700 delay-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-[#111111] border border-white/[0.06] rounded-full">
            <span className="text-[12px] text-[#888888]">←</span>
            <span className="text-[12px] text-[#F0F0F0] font-medium">0-100 Idea Score</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-[#111111] border border-white/[0.06] rounded-full">
            <span className="text-[12px] text-[#888888]">↓</span>
            <span className="text-[12px] text-[#F0F0F0] font-medium">18 Analysis Sections</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-[#111111] border border-white/[0.06] rounded-full">
            <span className="text-[12px] text-[#F0F0F0] font-medium">Kanban Sprint Board</span>
            <span className="text-[12px] text-[#888888]">→</span>
          </div>
        </div>
      </div>
    </section>
  );
}
