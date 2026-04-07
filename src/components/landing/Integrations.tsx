import { useEffect, useRef, useState } from "react";

interface Integration {
  name: string;
  color: string;
}

const INTEGRATIONS: Integration[] = [
  { name: "OpenAI", color: "#10A37F" },
  { name: "Supabase", color: "#3ECF8E" },
  { name: "Stripe", color: "#635BFF" },
  { name: "Groq", color: "#F55036" },
  { name: "Gemini", color: "#4285F4" },
  { name: "Lovable", color: "#FF6B6B" },
  { name: "Bubble", color: "#0D47A1" },
  { name: "10Web", color: "#FF7A00" },
  { name: "Notion", color: "#FFFFFF" },
  { name: "Slack", color: "#4A154B" },
];

export function Integrations() {
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

  return (
    <section ref={ref} className="py-28 bg-[#0A0A0A]">
      <div className="max-w-[1200px] mx-auto px-5">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className={`transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="section-label">Integrations</span>
          </div>
          <h2
            className={`mt-4 text-[48px] font-bold text-[#F0F0F0] leading-tight transition-all duration-700 delay-100 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Works with your entire stack
          </h2>
          <p
            className={`mt-4 text-[18px] text-[#888888] max-w-[500px] mx-auto transition-all duration-700 delay-150 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            ValiSearch connects to the tools you already use and exports directly to the builders you build with.
          </p>
        </div>

        {/* Integration Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {INTEGRATIONS.map((integration, index) => (
            <div
              key={integration.name}
              className={`integration-card flex flex-col items-center gap-3 transition-all duration-500 ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${200 + index * 50}ms` }}
            >
              {/* Icon placeholder - in production use actual SVG icons */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-[14px] font-bold"
                style={{ 
                  backgroundColor: `${integration.color}20`,
                  color: integration.color,
                  border: `1px solid ${integration.color}40`
                }}
              >
                {integration.name.charAt(0)}
              </div>
              <span className="text-[13px] font-medium text-[#F0F0F0]">
                {integration.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
