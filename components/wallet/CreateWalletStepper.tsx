import * as React from 'react'
import { Button } from '@/components/catalyst-ui-ts/button'
import { Input } from '@/components/ui/input'
import { tryPublicKey } from 'common/utils'
import { formatPercent } from '@/common/format'
import { ProgressBar } from '@/components/ui/progress-bar'

export interface StepMember { memberKey?: string; shares?: number }
interface CreateWalletStepperProps { onComplete: (data: { name: string; totalShares: number; members: StepMember[] }) => Promise<void> | void }

export const CreateWalletStepper: React.FC<CreateWalletStepperProps> = ({ onComplete }) => {
  const [step, setStep] = React.useState(0)
  const [name, setName] = React.useState('')
  const [totalShares, setTotalShares] = React.useState(100)
  const [members, setMembers] = React.useState<StepMember[]>([{ memberKey: '', shares: undefined }])
  const [submitting, setSubmitting] = React.useState(false)
  const sharesAllocated = members.reduce((s,m)=> s + (m.shares || 0), 0)
  const remaining = totalShares - sharesAllocated
  const canContinueName = name.trim().length >= 3 && !/\s/.test(name)
  const canContinueMembers = remaining === 0 && members.every(m=> m.memberKey && tryPublicKey(m.memberKey) && m.shares && m.shares > 0)

  function addMember(){ setMembers(m => [...m, { memberKey: '', shares: undefined }]) }
  function removeMember(i:number){ setMembers(m => m.filter((_,idx)=>idx!==i)) }
  async function finish(){ if(!canContinueMembers) return; setSubmitting(true); await onComplete({ name, totalShares, members }); setSubmitting(false) }

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-4">
        <ol className="flex items-center justify-center gap-8 text-[12px] uppercase tracking-[1.2px] font-semibold">
        {['Wallet','Members','Review'].map((label,i)=>(<li key={label} className={"flex items-center gap-3 transition-colors duration-300 " + (i===step? 'text-[var(--color-accent)]':'text-[var(--text-color-muted)]')}><span className={"w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 " + (i<=step? 'bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent)]/80 text-gray-950 shadow-[0_4px_12px_-2px_var(--color-accent)]/40':'bg-white/5 border border-white/10 text-[var(--text-color-muted)]')}>{i+1}</span>{label}</li>))}
        </ol>
        <ProgressBar value={step+1} max={3} label="Step progress" />
      </div>

      {step===0 && (
        <section className="glass-panel p-8 space-y-8" data-elev={2} aria-labelledby="step-wallet" data-surface="subtle">
          <h2 id="step-wallet" className="text-xl font-bold text-white">Wallet Basics</h2>
          <div className="space-y-6 max-w-lg">
            <div className="space-y-3">
              <label htmlFor="wallet-name" className="block text-sm font-semibold text-white">Wallet Name</label>
              <Input id="wallet-name" value={name} onChange={e=>setName(e.target.value)} placeholder="my-treasury" className="input-glass h-12 font-mono text-base" data-focus-ring="true" />
              <p className="text-sm text-[var(--text-color-muted)]/90">3–32 chars, lowercase letters, numbers, hyphens.</p>
            </div>
            <div className="space-y-3">
              <label htmlFor="total-shares" className="block text-sm font-semibold text-white">Total Shares</label>
              <Input id="total-shares" type="number" value={totalShares} onChange={e=>setTotalShares(parseInt(e.target.value)||0)} className="input-glass h-12 text-center text-xl font-bold" data-focus-ring="true" />
              <p className="text-sm text-[var(--text-color-muted)]/90">Distribution units for member allocations.</p>
            </div>
          </div>
          <div className="pt-2 flex justify-end">
            <Button color="indigo" disabled={!canContinueName} onClick={()=> setStep(1)} className="px-8 h-12 text-sm font-semibold">Continue</Button>
          </div>
        </section>
      )}

      {step===1 && (
        <section className="glass-panel p-8 space-y-8" data-elev={2} aria-labelledby="step-members" data-surface="subtle">
          <h2 id="step-members" className="text-xl font-bold text-white">Members & Shares</h2>
          <div className="space-y-6">
            {members.map((m,i)=>{ const pct = m.shares && totalShares? (m.shares/totalShares)*100 : 0; return (
              <div key={i} className="grid gap-5 md:grid-cols-7 items-end glass-panel p-5" data-elev={1}>
                <div className="md:col-span-4 space-y-3">
                  <label htmlFor={`member-${i}`} className="block text-sm font-semibold text-white">Member Wallet</label>
                  <Input id={`member-${i}`} value={m.memberKey} onChange={e=>{ const v=e.target.value; setMembers(list=> list.map((x,idx)=> idx===i? {...x, memberKey: v}: x)) }} placeholder="Wallet address" className="input-glass h-11 font-mono text-sm" data-focus-ring="true" />
                </div>
                <div className="space-y-3">
                  <label htmlFor={`shares-${i}`} className="block text-sm font-semibold text-white">Shares</label>
                  <Input id={`shares-${i}`} type="number" value={m.shares ?? ''} onChange={e=>{ const v=parseInt(e.target.value)||0; setMembers(list=> list.map((x,idx)=> idx===i? {...x, shares: v}: x)) }} placeholder="0" className="input-glass h-11 text-center font-bold text-lg" data-focus-ring="true" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="text-base font-bold text-[var(--color-accent)]">{pct? formatPercent(pct,{ digits: pct<10?1:0 }).replace('%',''): '0'}%</div>
                  <div className="w-14 h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent)]/80 transition-all duration-300" style={{ width: `${Math.min(100,pct)}%` }} /></div>
                </div>
                <div className="flex items-center justify-end">
                  {members.length>1 && <Button outline onClick={()=>removeMember(i)} className="px-4 h-10 text-sm">Remove</Button>}
                </div>
              </div>
            )})}
            <div className="flex gap-3 flex-wrap">
              <Button color="indigo" onClick={addMember} className="px-5 h-10 text-sm font-semibold">+ Add Member</Button>
              {members.length>1 && <Button outline onClick={()=> setMembers(m=> m.slice(0,-1))} className="px-5 h-10 text-sm">- Remove Last</Button>}
            </div>
            <ProgressBar value={sharesAllocated} max={totalShares} label="Allocation progress" />
            <p className="text-sm text-[var(--text-color-muted)]/90">Allocated {sharesAllocated}/{totalShares} shares ({remaining} remaining)</p>
          </div>
          <div className="flex justify-between pt-2">
            <Button outline onClick={()=> setStep(0)} className="px-6 h-12 text-sm font-semibold">Back</Button>
            <Button color="indigo" disabled={!canContinueMembers} onClick={()=> setStep(2)} className="px-8 h-12 text-sm font-semibold">Review</Button>
          </div>
        </section>
      )}

      {step===2 && (
        <section className="glass-panel p-8 space-y-8" data-elev={2} aria-labelledby="step-review" data-surface="subtle">
          <h2 id="step-review" className="text-xl font-bold text-white">Review & Create</h2>
          <div className="space-y-6">
            <div className="glass-panel p-6 space-y-4" data-elev={1}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--text-color-muted)]">Wallet Name:</span> 
                <span className="font-mono font-bold text-white text-lg">{name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--text-color-muted)]">Total Shares:</span>
                <span className="font-bold text-white text-lg">{totalShares}</span>
              </div>
            </div>
            <div className="glass-panel p-6" data-elev={1}>
              <h3 className="text-sm font-semibold text-white mb-4">Member Allocations</h3>
              <div className="space-y-3">
                {members.map((m,i)=> (
                  <div key={i} className="flex items-center justify-between py-3 px-4 bg-white/[0.02] rounded-lg border border-white/5">
                    <span className="font-mono text-sm text-white truncate max-w-[200px]" title={m.memberKey}>{m.memberKey?.slice(0,6)}…{m.memberKey?.slice(-6)}</span>
                    <div className="flex items-center gap-3">
                      <span className="tabular-nums font-semibold text-white">{m.shares} shares</span>
                      <span className="text-sm font-medium text-[var(--color-accent)]">({formatPercent((m.shares||0)/totalShares*100,{ digits: (m.shares||0)/totalShares*100 < 10?1:0 })})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-between pt-2">
            <Button outline onClick={()=> setStep(1)} className="px-6 h-12 text-sm font-semibold">Back</Button>
            <Button color="indigo" disabled={submitting || !canContinueMembers} onClick={finish} className="px-10 h-12 text-sm font-semibold">{submitting? 'Creating…':'Create Wallet'}</Button>
          </div>
        </section>
      )}
    </div>
  )
}
