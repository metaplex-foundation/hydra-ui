// DEPRECATED: ModernHeader superseded by TopNav.
import * as React from "react"
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Network, ChevronDown, Check } from "lucide-react"
import Link from "next/link"
import { HydraLogo } from "@/components/ui/hydra-logo"
import { Button } from "@/components/ui/button"
import { useEnvironmentCtx, ENVIRONMENTS } from 'providers/EnvironmentProvider'
import { Cluster } from '@solana/web3.js'
import { cn } from "@/lib/utils"

interface HeaderProps {
  className?: string
}

export function ModernHeader({ className }: HeaderProps) {
  const [mounted, setMounted] = React.useState(false)
  const ctx = useEnvironmentCtx()
  const wallet = useWallet()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const [announce, setAnnounce] = React.useState("")
  const [envOpen, setEnvOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setEnvOpen(false) }
    const onClick = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setEnvOpen(false) }
    window.addEventListener('keydown', onKey)
    window.addEventListener('mousedown', onClick)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('mousedown', onClick) }
  }, [])

  const setCluster = (newCluster: Cluster) => {
    const url = new URL(window.location.href)
    const newEnv = ENVIRONMENTS.find((env) => env.label === newCluster)
    if (!newEnv) return
    ctx.setEnvironment(newEnv)
    url.searchParams.set('cluster', newCluster)
    window.history.replaceState(null, '', url.toString())
    setAnnounce(`Network changed to ${newCluster}`)
    setEnvOpen(false)
  }

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 h-14 border-b border-[var(--border-subtle)] bg-[var(--glass-bg)]/40 backdrop-blur-md px-4 sm:px-5 md:px-6",
      className
    )}>
      <div className="mx-auto w-full h-full flex items-center justify-between gap-4">
    <div className="flex items-center gap-3 min-w-0">
          <Link
            href={ctx.environment.label === 'mainnet-beta' ? '/' : `/?cluster=${ctx.environment.label}`}
            className="flex items-center gap-3 h-9 rounded-md px-1.5 -ml-1 group focus-visible:outline-none"
            aria-label="Hydra home"
          >
            <HydraLogo size={30} className="text-[var(--color-accent)] transition-transform group-hover:scale-105" />
            <span className="font-heading text-base tracking-tight text-slate-200">HYDRA</span>
          </Link>
        </div>
        <div className="flex items-center gap-2 md:gap-3" ref={dropdownRef}>
          {/* Environment dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setEnvOpen(o => !o)}
              aria-haspopup="menu"
              aria-expanded={envOpen}
              aria-label="Select network"
              className={"h-9 px-3 gap-1.5 text-sm font-medium " + (envOpen ? 'bg-[var(--glass-bg)]' : '')}
            >
              <Network className="h-4 w-4 text-[var(--color-accent)]" />
              <span className="capitalize font-medium tracking-tight">{ctx.environment.label}</span>
              <ChevronDown className={"h-3.5 w-3.5 transition-transform opacity-70 " + (envOpen ? 'rotate-180' : '')} />
            </Button>
            {envOpen && (
              <div role="menu" aria-label="Select network" className="absolute right-0 mt-2 w-44 rounded-lg glass-panel p-1.5 z-50 border border-[var(--glass-border-strong)] shadow-lg">
                <ul className="flex flex-col gap-0.5">
                  {ENVIRONMENTS.filter(e => ['devnet','mainnet-beta'].includes(e.label)).map(env => {
                    const active = env.label === ctx.environment.label
                    return (
                      <li key={env.label}>
                        <button
                          role="menuitemradio"
                          aria-checked={active}
                          onClick={() => setCluster(env.label as Cluster)}
                          className={cn("w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 transition-colors", active ? 'bg-[var(--glass-bg-alt)] text-white' : 'text-gray-300 hover:bg-[var(--glass-bg-alt)]')}
                        >
                          <Check className={cn("h-4 w-4", active ? 'text-[var(--color-accent)]' : 'opacity-0')} />
                          <span className="capitalize tracking-tight">{env.label.replace('-beta','')}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>

          {/* Wallet Connection */}
          {mounted && (
            <div className="btn-luminous h-9 flex items-center !px-0">
              <WalletMultiButton className="focus-ring !h-9 !px-4 !text-sm !font-medium !tracking-tight !bg-transparent !shadow-none !border-0" />
            </div>
          )}
        </div>
      </div>
  {/* Live region for network change announcements */}
  <span aria-live="polite" className="sr-only">{announce}</span>
    </header>
  )
}