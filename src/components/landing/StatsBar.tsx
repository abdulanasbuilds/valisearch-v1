export function StatsBar() {
  const stats = [
    { value: "10,000+", label: "Ideas validated" },
    { value: "30 sec", label: "Average analysis time" },
    { value: "18", label: "Intelligence dimensions" },
  ];

  return (
    <section
      className="w-full py-10"
      style={{
        background: "rgba(255,255,255,0.02)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center md:items-start ${
                i !== 0 ? "md:border-l md:border-white/[0.06] md:pl-12" : ""
              }`}
            >
              <div className="text-[48px] font-extrabold text-[#F0F0F0] leading-none tracking-tight tabular-nums">
                {stat.value}
              </div>
              <div className="mt-1.5 text-[14px] text-[#888888]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
