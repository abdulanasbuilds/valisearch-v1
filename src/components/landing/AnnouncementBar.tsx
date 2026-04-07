export function AnnouncementBar() {
  return (
    <div className="w-full bg-[#0A0A0A] border-b border-white/[0.04] py-3">
      <div className="max-w-[1200px] mx-auto px-5 flex items-center justify-center gap-3">
        <span className="px-2 py-0.5 bg-[#6C47FF] text-white text-[11px] font-semibold rounded">
          NEW
        </span>
        <span className="text-[13px] text-[#888888]">
          ValiSearch now validates 18 dimensions of your idea
        </span>
        <a 
          href="#features" 
          className="text-[13px] text-[#F0F0F0] font-medium hover:underline flex items-center gap-1"
        >
          See what's new
          <span>→</span>
        </a>
      </div>
    </div>
  );
}
