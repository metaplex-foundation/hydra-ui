import * as React from 'react'
import { cn } from '@/lib/utils'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { useRouter } from 'next/router'
import { useAnalytics } from '@/hooks'

interface ContextBarProps {
  sections?: { id: string; label?: string }[]
  className?: string
}

const DEFAULT_SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'token-selection', label: 'Tokens' },
  { id: 'addresses', label: 'Addresses' },
  { id: 'members', label: 'Members' },
  { id: 'activity', label: 'Activity' },
]

export const ContextBar: React.FC<ContextBarProps> = ({ sections = DEFAULT_SECTIONS, className }) => {
  const ids = sections.map(s => s.id)
  // Assumption: existing hook signature only accepts { ids }
  const active = useScrollSpy({ ids })
  const { track } = useAnalytics()
  const router = useRouter()

  if(!router.query.walletId) return null

  return (
    <div className={cn('sticky top-14 z-30 w-full border-b border-[var(--glass-border-strong)] bg-[var(--glass-bg)]/65 backdrop-blur-xl', className)} role="navigation" aria-label="In-page">
      <div className="mx-auto max-w-7xl px-4 md:px-6 h-12 flex items-center gap-1 overflow-x-auto">
        {sections.map(s => {
          const current = active === s.id
          return (
            <button
              key={s.id}
              onClick={() => { document.getElementById(s.id)?.scrollIntoView({ behavior:'smooth', block:'start' }); track({ name:'navigation_select', section: s.id }) }}
              className={cn(
                'relative px-4 h-8 rounded-lg text-[13px] font-semibold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-ring)]',
                current 
                  ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20 shadow-sm' 
                  : 'text-[var(--text-color-muted)] hover:text-white hover:bg-white/8 border border-transparent'
              )}
              aria-current={current ? 'true' : undefined}
            >
              {current && (
                <div className="absolute inset-x-0 -bottom-[1px] h-0.5 bg-[var(--color-accent)] rounded-full" />
              )}
              {s.label || s.id}
            </button>
          )
        })}
      </div>
    </div>
  )
}
