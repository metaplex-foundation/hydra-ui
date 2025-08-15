import * as React from 'react'
import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CreateWalletPanelProps {
  variant?: 'full' | 'compact'
  className?: string
}

export const CreateWalletPanel: React.FC<CreateWalletPanelProps> = ({ variant='full', className }) => {
  const router = useRouter()
  const { environment } = useEnvironmentCtx()
  return (
    <div className={cn('glass-panel flex flex-col rounded-[var(--radius-xl)] w-full', variant==='full' ? 'p-8 md:p-10' : 'p-6', className)} data-elev={variant==='full' ? 1 : 1}>
      <div className={cn('space-y-5', variant==='full' ? 'mb-6' : 'mb-4')}>
        <p className="eyebrow text-[var(--text-color-muted)]">New</p>
        <h2 className={cn('font-heading font-semibold text-white tracking-tight', variant==='full' ? 'text-2xl' : 'text-xl')}>Create New Wallet</h2>
        {variant==='full' && (<p className="text-gray-300 text-sm md:text-base leading-relaxed">Set up a new treasury with custom member shares and distribution rules.</p>)}
      </div>
      <div className="mt-auto space-y-4">
        <Button
          className={cn('w-full font-semibold', variant==='full' ? 'h-12 text-base' : 'h-11 text-sm')}
          onClick={() => router.push(`/create${environment.label !== 'mainnet-beta' ? `?cluster=${environment.label}` : ''}`)}
        >Create Wallet</Button>
        {variant==='full' && <p className="text-xs text-gray-500 text-center">Configure members & shares</p>}
      </div>
    </div>
  )
}
