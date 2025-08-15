import * as React from 'react'
import { cn } from '@/lib/utils'

/* Card primitive: enhanced with consistent glass design system and hover states */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elev?: 0 | 1 | 2 | 3
  surface?: 'subtle' | 'soft' | 'solid'
  padding?: 'sm' | 'md' | 'lg' | 'xl' | 'none'
  as?: keyof JSX.IntrinsicElements
  hover?: boolean
  interactive?: boolean
}

const padMap = { 
  sm: 'p-4', 
  md: 'p-6', 
  lg: 'p-8', 
  xl: 'p-10',
  none: '' 
}

const BaseCard = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, elev = 1, surface = 'subtle', padding = 'md', as = 'div', hover = false, interactive = false, ...rest }, ref
) {
  const Comp: any = as
  return (
    <Comp
      ref={ref}
      data-elev={elev}
      data-surface={surface}
      className={cn(
        'glass-panel rounded-[var(--radius-xl)] transition-all duration-200',
        // Enhanced hover states for better interactivity
        (hover || interactive) && [
          'hover:scale-[1.01]',
          elev <= 1 && 'hover:shadow-[var(--shadow-soft)]',
          elev === 2 && 'hover:shadow-[0_8px_32px_-6px_rgba(0,0,0,.45),0_4px_16px_-4px_rgba(0,0,0,.35)]',
          elev >= 3 && 'hover:shadow-[0_6px_40px_-8px_rgba(0,0,0,.7),0_4px_20px_-4px_rgba(0,0,0,.6)]',
        ],
        interactive && 'cursor-pointer',
        padMap[padding], 
        className
      )}
      {...rest}
    />
  )
})

export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  heading?: React.ReactNode
  subtitle?: React.ReactNode
  actions?: React.ReactNode
  tight?: boolean
}
export const CardHeader: React.FC<CardHeaderProps> = ({ heading, subtitle, actions, tight, className, children, ...rest }) => (
  <div className={cn('flex items-start justify-between gap-4', tight ? 'mb-4' : 'mb-6', className)} {...rest}>
    <div className="space-y-2 min-w-0">
      {heading && <h3 className="text-base font-semibold tracking-tight leading-tight truncate text-white">{heading}</h3>}
      {subtitle && <p className="text-sm text-[var(--text-color-muted)]/90 leading-relaxed max-w-prose">{subtitle}</p>}
      {children}
    </div>
    {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
  </div>
)

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...rest }) => (
  <div className={cn('space-y-4', className)} {...rest} />
)

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...rest }) => (
  <div className={cn('pt-5 mt-4 border-t border-white/10 flex items-center justify-end gap-3', className)} {...rest} />
)

export const CardGroup: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...rest }) => (
  <div className={cn('grid gap-6 md:grid-cols-2 xl:grid-cols-3', className)} {...rest} />
)

interface CardCompound extends React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLDivElement>> {
  Header: typeof CardHeader
  Body: typeof CardBody
  Footer: typeof CardFooter
  Group: typeof CardGroup
}

const _Card = BaseCard as CardCompound
_Card.Header = CardHeader
_Card.Body = CardBody
_Card.Footer = CardFooter
_Card.Group = CardGroup

export { _Card as Card }
export default _Card
