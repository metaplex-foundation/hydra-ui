import * as React from 'react'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  dense?: boolean
  centered?: boolean
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, action, dense, centered = false, className }) => {
  return (
    <div 
      className={cn(
        'glass-panel rounded-xl flex flex-col transition-all duration-200',
        dense ? 'p-6 gap-4' : 'p-8 gap-6',
        centered ? 'items-center text-center' : 'items-start',
        'hover:bg-white/[0.02]',
        className
      )} 
      data-elev={1}
    >
      {icon && (
        <div className={cn(
          'flex items-center justify-center rounded-full bg-white/5 border border-white/10',
          dense ? 'w-12 h-12 text-2xl' : 'w-16 h-16 text-3xl',
          'text-[var(--text-color-muted)]/70'
        )} aria-hidden="true">
          {icon}
        </div>
      )}
      <div className={cn('space-y-2', centered ? 'text-center' : '')}>
        <h3 className="font-semibold text-white text-lg leading-tight tracking-tight">{title}</h3>
        {description && (
          <p className="text-sm text-[var(--text-color-muted)]/90 leading-relaxed max-w-prose">
            {description}
          </p>
        )}
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  )
}

export default EmptyState
