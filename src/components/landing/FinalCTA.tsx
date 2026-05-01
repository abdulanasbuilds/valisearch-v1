import { useNavigate } from "react-router-dom";

export function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="py-32 md:py-40 relative overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: "900px",
          height: "500px",
          background:
            "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(108,71,255,0.10) 0%, transparent 70%)",
        }}
      />
      <div className="section-container relative z-10 text-center">
        <h2
          className="text-[44px] md:text-[64px] font-extrabold text-[#F0F0F0] tracking-tight leading-[1.05] mb-6"
          style={{ letterSpacing: "-0.03em" }}
        >
          Ready to stop guessing?
        </h2>
        <p className="text-[18px] text-[#888888] mb-10 max-w-[520px] mx-auto leading-[1.6]">
          Join thousands of founders who validated before they built.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate("/register")}
            className="bg-[#6C47FF] hover:bg-[#7C5AFF] text-white text-[16px] font-semibold px-7 py-3.5 rounded-lg transition-colors"
          >
            Validate my idea free
          </button>
          <button
            onClick={() =>
              document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
            }
            className="border border-white/[0.15] hover:border-white/30 text-[#F0F0F0] text-[16px] font-medium px-7 py-3.5 rounded-lg transition-colors"
          >
            See pricing →
          </button>
        </div>
      </div>
    </section>
  );
}
