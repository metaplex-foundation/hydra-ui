import * as React from 'react'

export interface ActivityEvent {
  id: string
  type: 'member_added' | 'distribution' | 'token_added' | 'shares_transferred'
  createdAt: number
  summary: string
  meta?: Record<string, any>
}

// Placeholder timeline (future: fetch from on-chain / analytics log)
export const ActivityTimeline: React.FC<{ events?: ActivityEvent[]; loading?: boolean }> = ({ events = [], loading }) => {
  return (
    <section className="flex flex-col gap-3" aria-label="Activity Timeline">
      <div className="flex items-center justify-between px-1 pb-0.5">
        <h2 className="text-[11px] uppercase tracking-[1.25px] font-semibold text-[var(--text-color-muted)]/85">Recent Activity</h2>
        <span className="text-[11px] text-[var(--text-color-muted)]/70 tabular-nums">{events.length}</span>
      </div>
      <div className="glass-panel bg-white/[0.015] rounded-xl p-4 md:p-5 space-y-4" data-elev={1}>
        {loading && <p className="text-sm text-[var(--text-color-muted)]">Loading…</p>}
        {!loading && events.length === 0 && (
          <div className="text-sm text-[var(--text-color-muted)] flex items-center gap-2">
            <span className="opacity-70">No activity yet.</span>
            <span className="hidden sm:inline">Add members or distribute funds to populate history.</span>
          </div>
        )}
        {!loading && events.map(ev => (
          <div key={ev.id} className="flex items-start gap-3 text-sm">
            <div className="mt-1 h-2 w-2 rounded-full bg-[var(--color-accent)]" aria-hidden />
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-white">{ev.summary}</span>
                <time className="text-[11px] text-[var(--text-color-muted)]" dateTime={new Date(ev.createdAt).toISOString()}>{new Date(ev.createdAt).toLocaleTimeString()}</time>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
