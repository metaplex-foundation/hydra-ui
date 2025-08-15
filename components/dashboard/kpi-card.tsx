import * as React from "react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  label: React.ReactNode;
  value: React.ReactNode;
  subLabel?: string;
  emphasis?: boolean; // legacy emphasis boolean
  action?: React.ReactNode;
  loading?: boolean;
  size?: 'primary' | 'secondary';
  className?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  subLabel,
  emphasis,
  action,
  loading,
  size = 'secondary',
  className,
}) => {
  const isPrimary = size === 'primary' || emphasis;
  return (
    <div
      className={cn(
        "glass-panel relative flex flex-col gap-3 transition-all duration-200 hover:scale-[1.01] hover:shadow-lg",
        isPrimary ? "p-6 sm:p-7" : "p-5",
        isPrimary 
          ? "bg-gradient-to-br from-[var(--color-accent)]/8 to-[var(--color-accent)]/3 border-[var(--color-accent)]/20 shadow-[0_0_0_1px_var(--color-accent-ring),0_8px_32px_-6px_var(--glow-accent-soft)]" 
          : "bg-white/[0.02] hover:bg-white/[0.03]",
        className
      )}
      data-elev={isPrimary ? 3 : 2}
    >
      {/* Background gradient accent for primary cards */}
      {isPrimary && (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 via-transparent to-[var(--color-accent)]/10 rounded-[inherit] pointer-events-none" />
      )}
      
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className={cn(
          "text-[11px] uppercase tracking-[1.4px] font-bold leading-none",
          isPrimary ? "text-[var(--color-accent)]/90" : "text-[var(--text-color-muted)]/80"
        )}>
          {label}
        </div>
        {action}
      </div>
      
      <div className="relative z-10 space-y-1">
        <div className={cn(
          "font-bold tabular-nums font-heading drop-shadow-sm",
          isPrimary 
            ? "text-[2.2rem] leading-none bg-gradient-to-br from-white to-white/80 bg-clip-text text-transparent" 
            : "text-2xl text-white"
        )}>
          {value}
        </div>
        {subLabel && (
          <div className={cn(
            "text-[11px] font-medium",
            isPrimary ? "text-[var(--color-accent)]/70" : "text-[var(--text-color-muted)]"
          )}>
            {subLabel}
          </div>
        )}
      </div>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-[var(--text-color-muted)] bg-black/30 backdrop-blur-sm">
          Loading…
        </div>
      )}
    </div>
  );
};
