import { motion } from "framer-motion";

export function Integrations() {
  const integrations = [
    "OpenAI", "Supabase", "Stripe", "Groq", "Gemini",
    "Lovable", "Bubble", "10Web", "Notion", "Slack"
  ];

  return (
    <section className="py-32 bg-[#0A0A0A]">
      <div className="section-container text-center">
        <span className="label-allcaps mb-4 block">INTEGRATIONS</span>
        <h2 className="section-headline text-[#F0F0F0] mb-6">Works with your entire stack</h2>
        <p className="text-[16px] text-[#888888] max-w-[500px] mx-auto mb-16">
          ValiSearch connects to the tools you already use and exports directly to the builders you build with.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {integrations.map((name, i) => (
            <motion.div 
              key={name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ borderColor: "rgba(255,255,255,0.15)", backgroundColor: "rgba(255,255,255,0.05)" }}
              className="px-6 py-8 rounded-xl border border-white/[0.06] bg-white/[0.03] flex flex-col items-center gap-3 cursor-default transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-white/[0.05] flex items-center justify-center text-[10px] font-bold text-white/40 border border-white/[0.08]">
                {name[0]}
              </div>
              <span className="text-[13px] font-semibold text-white/70">{name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrustPrivacy() {
  const points = [
    {
      icon: "🔒",
      title: "End-to-end encryption",
      body: "Your ideas are encrypted at rest and in transit using industry-standard AES-256."
    },
    {
      icon: "👁",
      title: "Zero data training",
      body: "We never use your ideas or reports to train our AI models. Private by design."
    },
    {
      icon: "🗑",
      title: "Delete any time",
      body: "Full data deletion on request. Your intelligence remains your asset alone."
    }
  ];

  return (
    <section className="py-32 border-t border-white/[0.06]">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="section-headline text-[#F0F0F0] mb-4">Your idea stays yours.</h2>
          <p className="text-[16px] text-[#888888] max-w-[500px] mx-auto">
            ValiSearch is built on a foundation of intellectual property protection.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {points.map((p, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-[20px] mb-6 grayscale opacity-60">{p.icon}</div>
              <h3 className="text-[16px] font-semibold text-[#F0F0F0] mb-2">{p.title}</h3>
              <p className="text-[14px] text-[#888888] leading-relaxed">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
