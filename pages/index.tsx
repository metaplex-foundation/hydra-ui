// TopNav layout active; legacy ModernHeader removed
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/catalyst-ui-ts/button'
import { Section } from '@/components/primitives/Section'
import { Card, CardHeader, CardBody } from '@/components/primitives/Card'
import { WalletHubPanels } from '@/components/wallet/WalletHubPanels'
import { LoadWalletPanel } from '@/components/wallet/LoadWalletPanel'
import { useMyWallets, useAnalytics } from '@/hooks'

interface RecentWallet { id: string; name: string }
const Home: NextPage = () => {
  const router = useRouter()
  const ctx = useEnvironmentCtx()
  const wallet = useWallet()
  const { wallets: myWallets } = useMyWallets()
  const { track } = useAnalytics()
  const [recent, setRecent] = useState<RecentWallet[]>([])
  useEffect(()=>{ try { const raw = localStorage.getItem('hydra_recent_wallets'); if(raw){ setRecent(JSON.parse(raw)) } } catch {} },[])
  // Analytics: home state + list view
  useEffect(()=>{
  track({ name: 'home_state', state: wallet.publicKey ? 'connected' : 'anon' })
  }, [wallet.publicKey, track])
  useEffect(()=>{
  if(wallet.publicKey) track({ name: 'my_wallets_list_view', count: myWallets.length })
  }, [wallet.publicKey, myWallets.length, track])

  return (
    <DashboardLayout>
      <div className="page-offset-top" />
      <Section
        heading="Shared Revenue Split Wallets"
        description="Create a treasury, assign shares, accumulate SOL or tokens, distribute when you choose."
        spacing="lg"
      />

      {/* Connected View */}
      {wallet.publicKey ? (
        <div className="mb-24">
          {/** Logged-in panels: My Wallets + Recent side by side */}
          {(() => {
            const myIds = new Set(myWallets.map(w=>w.id))
            const recentFiltered = recent.filter(r=> !myIds.has(r.id))
            return (
              <Section id="my-wallets" heading="Your Wallets" description={wallet.publicKey ? 'Manage and open your shared wallets.' : undefined} spacing="md">
                <div className="grid gap-8 md:grid-cols-12 items-start">
                  {/* My Wallets Panel */}
                  <div className="md:col-span-8">
                    <Card elev={2} surface="subtle" className="flex flex-col gap-5">
                      <CardHeader heading="My Shared Wallets" subtitle="Your wallets (authority detection coming soon)." actions={<Button color="indigo" className="w-auto px-4 font-semibold" onClick={()=>router.push('/create')}>New</Button>} />
                    {myWallets.length === 0 && (
                      <div className="text-[13px] text-[var(--text-color-muted)] space-y-4 py-6">
                        <div>
                          <p className="font-medium text-white mb-1">No wallets yet</p>
                          <p>Create your first shared wallet to start tracking balances & distributions.</p>
                        </div>
                        <Button color="indigo" className="w-auto !px-5 !py-2" onClick={()=>router.push('/create')}>Create Wallet</Button>
                      </div>
                    )}
                    {myWallets.length > 0 && (
                      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {myWallets.slice(0,12).map(w => (
                          <li key={w.id}>
                            <button onClick={()=>router.push(`/${w.name}`)} className="glass-panel p-3 flex flex-col gap-1 text-left hover:bg-white/5 transition-colors rounded-lg" data-elev={1}>
                              <span className="text-[13px] font-medium text-white truncate" title={w.name}>{w.name}</span>
                              <span className="text-[11px] text-[var(--text-color-muted)]/90 font-mono">{w.id.slice(0,4)}…{w.id.slice(-4)}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                    </Card>
                  </div>
                  {/* Recent Panel */}
                  <div className="md:col-span-4 flex flex-col gap-5">
                    {recentFiltered.length > 0 && (
                      <Card elev={2} surface="subtle" className="flex flex-col gap-4 h-full" aria-labelledby="recent-heading">
                        <CardHeader heading="Recently Accessed" subtitle="Not already listed above." tight />
                        <ul className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
                          {recentFiltered.slice(0,10).map(r => (
                            <li key={r.id}>
                              <button onClick={()=>router.push(`/${r.name}`)} className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md bg-white/5 hover:bg-white/7 transition-colors text-left">
                                <span className="truncate text-[13px] font-medium text-white" title={r.name}>{r.name}</span>
                                <span className="font-mono text-[11px] text-[var(--text-color-muted)]/90">{r.id.slice(0,3)}…{r.id.slice(-3)}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </Card>
                    )}
                  </div>
                </div>
              </Section>
            )
          })()}
        </div>
      ) : (
        <div className="space-y-14 mb-20">
          <Section id="view-any" heading="Get Started" description="Create or load a shared wallet to begin" spacing="md">
            <div className="grid gap-6 md:grid-cols-12 items-start">
              {/* Create Column */}
              <Card elev={2} surface="subtle" className={`flex flex-col ${recent.length>0 ? 'md:col-span-4' : 'md:col-span-6'} gap-4`}>
                <CardHeader heading="New Wallet" subtitle="Name it now. Add members anytime." />
                <Button color="indigo" className="h-10 w-full !text-sm font-semibold" onClick={()=>router.push('/create')}>Create Wallet</Button>
              </Card>
              {/* Load Column (equal width to Create) */}
              <div className={`${recent.length>0 ? 'md:col-span-4' : 'md:col-span-6'} flex flex-col`}>
                <LoadWalletPanel variant="compact" autoFocus className="h-full" />
              </div>
              {/* Recent Column */}
              {recent.length > 0 && (
                <Card elev={2} surface="subtle" className="flex flex-col gap-4 md:col-span-4" aria-labelledby="recent-inline-heading">
                  <CardHeader heading="Visited" subtitle="Quick access" tight />
                  <ul className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                    {recent.slice(0,8).map(r => (
                      <li key={r.id}>
                        <button onClick={()=>router.push(`/${r.name}`)} className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md bg-white/5 hover:bg-white/7 transition-colors text-left">
                          <span className="truncate text-[13px] font-medium text-white" title={r.name}>{r.name}</span>
                          <span className="font-mono text-[11px] text-[var(--text-color-muted)]/90">{r.id.slice(0,3)}…{r.id.slice(-3)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          </Section>
        </div>
      )}
      {/* Bottom network pill removed for dashboard style; environment visible in header */}
      
    </DashboardLayout>
  )
}

export default Home