import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export function FinalCTA() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-32 bg-[#0A0A0A] relative overflow-hidden">
      {/* Purple glow behind headline */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '800px',
          height: '400px',
          background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(108, 71, 255, 0.08) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-[1200px] mx-auto px-5 relative z-10">
        <div className="text-center">
          <h2
            className={`text-[64px] font-bold text-[#F0F0F0] leading-tight transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Ready to stop guessing?
          </h2>
          <p
            className={`mt-6 text-[18px] text-[#888888] transition-all duration-700 delay-100 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Join thousands of founders who validated before they built.
          </p>

          {/* Buttons */}
          <div
            className={`flex flex-wrap justify-center gap-4 mt-10 transition-all duration-700 delay-200 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <button 
              onClick={() => navigate("/analyze")}
              className="btn-primary"
            >
              Validate my idea free
            </button>
            <button 
              onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-ghost"
            >
              See pricing →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
