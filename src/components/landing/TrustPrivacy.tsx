import { useEffect, useRef, useState } from "react";
import { Lock, Eye, Trash2 } from "lucide-react";

interface TrustPoint {
  icon: typeof Lock;
  label: string;
  description: string;
}

const TRUST_POINTS: TrustPoint[] = [
  {
    icon: Lock,
    label: "End-to-end encryption",
    description: "Your ideas are encrypted at rest and in transit.",
  },
  {
    icon: Eye,
    label: "Zero data training",
    description: "We never use your ideas to train AI models.",
  },
  {
    icon: Trash2,
    label: "Delete any time",
    description: "Full data deletion on request, no questions asked.",
  },
];

export function TrustPrivacy() {
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
        <div className="text-center mb-16">
          <h2
            className={`text-[48px] font-bold text-[#F0F0F0] leading-tight transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Your idea stays yours.
          </h2>
          <p
            className={`mt-4 text-[18px] text-[#888888] max-w-[500px] mx-auto transition-all duration-700 delay-100 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            ValiSearch never trains AI models on your idea. Your validation data is encrypted, private, and belongs only to you. Delete it any time.
          </p>
        </div>

        {/* Trust Points */}
        <div className="grid md:grid-cols-3 gap-12 max-w-[900px] mx-auto">
          {TRUST_POINTS.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={point.label}
                className={`text-center transition-all duration-700 ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                <div className="flex justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#888888]" />
                </div>
                <h3 className="text-[16px] font-semibold text-[#F0F0F0] mb-2">
                  {point.label}
                </h3>
                <p className="text-[14px] text-[#888888]">
                  {point.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
