import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { HydraLogo } from '@/components/ui/hydra-logo'
import { Button } from '@/components/ui/button'
import { useEnvironmentCtx, ENVIRONMENTS } from 'providers/EnvironmentProvider'
import { ChevronDown, Check, Network, Plus, Search } from 'lucide-react'
import { useMyWallets } from '@/hooks/useMyWallets'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { useAnalytics } from '@/hooks'

interface StoredWalletMeta { id: string; name: string; lastAccessed: number }

export const TopNav: React.FC = () => {
  const { environment, setEnvironment } = useEnvironmentCtx()
  const wallet = useWallet()
  const router = useRouter()
  const { track } = useAnalytics()
  const [envOpen, setEnvOpen] = React.useState(false)
  const [myOpen, setMyOpen] = React.useState(false)
  const [viewId, setViewId] = React.useState('')
  const envRef = React.useRef<HTMLDivElement|null>(null)
  const myRef = React.useRef<HTMLDivElement|null>(null)
  const [mounted, setMounted] = React.useState(false)
  const [recent, setRecent] = React.useState<StoredWalletMeta[]>([])

  React.useEffect(()=>{ setMounted(true); try { const raw = localStorage.getItem('hydra_recent_wallets'); if(raw) setRecent(JSON.parse(raw)); } catch {} },[])

  React.useEffect(()=>{
    const handler = (e: MouseEvent) => {
      if(envRef.current && !envRef.current.contains(e.target as Node)) setEnvOpen(false)
      if(myRef.current && !myRef.current.contains(e.target as Node)) setMyOpen(false)
    }
    window.addEventListener('mousedown', handler)
    return ()=> window.removeEventListener('mousedown', handler)
  },[])

  const goView = () => {
    const trimmed = viewId.trim()
    if(!trimmed) return
  track({ name: 'view_wallet_attempt', id: trimmed })
  track({ name: 'wallet_open', source: 'input', id: trimmed })
    router.push(`/${trimmed}${environment.label==='mainnet-beta'?'':`?cluster=${environment.label}`}`)
    setViewId('')
  }

  const setCluster = (label: string) => {
    const env = ENVIRONMENTS.find(e => e.label === label)
    if(!env) return
    setEnvironment(env)
    const url = new URL(window.location.href)
    url.searchParams.set('cluster', label)
    window.history.replaceState(null,'',url.toString())
  }

  const connected = !!wallet.publicKey
  const { wallets: myWallets } = useMyWallets()
  const navSelect = (section: string) => track({ name:'navigation_select', section })
  const onWalletPage = !!router.query.walletId

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 border-b border-[var(--border-subtle)] bg-[var(--glass-bg)]/50 backdrop-blur-md flex items-center px-4 gap-4 z-40" role="navigation" aria-label="Primary">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:bg-[var(--glass-bg-alt)] focus:text-white focus:px-3 focus:py-2 focus:rounded-md focus:text-sm focus:z-50">Skip to main content</a>
      <Link href={environment.label==='mainnet-beta'?'/':`/?cluster=${environment.label}`} className="flex items-center gap-2 h-10 focus-visible:outline-none" aria-label="Hydra home">
        <HydraLogo size={28} className="text-[var(--color-accent)]" />
        <span className="font-heading text-base tracking-tight text-slate-200">HYDRA</span>
      </Link>
      <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
        <div className="relative flex-1">
          <input
            value={viewId}
            onChange={e=>setViewId(e.target.value)}
            onKeyDown={e=>{ if(e.key==='Enter'){ goView() } }}
            placeholder="View any shared wallet (name/id)"
            className="w-full h-9 rounded-lg input-glass px-3 pr-9 text-sm font-mono"
            aria-label="View any wallet by name or id"
          />
          <button aria-label="Open wallet" onClick={goView} className="absolute right-1.5 top-1.5 h-6 w-6 rounded-md bg-white/10 hover:bg-white/15 flex items-center justify-center"><Search className="h-3.5 w-3.5" /></button>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2">
  {/* In-page section navigation moved to ContextBar */}
        {connected && (
          <div className="relative" ref={myRef}>
            <Button variant="outline" className="h-9 px-3 gap-1.5 text-sm font-medium" onClick={()=>setMyOpen(o=>!o)} aria-haspopup="menu" aria-expanded={myOpen}>My Shared Wallets<ChevronDown className="h-3.5 w-3.5 opacity-70" /></Button>
            {myOpen && (
              <div role="menu" className="absolute right-0 mt-2 w-72 glass-panel rounded-lg p-2 border border-[var(--glass-border)] z-50 flex flex-col gap-2" aria-label="My Shared Wallets">
                {myWallets.length===0 && <p className="text-xs text-[var(--text-color-muted)] px-2 py-1">No wallets yet.</p>}
                {myWallets.map(w => (
                  <button key={w.id} onClick={()=>{ track({ name:'wallet_open', source:'dropdown', id: w.name }); router.push(`/${w.name}`)}} className="flex items-center justify-between gap-3 px-3 py-2 rounded-md hover:bg-white/5 text-sm text-left">
                    <span className="font-mono truncate max-w-[140px]">{w.name}</span>
                    <span className="text-[10px] text-[var(--text-color-muted)]">{w.id.slice(0,4)}…{w.id.slice(-4)}</span>
                  </button>
                ))}
                <Button className="h-8 text-xs font-medium mt-1" onClick={()=>router.push('/create')}>+ New Shared Wallet</Button>
                {recent.length>0 && (
                  <div className="pt-2 mt-1 border-t border-white/5">
                    <p className="px-2 mb-1 text-[10px] uppercase tracking-wide text-[var(--text-color-muted)]">Recent</p>
                    <div className="flex flex-col gap-1 max-h-40 overflow-y-auto pr-1">
                      {recent.slice(0,6).map(r=> (
                        <button key={r.id} onClick={()=>{ track({ name:'wallet_open', source:'recent', id: r.name }); router.push(`/${r.name}`)}} className="flex items-center justify-between gap-3 px-2 py-1.5 rounded-md hover:bg-white/5 text-[11px]">
                          <span className="truncate max-w-[120px]">{r.name}</span>
                          <span className="font-mono text-[9px] opacity-70">{r.id.slice(0,3)}…{r.id.slice(-3)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <div className="relative" ref={envRef}>
            <Button variant="outline" className="h-9 px-3 gap-1.5 text-sm font-medium" onClick={()=>setEnvOpen(o=>!o)} aria-haspopup="menu" aria-expanded={envOpen}><Network className="h-4 w-4 text-[var(--color-accent)]" /><span className="capitalize">{environment.label}</span><ChevronDown className="h-3.5 w-3.5 opacity-70" /></Button>
            {envOpen && (
              <div role="menu" className="absolute right-0 mt-2 w-40 glass-panel rounded-lg p-1.5 border border-[var(--glass-border)] z-50">
                <ul className="flex flex-col gap-0.5">
                  {ENVIRONMENTS.filter(e=>['devnet','mainnet-beta'].includes(e.label)).map(env=>{
                    const active = env.label===environment.label
                    return (
                      <li key={env.label}>
                        <button onClick={()=>setCluster(env.label)} role="menuitemradio" aria-checked={active} className={"w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-left " + (active? 'bg-[var(--glass-bg-alt)] text-white':'text-gray-300 hover:bg-[var(--glass-bg-alt)]') }>
                          <Check className={"h-4 w-4 " + (active? 'text-[var(--color-accent)]':'opacity-0')} />
                          <span className="capitalize">{env.label.replace('-beta','')}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
        </div>
  {connected && <Button className="h-9 px-4 text-sm font-medium hidden md:inline-flex" onClick={()=>router.push('/create')}><Plus className="h-4 w-4 mr-1" />Create</Button>}
        {mounted && (
          <div className="btn-luminous h-9 flex items-center !px-0">
            <WalletMultiButton className="focus-ring !h-9 !px-4 !text-sm !font-medium !tracking-tight !bg-transparent !shadow-none !border-0" />
          </div>
        )}
      </div>
    </nav>
  )
}
