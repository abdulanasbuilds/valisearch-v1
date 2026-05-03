"use client";

import { useEffect, useState } from "react";

interface ScoreDisplayProps {
  score: number;
  maxScore?: number;
  size?: number;
}

export function ScoreDisplay({ score, maxScore = 10, size = 140 }: ScoreDisplayProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const fillPercent = displayScore / maxScore;
  const strokeDashoffset = circumference * (1 - fillPercent);

  useEffect(() => {
    let frame: number;
    const duration = 1200;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(parseFloat((eased * score).toFixed(1)));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const color = score >= 7 ? "hsl(var(--success))" : score >= 5 ? "hsl(var(--warning))" : "hsl(var(--destructive))";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth={5} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={5} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold tabular-nums tracking-tight" style={{ color }}>{displayScore}</span>
        <span className="text-[11px] text-muted-foreground mt-0.5">/ {maxScore}</span>
      </div>
    </div>
  );
}
