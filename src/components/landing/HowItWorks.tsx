import { useEffect, useRef, useState } from "react";

interface Step {
  number: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "Describe your idea",
    description: "Type your startup concept in plain English. No template, no form. Just your idea.",
  },
  {
    number: "02",
    title: "AI analyzes everything",
    description: "Our multi-model AI runs 18 simultaneous analysis modules — market, competitors, product, revenue, branding, and more.",
  },
  {
    number: "03",
    title: "Get your intelligence report",
    description: "A complete 18-section dashboard appears. Score, strategy, sprint board — ready in 30 seconds.",
  },
  {
    number: "04",
    title: "Build with confidence",
    description: "Export to Lovable, Bubble, or 10Web. Or download your PDF report for investors.",
  },
];

export function HowItWorks() {
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
    <section
      id="how-it-works"
      ref={ref}
      className="py-28 bg-[#0A0A0A]"
    >
      <div className="max-w-[1200px] mx-auto px-5">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className={`transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="section-label">How it Works</span>
          </div>
          <h2
            className={`mt-4 text-[48px] font-bold text-[#F0F0F0] leading-tight max-w-[600px] mx-auto transition-all duration-700 delay-100 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            From idea to intelligence in 3 steps
          </h2>
        </div>

        {/* Steps */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
            {STEPS.map((step, index) => (
              <div
                key={step.number}
                className={`relative transition-all duration-700 ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                {/* Step Number */}
                <div className="relative mb-3">
                  <span className="step-number">{step.number}</span>
                  {/* Connecting line - hidden on mobile */}
                  {index < STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-[10px] left-[40px] w-[calc(100%-20px)] h-[1px] bg-white/[0.08]" />
                  )}
                </div>

                {/* Content */}
                <h3 className="step-title">{step.title}</h3>
                <p className="step-body">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
