import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'title' | 'circle' | 'bar'
  shimmer?: boolean
}

/**
 * Design-system Skeleton component
 * - Unified variants (text, title, circle, bar)
 * - Optional shimmer animation (reduced motion respected via user preference at global CSS)
 * - Always aria-hidden; parent container should manage aria-busy / role=status as needed.
 */
export function Skeleton({ className, variant = 'text', shimmer = true, ...props }: SkeletonProps) {
  return (
    <div
      data-variant={variant}
      data-shimmer={shimmer ? 'true' : 'false'}
      className={cn(
        'skeleton-base relative overflow-hidden rounded-md bg-[var(--glass-bg-alt)]',
        variant === 'title' && 'h-8 rounded-lg',
        variant === 'text' && 'h-4',
        variant === 'bar' && 'h-3',
        variant === 'circle' && 'aspect-square rounded-full',
        className
      )}
      aria-hidden="true"
      {...props}
    >
      {shimmer && <div className="skeleton-shimmer" aria-hidden="true" />}
    </div>
  )
}

export default Skeleton
