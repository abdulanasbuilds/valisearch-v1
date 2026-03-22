import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface SectionCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function SectionCard({ title, description, children, className, style }: SectionCardProps) {
  return (
    <div className={cn("card-surface rounded-xl p-5", className)} style={style}>
      {title && (
        <div className="mb-4">
          <h3 className="text-[14px] font-semibold">{title}</h3>
          {description && <p className="mt-1 text-[13px] text-muted-foreground">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
