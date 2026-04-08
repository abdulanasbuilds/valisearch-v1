export function StatsBar() {
  const stats = [
    { value: "10,000+", label: "Ideas validated" },
    { value: "30 sec", label: "Average analysis time" },
    { value: "18", label: "Intelligence dimensions" },
  ];

  return (
    <div className="w-full bg-white/[0.02] border-y border-white/[0.06] py-12">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className={`flex flex-col gap-2 items-center md:items-start ${
                i !== 0 ? 'md:border-l md:border-white/[0.06] md:pl-16' : ''
              }`}
            >
              <div className="text-[48px] font-black leading-none text-[#F0F0F0]">
                {stat.value}
              </div>
              <div className="text-[14px] text-[#888888] font-medium tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
