import { motion } from "framer-motion";

export function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "0",
      sub: "Forever free, no credit card",
      features: ["3 analyses per month", "15 analysis sections", "Competitor snapshot", "Market overview", "Shareable score card"],
      button: "Start free",
      featured: false
    },
    {
      name: "Pro",
      price: "29",
      sub: "per month, billed monthly",
      features: ["20 analyses per month", "All 18 analysis sections", "Full competitor intelligence", "Revenue projections", "Branding generator", "PDF & DOCX export", "Kanban sprint board", "Idea history & memory"],
      button: "Get started",
      featured: true
    },
    {
      name: "Premium",
      price: "79",
      sub: "per month, billed monthly",
      features: ["Unlimited analyses", "Multi-agent AI mode", "Build Mode (dev blueprint)", "API access", "White-label reports", "Priority processing"],
      button: "Get Premium",
      featured: false
    }
  ];

  return (
    <section id="pricing" className="py-32 bg-[#0A0A0A]">
      <div className="section-container">
        <div className="text-center mb-20">
          <span className="label-allcaps mb-4 block">PRICING</span>
          <h2 className="section-headline text-[#F0F0F0]">Simple, honest pricing</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div 
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 border ${
                plan.featured 
                ? 'bg-[#111111] border-[#6C47FF]/40 shadow-[0_20px_40px_rgba(108,71,255,0.1)]' 
                : 'bg-[#111111] border-white/[0.08]'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#6C47FF] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <div className={`text-[12px] font-bold uppercase tracking-[0.2em] mb-4 ${plan.featured ? 'text-[#6C47FF]' : 'text-white/30'}`}>
                {plan.name}
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-[48px] font-black text-[#F0F0F0] tracking-tighter">${plan.price}</span>
              </div>
              <p className="text-[13px] text-[#888888] mb-8">{plan.sub}</p>
              
              <div className="h-[1px] w-full bg-white/[0.06] mb-8" />

              <ul className="space-y-4 mb-10">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-3 text-[14px] text-white/60">
                    <span className="text-[#6C47FF] mt-0.5">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-xl text-[15px] font-bold transition-all ${
                plan.featured 
                ? 'bg-[#6C47FF] hover:bg-[#7C5AFF] text-white' 
                : 'border border-white/10 hover:border-white/20 text-white'
              }`}>
                {plan.button}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
