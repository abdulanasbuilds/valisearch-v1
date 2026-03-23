import { useEffect, useRef } from "react";
import { MessageSquare, Cpu, LayoutDashboard } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: MessageSquare,
    title: "Describe your idea",
    description: "Write a few sentences about what you want to build. No business jargon or fancy pitch decks needed.",
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/25",
    glow: "shadow-[0_0_40px_rgba(139,92,246,0.25)]",
  },
  {
    num: "02",
    icon: Cpu,
    title: "AI runs the analysis",
    description: "Six specialized agents evaluate market demand, competitor landscape, risks, and opportunities in parallel.",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/25",
    glow: "shadow-[0_0_40px_rgba(59,130,246,0.25)]",
  },
  {
    num: "03",
    icon: LayoutDashboard,
    title: "Get your blueprint",
    description: "A full structured report — validation score, strategy, branding, and a monetization plan ready to act on.",
    color: "text-pink-400",
    bg: "bg-pink-500/10 border-pink-500/25",
    glow: "shadow-[0_0_40px_rgba(236,72,153,0.25)]",
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const els = section.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) (e.target as HTMLElement).classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="py-28 sm:py-36 border-t border-white/[0.06]">
      <div className="orb orb-blue absolute right-0 w-[500px] h-[500px] opacity-15 translate-x-1/3" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-xl mx-auto text-center mb-20 reveal">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-[12px] text-blue-400 font-medium mb-5">
            Dead simple
          </div>
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-black tracking-[-0.03em] text-white leading-[1.08]">
            From idea to report
            <br />
            <span className="gradient-text">in three steps</span>
          </h2>
          <p className="mt-5 text-[16px] leading-[1.75] text-white/45">
            No complex setup. No expertise required. Just describe what you want to build.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid gap-8 lg:grid-cols-3">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-[52px] left-[calc(16.67%+32px)] right-[calc(16.67%+32px)] h-px bg-gradient-to-r from-violet-500/30 via-blue-500/30 to-pink-500/30" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className={`reveal reveal-delay-${i + 1} relative group`}
              >
                <div className={`glass-card rounded-2xl p-8 hover:${step.glow} transition-all duration-500 hover:-translate-y-1`}>
                  {/* Number */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`relative flex items-center justify-center w-14 h-14 rounded-xl border ${step.bg} group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className={`h-6 w-6 ${step.color}`} />
                    </div>
                    <span className={`text-[13px] font-mono font-bold ${step.color} opacity-50`}>
                      {step.num}
                    </span>
                  </div>

                  <h3 className="text-[17px] font-bold text-white mb-3 tracking-[-0.01em]">
                    {step.title}
                  </h3>
                  <p className="text-[14px] leading-[1.75] text-white/40 group-hover:text-white/55 transition-colors duration-300">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
