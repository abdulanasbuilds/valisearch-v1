import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  const navigate = useNavigate();
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
    <section id="pricing" ref={sectionRef} className="py-28 sm:py-40 border-t border-white/[0.06] relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb orb-purple absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-25" />
      <div className="orb orb-pink absolute top-1/3 right-0 w-[400px] h-[400px] opacity-15" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <div className="reveal">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/25 bg-violet-500/10 text-[12px] text-violet-400 font-medium mb-8">
            <Sparkles className="h-3.5 w-3.5" />
            Free forever · No credit card
          </div>
        </div>

        <h2 className="text-[clamp(2.4rem,6vw,5rem)] font-black tracking-[-0.04em] text-white leading-[1.04] reveal reveal-delay-1">
          Stop guessing.
          <br />
          <span className="gradient-text-warm">Start validating.</span>
        </h2>

        <p className="mt-6 text-[17px] leading-[1.75] text-white/45 max-w-lg mx-auto reveal reveal-delay-2">
          Join 12,000+ founders who validate startup ideas before investing months of their lives building the wrong thing.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 reveal reveal-delay-3">
          <button
            data-testid="button-cta-try"
            onClick={() => {
              navigate("/");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="glow-btn group flex items-center gap-2 px-8 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-[16px] font-semibold transition-all duration-200 shadow-[0_0_40px_rgba(139,92,246,0.45)] hover:shadow-[0_0_60px_rgba(139,92,246,0.65)] hover:scale-[1.03]"
          >
            Try ValiSearch — it's free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Social proof mini */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 reveal reveal-delay-4">
          {[
            "✓ No signup required",
            "✓ Results in 30 seconds",
            "✓ 8-section report",
            "✓ AI-powered",
          ].map((item) => (
            <span key={item} className="text-[13px] text-white/25 font-medium">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
