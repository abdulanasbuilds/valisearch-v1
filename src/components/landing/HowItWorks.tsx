import { useEffect, useRef } from "react";

const STEPS = [
  {
    n: "01",
    title: "Paste your idea",
    body: "Describe what you want to build in plain language. No pitch deck needed — one paragraph is enough.",
    detail: "~10s",
  },
  {
    n: "02",
    title: "AI runs the analysis",
    body: "Six independent agents evaluate market demand, competition, risks, revenue potential, and go-to-market fit.",
    detail: "~20s",
  },
  {
    n: "03",
    title: "Read your blueprint",
    body: "An eighteen-section report with a viability score, strategy recommendations, and a monetization plan.",
    detail: "Instant",
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

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
    <section id="how-it-works" ref={sectionRef} className="border-t border-white/[0.04] py-24 md:py-36">
      <div className="max-w-[1120px] mx-auto px-5 md:px-6">
        <div className="grid md:grid-cols-[1fr_480px] gap-14 lg:gap-20 items-start">

          {/* Left: headline */}
          <div className="md:sticky md:top-28">
            <div className="reveal flex items-center gap-2.5 mb-6">
              <div className="h-px w-5 bg-white/12" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/20">
                How it works
              </span>
            </div>

            <h2 className="reveal reveal-delay-1 text-[clamp(1.8rem,4.5vw,3.2rem)] font-black text-white leading-[1.06] tracking-[-0.04em] mb-5">
              From raw idea to<br className="hidden md:block" />
              investor-ready{" "}
              <span className="font-serif-display font-normal text-white/35">report.</span>
            </h2>

            <p className="reveal reveal-delay-2 text-[14px] leading-[1.8] text-white/28 max-w-[320px]">
              Three steps. Thirty seconds. A report that would take a consultant weeks to produce.
            </p>

            <div className="reveal reveal-delay-3 mt-8 inline-flex items-center gap-2 px-3.5 py-[7px] rounded-lg border border-white/[0.06] bg-white/[0.015]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" />
              <span className="text-[11px] font-medium text-white/30">Total time: ~30 seconds</span>
            </div>
          </div>

          {/* Right: steps */}
          <div className="reveal reveal-delay-1 relative">
            <div className="absolute left-[19px] top-5 bottom-5 w-px bg-white/[0.05]">
              <div className="step-line w-full h-full bg-white/15" />
            </div>

            <div className="flex flex-col gap-0">
              {STEPS.map((step, i) => (
                <div key={step.n} className="relative flex gap-5 pb-8 last:pb-0 group">
                  <div className="shrink-0 relative z-10 mt-0.5">
                    <div className="w-[38px] h-[38px] rounded-full border border-white/[0.08] bg-background flex items-center justify-center transition-all duration-300 group-hover:border-white/15 group-hover:bg-white/[0.03]">
                      <span className="text-[9.5px] font-mono font-bold text-white/22 group-hover:text-white/42 transition-colors">
                        {step.n}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <h3 className="text-[14px] font-semibold text-white/65 group-hover:text-white/85 transition-colors duration-200">
                        {step.title}
                      </h3>
                      <span className="text-[10px] font-medium text-white/15 border border-white/[0.06] rounded-full px-2 py-0.5">
                        {step.detail}
                      </span>
                    </div>
                    <p className="text-[12.5px] leading-[1.75] text-white/25">{step.body}</p>
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
