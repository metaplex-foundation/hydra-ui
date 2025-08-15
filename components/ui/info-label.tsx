import * as React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

/**
 * InfoLabel
 * Accessible glossary / help label with tooltip.
 * - Renders inline semantic <span> with optional tooltip trigger.
 * - Focusable via button element when help provided for keyboard & a11y.
 */
export interface InfoLabelProps {
  label: string
  help?: string
  className?: string
  /** Provide a custom aria-label for the trigger button */
  ariaLabel?: string
  /** Visually hide the textual label but keep it for screen readers */
  srOnly?: boolean
}

export const InfoLabel: React.FC<InfoLabelProps> = ({ label, help, className, ariaLabel, srOnly }) => {
  if (!help) {
    return <span className={cn(className, srOnly && 'sr-only')}>{label}</span>
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={cn(
            'cursor-help focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-accent-ring)] rounded-sm text-left inline-flex items-center gap-1',
            className,
            srOnly && 'sr-only'
          )}
          aria-label={ariaLabel || `${label} info`}
        >
          <span aria-hidden={srOnly ? 'true' : undefined}>{label}</span>
          <span className="text-[10px] opacity-70" aria-hidden="true">?</span>
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs leading-relaxed" side="top" align="center">
        {help}
      </TooltipContent>
    </Tooltip>
  )
}

export default InfoLabel
