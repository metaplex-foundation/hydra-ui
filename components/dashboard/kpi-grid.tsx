import * as React from "react";
import { KPICard } from "./kpi-card";
import { EmptyState } from '@/components/ui/empty-state';
import { formatAmount, formatPercent } from "@/common/format";
import { DataChip } from '@/components/ui/data-chip';
// Path adjusted to match actual file name (case-sensitive environments)
import { useDataFreshness } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"; // legacy kept for inline approx badge
import { InfoLabel } from '@/components/ui/info-label';
interface KPIData { totalInflow: number; currentBalance: number; members: number; totalShares: number; lastUpdated: number; topHolderPct?: number; unclaimed?: number }

// Internal config for glossary style tooltips
const KPI_META: Record<string, { help?: string }> = {
  Available: { help: 'Current SOL/token balance held by the treasury and ready for distribution.' },
  'Total Received': { help: 'All-time cumulative inbound SOL/tokens this treasury has received.' },
  Members: { help: 'Number of member wallets (or NFTs / token holders depending on model).' },
  'Share Units': { help: 'Aggregate share units that define each member\'s proportional claim.' },
  'Top Holder': { help: 'Percentage owned by the largest single member (max share concentration).' },
  Undistributed: { help: 'Amount accrued but not yet distributed to members (still held in treasury).' },
};

export const KPIGrid: React.FC<{ data?: KPIData | null; loading?: boolean; tokenSymbol?: string }> = ({ data, loading, tokenSymbol = 'SOL' }) => {
  const freshness = useDataFreshness(data?.lastUpdated ?? null);
  // Empty state (no data yet but not loading)
  if (!loading && !data) {
    return (
      <section className="flex flex-col gap-4" aria-label="Overview">
        <div className="flex items-center justify-between px-1">
          <h2 className="eyebrow">Overview</h2>
        </div>
        <EmptyState
          title="No treasury metrics yet"
          description="Load or create a wallet to see balances, inflow, members, and distribution stats."
          centered
          icon="📊"
        />
      </section>
    )
  }
  // Primary KPI cards (Tier 1)
  const primary = [
    { key: 'Available', value: loading || !data ? <Skeleton className="h-7 w-24" /> : formatAmount(data.currentBalance, { currency: tokenSymbol }), sub: 'Ready' },
    { key: 'Undistributed', value: loading || !data ? <Skeleton className="h-7 w-24" /> : <span className="tabular-nums">{formatAmount(data.unclaimed ?? 0, { currency: tokenSymbol })} <Tooltip><TooltipTrigger asChild><span className="ml-1 inline-block align-middle text-[10px] px-1 py-0.5 rounded bg-white/10 text-[var(--text-color-muted)] cursor-help" aria-describedby="undistributed-desc">Approx</span></TooltipTrigger><TooltipContent className="max-w-xs">Approximate until precise per-member accrual tracking is implemented.</TooltipContent></Tooltip><span id="undistributed-desc" className="sr-only">Approximate value</span></span>, sub: 'Accruing' },
  ];
  // Secondary chips (Tier 2)
  const secondary = [
    { key: 'Members', value: loading || !data ? <Skeleton className="h-4 w-6" /> : data.members },
    { key: 'Total Received', value: loading || !data ? <Skeleton className="h-4 w-12" /> : formatAmount(data.totalInflow, { currency: tokenSymbol, compact: true }) },
    { key: 'Top Holder', value: loading || !data ? <Skeleton className="h-4 w-10" /> : formatPercent(data.topHolderPct ?? 0, { digits: 1 }) },
  ];
  return (
    <section className="flex flex-col gap-4" aria-label="Overview">
      <div className="flex items-center justify-between px-1">
        <h2 className="eyebrow">Overview</h2>
        <div className="text-[11px] text-[var(--text-color-muted)]" role="status">{data ? <span className={freshness.isStale ? "text-amber-500" : undefined}>Updated {freshness.ageSeconds}s ago</span> : <Skeleton className="h-3 w-24" />}</div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {primary.map(p => {
          const meta = KPI_META[p.key];
          const labelNode = meta?.help ? <InfoLabel label={p.key} help={meta.help} /> : p.key;
          return <KPICard key={p.key} label={labelNode} value={p.value} subLabel={p.sub} size='primary' />
        })}
      </div>
      <div className="flex flex-wrap gap-3 pt-1">
        {secondary.map(s => {
          const meta = KPI_META[s.key];
          const labelNode = meta?.help ? meta.help : undefined;
          return <DataChip key={s.key} label={s.key} value={s.value} />
        })}
      </div>
    </section>
  );
};

// Alias export for planned rename without breaking old imports
export const WalletOverviewStats = KPIGrid;
