import * as React from 'react'
import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface LoadWalletPanelProps {
  variant?: 'full' | 'compact'
  className?: string
  autoFocus?: boolean
  onLoaded?: (walletName: string) => void
}

export const LoadWalletPanel: React.FC<LoadWalletPanelProps> = ({
  variant = 'full',
  className,
  autoFocus,
  onLoaded,
}) => {
  const [walletName, setWalletName] = React.useState('')
  const router = useRouter()
  const { environment } = useEnvironmentCtx()
  function submit(e?: React.FormEvent) {
    e?.preventDefault()
    const name = walletName.trim()
    if (!name) return
    onLoaded?.(name)
    router.push(`/${name}${environment.label !== 'mainnet-beta' ? `?cluster=${environment.label}` : ''}`)
  }
  return (
    <div className={cn('glass-panel flex flex-col rounded-[var(--radius-xl)] w-full', variant === 'full' ? 'p-8 md:p-10' : 'p-6', className)} data-elev={variant === 'full' ? 2 : 1}>
      <div className={cn('space-y-5', variant === 'full' ? 'mb-6' : 'mb-4')}>
        <p className="eyebrow text-[var(--text-color-muted)]">Existing</p>
        <h2 className={cn('font-semibold text-white tracking-tight', variant === 'full' ? 'text-2xl' : 'text-xl')}>Load Existing Wallet</h2>
        {variant === 'full' && (
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">Access your existing Hydra wallet to view balances, manage distributions, and track member activity.</p>
        )}
      </div>
      <form onSubmit={submit} className="space-y-6 flex-1 flex flex-col">
        <div className="space-y-3">
          <label className="form-label block" htmlFor="walletNameInput">Wallet Name</label>
          <Input
            id="walletNameInput"
            type="text"
            placeholder="hydra-wallet"
            onChange={(e) => setWalletName(e.target.value)}
            value={walletName}
            className={cn('text-base', variant === 'full' ? 'h-12' : 'h-11')}
            autoFocus={autoFocus}
            data-focus-ring="true"
          />
          <p className="text-xs text-gray-500">Use 3–32 lowercase letters, numbers, or hyphens.</p>
        </div>
        <div className="mt-auto">
          <Button
            type="submit"
            variant={walletName.trim() ? 'default' : 'outline'}
            className={cn('w-full font-semibold transition-colors', variant === 'full' ? 'h-12 text-base' : 'h-11 text-sm', !walletName.trim() && 'text-gray-400')}
            disabled={!walletName.trim()}
          >Load Wallet</Button>
        </div>
      </form>
    </div>
  )
}
