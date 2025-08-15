import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/catalyst-ui-ts/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from '@/components/ui/empty-state';
import { useAnalytics } from "@/hooks/useAnalytics";
import { useDataFreshness } from "@/hooks/useDataFreshness";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { IconSearch, IconArrowDown, IconArrowUp, IconDownload } from "@tabler/icons-react";
import { formatAmount, formatPercent } from "@/common/format";
interface MemberEntry { id: string; address: string; shares: number; claimed: number; totalClaimable: number; lastClaim?: string }
interface MemberListProps { 
  members?: MemberEntry[]; 
  loading?: boolean; 
  totalShares: number; 
  onDistributeMember?: (member: MemberEntry) => void; 
  hasDistributableFunds?: boolean;
  isWalletAuthority?: boolean;
  onRemoveMember?: (member: MemberEntry) => void;
  onTransferShares?: (fromMember: MemberEntry, toAddress: string, shares: number) => void;
}
export const MemberList: React.FC<MemberListProps> = ({ 
	members = [], 
	loading, 
	totalShares, 
	onDistributeMember, 
	hasDistributableFunds = false, 
	isWalletAuthority = false,
	onRemoveMember,
	onTransferShares 
}) => {
	const { track } = useAnalytics();
	const [query, setQuery] = React.useState("");
	const [sort, setSort] = React.useState<{ key: keyof MemberEntry; dir: 1 | -1 }>({ key: "shares", dir: -1 });
	const [editingMember, setEditingMember] = React.useState<string | null>(null);
	const [transferToAddress, setTransferToAddress] = React.useState('');
	const [transferShares, setTransferShares] = React.useState<number>(0);
	const freshness = useDataFreshness(Date.now());
	const filtered = React.useMemo(()=>{ const q=query.trim().toLowerCase(); let list=members; if(q) list=list.filter(m=>m.address.toLowerCase().includes(q)||m.id.toLowerCase().includes(q)); list=[...list].sort((a,b)=>{const av:any=a[sort.key]; const bv:any=b[sort.key]; if(av===bv) return 0; return av>bv?sort.dir:-sort.dir}); return list; },[members,query,sort]);
	React.useEffect(()=>{ if(query) track({ name: 'members_search', queryLength: query.length }) },[query, track]);
	function exportCsv(){ const header=["id","address","shares","claimed","totalClaimable","lastClaim"]; const rows=members.map(m=>header.map(h=>(m as any)[h]??"")); const csv=[header.join(","), ...rows.map(r=>r.join(","))].join("\n"); const blob=new Blob([csv],{type:'text/csv'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='members.csv'; a.click(); URL.revokeObjectURL(url) }
	return (
		<section className="flex flex-col gap-4" aria-label="Members">
			<div className="flex items-center justify-between gap-4 flex-wrap px-1">
				<h2 className="eyebrow">Members</h2>
				<div className="flex items-center gap-2 flex-wrap">
					<Button color="indigo" className="h-8 px-4 text-sm font-semibold" onClick={()=>track({ name:'distribution_initiated', scope:'all' })}>Distribute Funds</Button>
					<div className="relative">
						<IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--text-color-muted)]/70" />
						<Input placeholder="Search members..." className="input-glass pl-10 pr-4 h-9 w-48 text-sm font-medium" value={query} onChange={e=>setQuery(e.target.value)} />
					</div>
					<Tooltip>
							<TooltipTrigger asChild>
								<Button outline className="h-8 px-3 text-sm" onClick={()=>setSort(s=>({ key: s.key, dir: s.dir * -1 as 1 | -1 }))}>{sort.dir === -1 ? <IconArrowDown className="size-4" /> : <IconArrowUp className="size-4" />} {sort.key}</Button>
							</TooltipTrigger>
						<TooltipContent>Toggle sort direction</TooltipContent>
					</Tooltip>
					<Tooltip>
							<TooltipTrigger asChild>
								<Button outline className="h-8 px-3 text-sm" onClick={exportCsv} aria-label="Export CSV"><IconDownload className="size-4" /></Button>
							</TooltipTrigger>
						<TooltipContent>Export CSV</TooltipContent>
					</Tooltip>
				</div>
			</div>
			<div className="glass-panel overflow-hidden" data-elev={2} role="table" aria-label="Member share allocations">
				<div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-4 px-5 py-4 text-[11px] uppercase tracking-[1.2px] font-semibold text-white/70 bg-white/[0.03] border-b border-white/[0.05]" role="row">
					<div>Member</div><div className="text-right">Claimed</div><div className="text-right">Shares</div><div className="text-right">Share %</div><div className="text-right">Action</div>
				</div>
				{loading && <div className="p-5 space-y-4" role="rowgroup">{Array.from({ length: 4 }).map((_,i)=>(<div key={i} className="grid grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-4 items-center" role="row"><Skeleton className="h-5 w-40" /><Skeleton className="h-5 w-16 justify-self-end" /><Skeleton className="h-5 w-10 justify-self-end" /><Skeleton className="h-5 w-10 justify-self-end" /><Skeleton className="h-7 w-20 justify-self-end" /></div>))}</div>}
				{!loading && filtered.length===0 && <div className="p-8" role="row"><EmptyState dense title="No members found" description="Adjust your search or distribute funds once members are added." icon="👥" centered /></div>}
				{!loading && filtered.map(m=>{ const pct= totalShares ? (m.shares/totalShares)*100 : 0; return (
					<React.Fragment key={m.id}>
						<div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-4 px-5 py-4 text-sm items-center hover:bg-white/[0.04] transition-all duration-200 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] border-b border-white/[0.03] last:border-b-0" role="row">
							<div className="flex items-center gap-3 min-w-0">
								<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs font-semibold">
									{m.id.slice(0,1).toUpperCase()}
								</div>
								<div className="flex flex-col truncate">
									<span className="font-semibold truncate text-white" title={m.address}>{m.address.slice(0,4)}…{m.address.slice(-4)}</span>
									<span className="text-[11px] text-[var(--text-color-muted)]">Last claim {m.lastClaim || '—'}</span>
								</div>
								<CopyButton value={m.address} label="Copy Address" className="ml-auto opacity-60 hover:opacity-100 transition-opacity" onCopy={()=>track({ name: 'copied_value', valueType: 'member_address' })} />
							</div>
							<div className="text-right align-decimals tabular-nums font-medium"><span className="int">{formatAmount(m.claimed, { maxSig: 6, minSig: 2 })}</span></div>
							<div className="text-right align-decimals tabular-nums font-medium"><span className="int">{m.shares}</span></div>
							<div className="text-right flex flex-col items-end gap-1" aria-label={`Share percent ${formatPercent(pct,{ digits: 1 })}`}>
								<span className="text-sm font-medium tabular-nums">{formatPercent(pct,{ digits: 1 })}</span>
								<div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
									<div 
										className="h-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent)]/80 rounded-full transition-all duration-300" 
										style={{ width: `${Math.min(pct, 100)}%` }}
									/>
								</div>
							</div>
							<div className="flex justify-end gap-2">
								{/* Distribute Button */}
								{hasDistributableFunds && m.totalClaimable > 0 && (
									<Button 
										color="indigo"
										className="h-8 px-3 text-xs font-semibold"
										onClick={() => { 
											track({ name:'distribution_initiated', scope:'member', memberId:m.id }); 
											onDistributeMember?.(m); 
										}}
									>
										Distribute
									</Button>
								)}
								
								{/* Management Actions for Wallet Authority */}
								{isWalletAuthority && (
									<>
										<Button 
											outline
											className="h-8 px-3 text-xs font-medium"
											onClick={() => setEditingMember(editingMember === m.id ? null : m.id)}
										>
											{editingMember === m.id ? 'Cancel' : 'Edit'}
										</Button>
										<Button 
											outline
											color="red"
											className="h-8 px-3 text-xs font-medium"
											onClick={() => {
												if (window.confirm(`Remove ${m.address.slice(0,6)}...${m.address.slice(-4)} from wallet?`)) {
													track({ name:'member_removal_initiated', memberId:m.id });
													onRemoveMember?.(m);
												}
											}}
										>
											Remove
										</Button>
									</>
								)}
								
								{/* Spacer when no actions available */}
								{!hasDistributableFunds && !isWalletAuthority && <div className="w-8 h-8" />}
							</div>
						</div>
						
						{/* Inline Edit Panel */}
						{editingMember === m.id && isWalletAuthority && (
							<div className="px-5 py-4 bg-white/[0.02] border-t border-white/5 border-b border-white/[0.03]">
								<div className="grid gap-4 md:grid-cols-3 items-end">
									<div className="space-y-2">
										<label className="block text-xs font-semibold text-white">Transfer To Address</label>
										<Input 
											placeholder="Recipient wallet address..."
											className="h-8 text-xs input-glass"
											value={transferToAddress}
											onChange={e => setTransferToAddress(e.target.value)}
										/>
									</div>
									<div className="space-y-2">
										<label className="block text-xs font-semibold text-white">Shares to Transfer</label>
										<Input 
											type="number"
											placeholder={`Max ${m.shares}`}
											max={m.shares}
											min={1}
											className="h-8 text-xs text-center input-glass"
											value={transferShares || ''}
											onChange={e => setTransferShares(parseInt(e.target.value) || 0)}
										/>
									</div>
									<div className="flex gap-2">
										<Button 
											color="indigo"
											className="h-8 px-4 text-xs font-semibold"
											disabled={!transferToAddress || transferShares <= 0 || transferShares > m.shares}
											onClick={() => {
												if (transferToAddress && transferShares > 0 && transferShares <= m.shares) {
													onTransferShares?.(m, transferToAddress, transferShares);
													setEditingMember(null);
													setTransferToAddress('');
													setTransferShares(0);
												}
											}}
										>
											Transfer Shares
										</Button>
										<Button 
											outline
											className="h-8 px-3 text-xs"
											onClick={() => {
												setEditingMember(null);
												setTransferToAddress('');
												setTransferShares(0);
											}}
										>
											Cancel
										</Button>
									</div>
								</div>
							</div>
						)}
					</React.Fragment>
				) })}
			</div>
			<p className="text-sm text-[var(--text-color-muted)]/90 mt-2 px-1">{members.length} members • Updated {freshness.ageSeconds}s ago</p>
		</section>
	)
}
