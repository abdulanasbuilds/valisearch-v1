export function AnnouncementBar() {
  return (
    <div className="w-full border-b border-white/[0.06] bg-[#0A0A0A]/60 backdrop-blur-sm relative z-[99]">
      <div className="section-container py-2.5 flex items-center justify-center gap-3 text-[13px]">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#6C47FF] text-white text-[10px] font-bold tracking-wider uppercase">
          New
        </span>
        <span className="text-[#888888]">
          ValiSearch now validates 18 dimensions of your idea
        </span>
        <a
          href="#features"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="text-white hover:text-[#6C47FF] transition-colors font-medium"
        >
          See what's new →
        </a>
      </div>
    </div>
  );
}
