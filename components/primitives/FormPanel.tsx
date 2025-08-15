import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card } from './Card'

interface FormPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  onClose?: () => void
  actions?: React.ReactNode
}

export const FormPanel: React.FC<FormPanelProps> = ({ title, description, onClose, actions, className, children, ...rest }) => {
  return (
    <Card elev={1} surface="subtle" className={cn('p-4 space-y-4', className)} {...rest}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-lg font-medium text-white tracking-tight">{title}</h4>
          {description && <p className="text-xs text-[var(--text-color-muted)] leading-relaxed max-w-prose">{description}</p>}
        </div>
        {onClose && (
          <button onClick={onClose} className="text-[11px] text-[var(--text-color-muted)] hover:text-white px-2 py-1 rounded-md hover:bg-white/10">Close</button>
        )}
      </div>
      <div className="space-y-4">{children}</div>
      {actions && <div className="flex items-center gap-2 pt-2">{actions}</div>}
    </Card>
  )
}

export default FormPanel
