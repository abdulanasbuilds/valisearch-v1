import { useEffect, useRef, useState } from "react";

interface StatItem {
  value: string;
  label: string;
}

const STATS: StatItem[] = [
  { value: "10,000+", label: "Ideas validated" },
  { value: "30 sec", label: "Average analysis time" },
  { value: "18", label: "Intelligence dimensions" },
];

export function StatsBar() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="w-full bg-[rgba(255,255,255,0.02)] border-y border-white/[0.06] py-10"
    >
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="grid grid-cols-3 divide-x divide-white/[0.06]">
          {STATS.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center px-8 transition-all duration-700 ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="stat-number">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
