import { motion } from "framer-motion";

export function HowItWorks() {
  const steps = [
    {
      no: "01",
      title: "Describe your idea",
      body: "Type your startup concept in plain English. No template, no form. Just your idea."
    },
    {
      no: "02",
      title: "AI analyzes everything",
      body: "Our multi-model AI runs 18 simultaneous analysis modules — market, competitors, product, revenue, branding, and more."
    },
    {
      no: "03",
      title: "Get your report",
      body: "A complete 18-section dashboard appears. Score, strategy, sprint board — ready in 30 seconds."
    },
    {
      no: "04",
      title: "Build with confidence",
      body: "Export to Lovable, Bubble, or 10Web. Or download your PDF report for investors."
    }
  ];

  return (
    <section id="how-it-works" className="py-32">
      <div className="section-container">
        <div className="text-center mb-20">
          <span className="label-allcaps mb-4 block">HOW IT WORKS</span>
          <h2 className="section-headline text-[#F0F0F0] max-w-[600px] mx-auto">
            From idea to intelligence in 3 steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-[13px] left-[100px] right-[100px] h-[1px] bg-white/[0.08]" />
          
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative z-10"
            >
              <div className="text-[13px] font-bold text-[#6C47FF] bg-[#0A0A0A] inline-block pr-4">
                {step.no}
              </div>
              <h3 className="text-[18px] font-semibold text-[#F0F0F0] mt-4 mb-3">
                {step.title}
              </h3>
              <p className="text-[15px] text-[#888888] leading-relaxed">
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
