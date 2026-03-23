import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  const navigate = useNavigate();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = ref.current?.querySelectorAll<HTMLElement>(".reveal, .text-reveal") ?? [];
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) (e.target as HTMLElement).classList.add("visible");
      }),
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="pricing" ref={ref} className="border-t border-white/[0.05] py-28 md:py-44 relative overflow-hidden">
      {/* Background: extremely subtle gradient wash at the bottom center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 55% 50% at 30% 80%, rgba(99,102,241,0.045) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-5 md:px-8">
        <div className="max-w-[700px]">
          <div className="reveal flex items-center gap-3 mb-11">
            <div className="h-px w-7 bg-white/15" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/25">
              Free to start · No credit card
            </span>
          </div>

          <h2 className="text-[clamp(2.6rem,6vw,5rem)] font-black text-white leading-[1.03] tracking-[-0.04em] mb-8">
            <span className="text-reveal-wrap">
              <span className="text-reveal">Stop guessing.</span>
            </span>
            <span className="text-reveal-wrap">
              <span className="text-reveal text-reveal-delay-1">
                <span className="font-serif-display font-normal text-white/42">Start knowing.</span>
              </span>
            </span>
          </h2>

          <p className="reveal reveal-delay-2 text-[16px] leading-[1.85] text-white/34 max-w-[440px] mb-11">
            Join 12,000 founders who validate ideas before spending months building the wrong thing.
          </p>

          <div className="reveal reveal-delay-3 flex flex-col sm:flex-row items-start gap-4">
            <button
              data-testid="button-cta-try"
              onClick={() => {
                navigate("/");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group flex items-center gap-2.5 px-6 py-3 rounded-lg bg-white text-black text-[14px] font-semibold hover:bg-white/90 transition-all duration-150 active:scale-[0.97] shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
            >
              Try ValiSearch free
              <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
            </button>

            <div className="sm:flex hidden items-center self-center">
              <div className="h-7 w-px bg-white/[0.08] mx-1" />
            </div>

            <div className="flex items-center gap-5">
              {["No signup", "~30s results", "100% free"].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-[12.5px] font-medium text-white/28">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
