import { Lock, Eye, Trash2 } from "lucide-react";

const POINTS = [
  {
    icon: Lock,
    label: "End-to-end encryption",
    body: "Your ideas are encrypted at rest and in transit.",
  },
  {
    icon: Eye,
    label: "Zero data training",
    body: "We never use your ideas to train AI models.",
  },
  {
    icon: Trash2,
    label: "Delete any time",
    body: "Full data deletion on request, no questions asked.",
  },
];

export function TrustPrivacy() {
  return (
    <section className="py-32 relative">
      <div
        className="absolute left-1/2 -translate-x-1/2 top-0 w-[800px] h-64 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(108,71,255,0.08) 0%, transparent 70%)",
        }}
      />
      <div className="section-container relative z-10 text-center">
        <h2
          className="text-[36px] md:text-[48px] font-bold text-[#F0F0F0] tracking-tight leading-[1.1] mb-5"
          style={{ letterSpacing: "-0.02em" }}
        >
          Your idea stays yours.
        </h2>
        <p className="text-[17px] text-[#888888] max-w-[560px] mx-auto leading-[1.7]">
          ValiSearch never trains AI models on your idea. Your validation data is
          encrypted, private, and belongs only to you. Delete it any time.
        </p>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-[900px] mx-auto text-left">
          {POINTS.map((p) => (
            <div key={p.label}>
              <p.icon className="w-5 h-5 text-[#888888] mb-4" strokeWidth={1.5} />
              <div className="text-[16px] font-semibold text-[#F0F0F0] mb-2">{p.label}</div>
              <div className="text-[14px] text-[#888888] leading-[1.6]">{p.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
