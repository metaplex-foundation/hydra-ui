import React from 'react'
import { Button as CatalystButton } from '@/components/catalyst-ui-ts/button'

// Token bridge for adopting Catalyst Button across app incrementally
// We keep Hydra semantic variant names and map to Catalyst props.
export type HydraButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface UnifiedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: HydraButtonVariant
  loading?: boolean
  icon?: React.ReactNode
  as?: 'button' | 'a'
  href?: string
}

export const UnifiedButton: React.FC<UnifiedButtonProps> = ({
  variant = 'primary',
  loading,
  icon,
  children,
  className,
  as = 'button',
  href,
  disabled,
  ...rest
}) => {
  const catalystProps: any = {}
  if (variant === 'primary') catalystProps.color = 'indigo'
  else if (variant === 'secondary') catalystProps.outline = true
  else if (variant === 'ghost') catalystProps.plain = true
  else if (variant === 'danger') catalystProps.color = 'red'

  const content = (
    <>
      {icon && <span data-slot="icon">{icon}</span>}
      <span className="truncate">{children}</span>
      {loading && <span className="ml-1 animate-pulse">…</span>}
    </>
  )

  const Fallback: React.FC<any> = (p) => <button {...p} className={['inline-flex items-center rounded-lg px-4 py-2 font-semibold text-sm bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50', className].filter(Boolean).join(' ')} />
  const Comp: any = CatalystButton || Fallback
  if (!CatalystButton && process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn('[UnifiedButton] CatalystButton unresolved – falling back to native button. Check import path.')
  }
  if (as === 'a' && href) {
    return <Comp href={href} className={className} {...catalystProps}>{content}</Comp>
  }
  return <Comp className={className} disabled={disabled || loading} {...catalystProps} {...rest}>{content}</Comp>
}

export const withCatalystContainer = (children: React.ReactNode) => (
  <div className="catalyst-container max-w-7xl mx-auto px-4 sm:px-6">{children}</div>
)
