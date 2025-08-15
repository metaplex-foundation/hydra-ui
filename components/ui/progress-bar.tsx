import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ProgressBarProps {
  value: number
  max: number
  className?: string
  label?: string
  thickness?: 'xs' | 'sm' | 'md'
  animated?: boolean
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, className, label, thickness='sm', animated=true }) => {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div
      className={cn('relative w-full overflow-hidden rounded-md bg-white/10', thickness === 'xs' ? 'h-1' : thickness === 'sm' ? 'h-1.5' : 'h-2', className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label={label}
    >
      <div className={cn('absolute left-0 top-0 bottom-0 rounded-md bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)]', animated && 'transition-all duration-500')} style={{ width: pct + '%' }} />
    </div>
  )
}

export default ProgressBar
