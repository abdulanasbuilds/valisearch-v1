import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = ref.current?.querySelectorAll<HTMLElement>(".reveal") ?? [];
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) (e.target as HTMLElement).classList.add("visible");
      }),
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToInput = () => {
    const el = document.getElementById("idea-input");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => el.focus(), 500);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section id="pricing" ref={ref} className="border-t border-white/[0.04] py-28 md:py-40 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 50% 45% at 30% 80%, hsl(248 84% 67% / 0.035) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-[1120px] mx-auto px-5 md:px-6">
        <div className="max-w-[640px]">
          <div className="reveal flex items-center gap-2.5 mb-9">
            <div className="h-px w-5 bg-white/12" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/20">
              Free to start · No credit card
            </span>
          </div>

          <h2 className="reveal reveal-delay-1 text-[clamp(2.2rem,5.5vw,4.2rem)] font-black text-white leading-[1.04] tracking-[-0.04em] mb-7">
            Stop guessing.
            <br />
            <span className="font-serif-display font-normal text-white/35">Start knowing.</span>
          </h2>

          <p className="reveal reveal-delay-2 text-[15px] leading-[1.8] text-white/28 max-w-[400px] mb-9">
            Join 12,000 founders who validate ideas before spending months building the wrong thing.
          </p>

          <div className="reveal reveal-delay-3 flex flex-col sm:flex-row items-start gap-3.5">
            <button
              data-testid="button-cta-try"
              onClick={scrollToInput}
              className="group flex items-center gap-2 px-5 py-2.5 rounded-lg bg-foreground text-background text-[13px] font-semibold hover:bg-foreground/90 transition-all duration-200 active:scale-[0.97]"
            >
              Try ValiSearch free
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>

            <div className="flex items-center gap-4 sm:ml-1">
              {["No signup", "~30s results", "100% free"].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <div className="w-[3px] h-[3px] rounded-full bg-white/15" />
                  <span className="text-[11.5px] font-medium text-white/22">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
