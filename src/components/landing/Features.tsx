import { useEffect, useRef, useState } from "react";

interface Feature {
  label: string;
  headline: string;
  body: string;
}

const FEATURES: Feature[] = [
  {
    label: "VALIDATION ENGINE",
    headline: "AI that thinks like a serial founder",
    body: "ValiSearch scores your idea across 6 dimensions — uniqueness, market demand, stickiness, monetization potential, scalability, and technical complexity. Get a 0-100 confidence score with specific reasoning for every dimension.",
  },
  {
    label: "MARKET INTELLIGENCE",
    headline: "Know your market before you spend a dollar",
    body: "Real TAM, SAM, and SOM estimates with sourced reasoning. Google Trends integration shows whether your market is growing or shrinking. Competitor landscape maps show exactly where gaps exist.",
  },
  {
    label: "SPRINT PLANNER",
    headline: "Validation to build-ready in one session",
    body: "The only validation platform with a built-in Kanban sprint board. Your validated features become actionable development tasks — drag, prioritize, and export to Linear, Jira, or Notion.",
  },
];

// Score Gauge Component (Feature 1 visual)
function ScoreGauge({ visible }: { visible: boolean }) {
  return (
    <div className={`transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="product-mockup p-6 flex flex-col items-center">
        {/* Circular Score */}
        <div className="relative w-[200px] h-[200px]">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="8"
            />
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="#22C55E"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 90 * 0.72} ${2 * Math.PI * 90}`}
              strokeLinecap="round"
              className="transition-all duration-1000"
              style={{ transitionDelay: "300ms" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[56px] font-black text-[#F0F0F0]">72</span>
            <span className="text-[14px] text-[#888888]">/100</span>
          </div>
        </div>
        
        {/* Dimension Bars */}
        <div className="w-full mt-6 space-y-3">
          {[
            { label: "Uniqueness", score: 70 },
            { label: "Market Demand", score: 85 },
            { label: "Stickiness", score: 75 },
            { label: "Monetization", score: 80 },
            { label: "Scalability", score: 78 },
            { label: "Complexity", score: 65 },
          ].map((dim) => (
            <div key={dim.label} className="flex items-center gap-3">
              <span className="text-[12px] text-[#888888] w-[100px]">{dim.label}</span>
              <div className="flex-1 h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#22C55E] rounded-full transition-all duration-700"
                  style={{ width: visible ? `${dim.score}%` : "0%", transitionDelay: `${400 + Math.random() * 200}ms` }}
                />
              </div>
              <span className="text-[12px] text-[#F0F0F0] w-[30px] text-right">{dim.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Market Visualization (Feature 2 visual)
function MarketVisual({ visible }: { visible: boolean }) {
  return (
    <div className={`transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="product-mockup p-6">
        <div className="flex items-end justify-center gap-4 h-[280px]">
          {/* TAM */}
          <div className="flex flex-col items-center">
            <div className="text-[11px] text-[#888888] mb-2">TAM</div>
            <div 
              className="w-[120px] bg-[#1A1A1A] border border-white/[0.08] rounded-t-lg relative overflow-hidden transition-all duration-700"
              style={{ height: visible ? "240px" : "0px", transitionDelay: "200ms" }}
            >
              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-[20px] font-bold text-[#F0F0F0]">$2.4B</div>
                <div className="text-[11px] text-[#888888]">Total Available</div>
              </div>
            </div>
          </div>
          
          {/* SAM */}
          <div className="flex flex-col items-center">
            <div className="text-[11px] text-[#888888] mb-2">SAM</div>
            <div 
              className="w-[100px] bg-[#6C47FF]/20 border border-[#6C47FF]/30 rounded-t-lg relative overflow-hidden transition-all duration-700"
              style={{ height: visible ? "160px" : "0px", transitionDelay: "350ms" }}
            >
              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-[18px] font-bold text-[#F0F0F0]">$180M</div>
                <div className="text-[11px] text-[#888888]">Serviceable</div>
              </div>
            </div>
          </div>
          
          {/* SOM */}
          <div className="flex flex-col items-center">
            <div className="text-[11px] text-[#888888] mb-2">SOM</div>
            <div 
              className="w-[80px] bg-[#22C55E]/20 border border-[#22C55E]/30 rounded-t-lg relative overflow-hidden transition-all duration-700"
              style={{ height: visible ? "80px" : "0px", transitionDelay: "500ms" }}
            >
              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-[16px] font-bold text-[#F0F0F0]">$6M</div>
                <div className="text-[11px] text-[#888888]">Obtainable</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Kanban Board (Feature 3 visual)
function KanbanVisual({ visible }: { visible: boolean }) {
  const columns = [
    { title: "Backlog", count: 4, color: "#888888" },
    { title: "In Progress", count: 2, color: "#EAB308" },
    { title: "Done", count: 3, color: "#22C55E" },
  ];

  const tasks = [
    { col: 0, title: "Define ICP", sub: "2h", color: "#6C47FF" },
    { col: 0, title: "Auth flow", sub: "2d", color: "#6C47FF" },
    { col: 0, title: "Core workflow", sub: "1w", color: "#6C47FF" },
    { col: 0, title: "Integrations", sub: "3d", color: "#888888" },
    { col: 1, title: "API routes", sub: "In review", color: "#EAB308" },
    { col: 1, title: "Dashboard UI", sub: "Today", color: "#EAB308" },
    { col: 2, title: "Design system", sub: "Done", color: "#22C55E" },
    { col: 2, title: "Landing page", sub: "Done", color: "#22C55E" },
    { col: 2, title: "Auth setup", sub: "Done", color: "#22C55E" },
  ];

  return (
    <div className={`transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="product-mockup p-4">
        <div className="grid grid-cols-3 gap-3">
          {columns.map((col, colIndex) => (
            <div key={col.title} className="bg-[#0A0A0A] rounded-lg p-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-semibold text-[#F0F0F0]">{col.title}</span>
                <span className="text-[11px] text-[#888888]">{col.count}</span>
              </div>
              <div className="space-y-2">
                {tasks
                  .filter((t) => t.col === colIndex)
                  .map((task, i) => (
                    <div
                      key={task.title}
                      className="bg-[#111111] border border-white/[0.06] rounded-md p-2.5 transition-all duration-500"
                      style={{ 
                        transitionDelay: `${200 + colIndex * 100 + i * 50}ms`,
                        opacity: visible ? 1 : 0,
                        transform: visible ? "translateY(0)" : "translateY(10px)"
                      }}
                    >
                      <div className="text-[12px] text-[#F0F0F0] mb-1">{task.title}</div>
                      <div className="flex items-center gap-1.5">
                        <div 
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: task.color }}
                        />
                        <span className="text-[10px] text-[#888888]">{task.sub}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Features() {
  const [visibleSections, setVisibleSections] = useState<boolean[]>([false, false, false]);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = sectionRefs.current.map((ref, index) => {
      if (!ref) return null;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => {
              const next = [...prev];
              next[index] = true;
              return next;
            });
            observer.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      
      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((obs) => obs?.disconnect());
    };
  }, []);

  const FeatureBlock = ({ 
    feature, 
    index, 
    reversed 
  }: { 
    feature: Feature; 
    index: number; 
    reversed: boolean;
  }) => {
    const visible = visibleSections[index];
    
    const TextContent = () => (
      <div className={`space-y-4 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <span className="section-label">{feature.label}</span>
        <h3 className="text-[36px] font-bold text-[#F0F0F0] leading-tight">
          {feature.headline}
        </h3>
        <p className="text-[16px] text-[#888888] leading-[1.7] max-w-[480px]">
          {feature.body}
        </p>
      </div>
    );

    const VisualContent = () => {
      if (index === 0) return <ScoreGauge visible={visible} />;
      if (index === 1) return <MarketVisual visible={visible} />;
      return <KanbanVisual visible={visible} />;
    };

    return (
      <div
        ref={(el) => { sectionRefs.current[index] = el; }}
        className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center py-24 ${
          index > 0 ? "border-t border-white/[0.06]" : ""
        }`}
      >
        {reversed ? (
          <>
            <VisualContent />
            <TextContent />
          </>
        ) : (
          <>
            <TextContent />
            <VisualContent />
          </>
        )}
      </div>
    );
  };

  // Purple divider component
  const PurpleDivider = () => (
    <div className="h-[200px] relative overflow-hidden">
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[200px]"
        style={{
          background: "radial-gradient(ellipse 50% 100% at 50% 50%, rgba(108, 71, 255, 0.08) 0%, transparent 70%)"
        }}
      />
    </div>
  );

  return (
    <section id="features" className="bg-[#0A0A0A]">
      <div className="max-w-[1200px] mx-auto px-5">
        {FEATURES.map((feature, index) => (
          <div key={feature.label}>
            {index > 0 && <PurpleDivider />}
            <FeatureBlock 
              feature={feature} 
              index={index} 
              reversed={index % 2 === 1}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
