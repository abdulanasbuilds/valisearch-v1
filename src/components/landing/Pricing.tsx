import { Check } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { useNavigate } from "react-router-dom";
import { LS_STORE_URL, LS_PRO_VARIANT_ID, LS_PREMIUM_VARIANT_ID } from "@/lib/constants";

const PLANS = [
  {
    name: "Starter",
    price: "0",
    sub: "Forever free, no credit card",
    features: [
      "3 analyses per month",
      "15 analysis sections",
      "Competitor snapshot",
      "Market overview",
      "Shareable score card",
    ],
    button: "Start free",
    featured: false,
  },
  {
    name: "Pro",
    price: "29",
    sub: "per month, billed monthly",
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
    button: "Get started",
    featured: true,
  },
  {
    name: "Premium",
    price: "79",
    sub: "per month, billed monthly",
    features: [
      "Everything in Pro",
      "Unlimited analyses",
      "Multi-agent AI mode",
      "Build Mode (dev blueprint)",
      "API access",
      "White-label reports",
      "Priority processing",
    ],
    button: "Get Premium",
    featured: false,
  },
];

export function Pricing() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useUserStore();

  const handlePlanClick = (planName: string) => {
    if (!isAuthenticated) {
      navigate("/register");
      return;
    }
    if (planName === "Starter") {
      navigate("/dashboard");
      return;
    }
    const variantId = planName === "Pro" ? LS_PRO_VARIANT_ID : LS_PREMIUM_VARIANT_ID;
    const checkoutUrl = `${LS_STORE_URL}/checkout/buy/${variantId}?checkout[email]=${user?.email}&checkout[custom][user_id]=${user?.id}`;
    window.open(checkoutUrl, "_blank");
  };

  return (
    <section id="pricing" className="py-32 relative">
      <div className="section-container">
        <div className="text-center mb-16">
          <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6C47FF] mb-5">
            Pricing
          </div>
          <h2
            className="text-[36px] md:text-[48px] font-bold text-[#F0F0F0] tracking-tight leading-[1.1]"
            style={{ letterSpacing: "-0.02em" }}
          >
            Simple, honest pricing
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1100px] mx-auto">
          {PLANS.map((plan) => (
            <div key={plan.name} className="relative">
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#6C47FF] text-white text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded">
                  Most popular
                </div>
              )}
              <div
                className={`h-full rounded-xl bg-[#111111] p-8 border ${
                  plan.featured
                    ? "border-[#6C47FF]/40"
                    : "border-white/[0.08]"
                }`}
              >
                <div
                  className={`text-[14px] uppercase tracking-[0.1em] font-semibold mb-6 ${
                    plan.featured ? "text-[#6C47FF]" : "text-[#888888]"
                  }`}
                >
                  {plan.name}
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-[48px] font-extrabold text-[#F0F0F0] leading-none tracking-tight">
                    ${plan.price}
                  </span>
                </div>
                <div className="text-[13px] text-[#888888] mb-6">{plan.sub}</div>

                <div className="h-px bg-white/[0.08] mb-6" />

                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[14px] text-[#F0F0F0]">
                      <Check
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          plan.featured ? "text-[#6C47FF]" : "text-[#888888]"
                        }`}
                        strokeWidth={2.5}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanClick(plan.name)}
                  className={`w-full py-3 rounded-md text-[14px] font-semibold transition-colors ${
                    plan.featured
                      ? "bg-[#6C47FF] hover:bg-[#7C5AFF] text-white"
                      : "border border-white/[0.15] hover:border-white/30 text-[#F0F0F0]"
                  }`}
                >
                  {plan.button}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
