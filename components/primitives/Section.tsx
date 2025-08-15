import * as React from 'react'
import { cn } from '@/lib/utils'

/* Section primitive: enforces vertical rhythm & heading pattern */
export interface SectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  heading?: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  spacing?: 'md' | 'lg' | 'xl'
  id?: string
}

const spacingMap = {
  md: 'py-6 md:py-8',
  lg: 'py-8 md:py-10',
  xl: 'py-10 md:py-14'
}

export const Section: React.FC<SectionProps> = ({
  heading,
  description,
  actions,
  className,
  children,
  spacing = 'lg',
  id,
  ...rest
}) => {
  const hasHeader = heading || description || actions
  return (
    <section id={id} className={cn('w-full', className)} {...rest}>
      <div className={cn('mx-auto max-w-7xl px-4 md:px-6', spacingMap[spacing])}>
        {hasHeader && (
          <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2 min-w-0">
              {heading && <h2 className="text-h3 tracking-tight font-semibold leading-tight">{heading}</h2>}
              {description && <p className="text-sm text-[var(--text-color-muted)] leading-relaxed max-w-prose">{description}</p>}
            </div>
            {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
          </header>
        )}
        {children}
      </div>
    </section>
  )
}
