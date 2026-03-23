import { useEffect, useRef } from "react";

const STEPS = [
  {
    n: "01",
    title: "Paste your idea",
    body: "Describe what you want to build in plain language. No pitch deck, no jargon — just the core concept. One paragraph is enough.",
    detail: "~10 seconds",
  },
  {
    n: "02",
    title: "AI runs the analysis",
    body: "Six independent agents evaluate market demand, competitive landscape, risks, revenue potential, and go-to-market fit in parallel.",
    detail: "~20 seconds",
  },
  {
    n: "03",
    title: "Read your blueprint",
    body: "An eight-section report with a viability score, strategy recommendations, and a monetization plan you can act on today.",
    detail: "Instant",
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reveals = section.querySelectorAll<HTMLElement>(".reveal, .step-line");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) (e.target as HTMLElement).classList.add("visible");
      }),
      { threshold: 0.08 }
    );
    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="border-t border-white/[0.05] py-28 md:py-36">
      <div className="max-w-6xl mx-auto px-5 md:px-8">

        <div className="grid md:grid-cols-[1fr_520px] gap-16 items-start">

          {/* Left: headline */}
          <div className="md:sticky md:top-28">
            <div className="reveal flex items-center gap-3 mb-7">
              <div className="h-px w-7 bg-white/15" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/25">
                How it works
              </span>
            </div>

            <h2 className="reveal reveal-delay-1 text-[clamp(2rem,4.5vw,3.6rem)] font-black text-white leading-[1.06] tracking-[-0.035em] mb-6">
              From raw idea to<br />
              investor-ready{" "}
              <span className="font-serif-display font-normal text-white/42">report.</span>
            </h2>

            <p className="reveal reveal-delay-2 text-[15px] leading-[1.85] text-white/34 max-w-[340px]">
              Three steps. Thirty seconds. A report that would take a consultant three weeks to produce.
            </p>

            {/* Time indicator */}
            <div className="reveal reveal-delay-3 mt-10 inline-flex items-center gap-2.5 px-4 py-2 rounded-lg border border-white/[0.07] bg-white/[0.025]">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400/70" />
              <span className="text-[12px] font-medium text-white/40">Total time: ~30 seconds</span>
            </div>
          </div>

          {/* Right: steps with animated connector */}
          <div className="reveal reveal-delay-1 relative">
            {/* Vertical connecting line */}
            <div className="absolute left-[22px] top-6 bottom-6 w-px bg-white/[0.07]">
              <div ref={lineRef} className="step-line w-full h-full bg-white/20" />
            </div>

            <div className="flex flex-col gap-0">
              {STEPS.map((step, i) => (
                <div
                  key={step.n}
                  className="relative flex gap-6 pb-10 last:pb-0 group"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {/* Step dot */}
                  <div className="shrink-0 relative z-10 mt-0.5">
                    <div className="w-[44px] h-[44px] rounded-full border border-white/[0.1] bg-[#0A0A0A] flex items-center justify-center transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/[0.04]">
                      <span className="text-[10px] font-mono font-bold text-white/28 group-hover:text-white/50 transition-colors">
                        {step.n}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-2.5">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-[15px] font-semibold text-white/75 group-hover:text-white/90 transition-colors duration-200">
                        {step.title}
                      </h3>
                      <span className="text-[10.5px] font-medium text-white/20 border border-white/[0.07] rounded-full px-2 py-0.5">
                        {step.detail}
                      </span>
                    </div>
                    <p className="text-[13.5px] leading-[1.8] text-white/30">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
