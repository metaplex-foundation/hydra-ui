import * as React from 'react'
import { cn } from '@/lib/utils'

interface DataChipProps { label: string; value: React.ReactNode; help?: string; className?: string }
export const DataChip: React.FC<DataChipProps> = ({ label, value, className }) => {
  return (
    <div className={cn('inline-flex flex-col min-w-[90px] px-3 py-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm gap-1', className)}>
      <span className="text-[10px] font-medium uppercase tracking-[1.1px] text-[var(--text-color-muted)]">{label}</span>
      <span className="text-sm font-semibold tabular-nums text-white leading-none">{value}</span>
    </div>
  )
}
