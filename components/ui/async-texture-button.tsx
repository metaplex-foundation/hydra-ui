import * as React from 'react'
import { Button } from '@/components/catalyst-ui-ts/button'
import { LoadingSpinner } from '@/common/LoadingSpinner'
import { cn } from '@/lib/utils'

export interface AsyncButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onAction: () => Promise<void> | void
  loadingText?: string
  color?: string
  outline?: boolean
  plain?: boolean
}

export const AsyncButton = React.forwardRef<HTMLButtonElement, AsyncButtonProps>(
  ({ onAction, children, className, loadingText, disabled, color='indigo', outline, plain, ...rest }, ref) => {
    const [loading, setLoading] = React.useState(false)

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return
      try {
        setLoading(true)
        await onAction()
      } finally {
        setLoading(false)
      }
    }

    return (
      <Button
        ref={ref as any}
        disabled={disabled || loading}
        onClick={handleClick}
        className={cn(className, loading && 'cursor-wait')}
        color={!outline && !plain ? (color as any) : undefined}
        outline={outline}
        plain={plain}
        {...rest as any}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <LoadingSpinner height="18px" />
            {loadingText && <span className="text-xs font-medium opacity-70">{loadingText}</span>}
          </span>
        ) : (
          children
        )}
      </Button>
    )
  }
)

AsyncButton.displayName = 'AsyncButton'
