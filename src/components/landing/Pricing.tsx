import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
}

const PLANS: PricingPlan[] = [
  {
    name: "Starter",
    price: "$0",
    description: "Forever free, no credit card",
    features: [
      "3 analyses per month",
      "15 analysis sections",
      "Competitor snapshot",
      "Market overview",
      "Shareable score card",
    ],
    cta: "Start free",
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month, billed monthly",
    description: "",
    features: [
      "20 analyses per month",
      "All 18 analysis sections",
      "Full competitor intelligence",
      "Revenue projections",
      "Branding generator",
      "PDF & DOCX export",
      "Kanban sprint board",
      "Idea history & memory",
    ],
    cta: "Get started",
    featured: true,
  },
  {
    name: "Premium",
    price: "$79",
    period: "per month, billed monthly",
    description: "",
    features: [
      "Everything in Pro",
      "Unlimited analyses",
      "Multi-agent AI mode",
      "Build Mode (dev blueprint)",
      "API access",
      "White-label reports",
      "Priority processing",
    ],
    cta: "Get Premium",
  },
];

export function Pricing() {
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
    <section id="pricing" ref={ref} className="py-28 bg-[#0A0A0A]">
      <div className="max-w-[1200px] mx-auto px-5">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className={`transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="section-label">Pricing</span>
          </div>
          <h2
            className={`mt-4 text-[48px] font-bold text-[#F0F0F0] leading-tight transition-all duration-700 delay-100 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Simple, honest pricing
          </h2>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative transition-all duration-700 ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              } ${plan.featured ? "pricing-card-featured pricing-card" : "pricing-card"}`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              {/* Featured Badge */}
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#6C47FF] text-white text-[10px] font-bold uppercase tracking-wide rounded">
                  Most Popular
                </div>
              )}

              {/* Plan Name */}
              <div
                className={`text-[14px] font-semibold uppercase tracking-wide mb-4 ${
                  plan.featured ? "text-[#6C47FF]" : "text-[#888888]"
                }`}
              >
                {plan.name}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-2">
                <span className="pricing-price">{plan.price}</span>
              </div>

              {/* Period */}
              {plan.period && (
                <div className="text-[14px] text-[#888888] mb-4">{plan.period}</div>
              )}

              {/* Description */}
              {plan.description && (
                <div className="text-[14px] text-[#888888] mb-4">{plan.description}</div>
              )}

              {/* Divider */}
              <div className="h-px bg-white/[0.06] my-5" />

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#22C55E] mt-0.5 shrink-0" />
                    <span className="text-[14px] text-[#F0F0F0]">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  plan.featured
                    ? "bg-[#6C47FF] text-white hover:bg-[#7C5AFF]"
                    : "bg-transparent border border-white/[0.15] text-[#F0F0F0] hover:border-white/[0.3]"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
