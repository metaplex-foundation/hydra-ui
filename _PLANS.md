# UX Review & Roadmap (_ux-redesign-dashboard_)

Last updated: 2025-08-09

### 1. Product Context
Shared treasury / revenue-splitting dashboard for Solana Hydra (fanout) wallets. Users create named wallets, assign member share units (or NFT / token membership), receive SOL / tokens, and trigger proportional distribution.

Primary near-term UX goal: clarity + trust (structure, semantics, feedback) before advanced automation.

### 2. Current Information Architecture
- Home: Create / Load + onboarding (How It Works, Recently Accessed)
- Dynamic Wallet: `/[walletId]` main surface
- Deprecated: `/dashboard` → redirect

Wallet Sections:
- Header (name + membership model badge)
- Overview (KPI grid)
- Token Selection panel
- Key Addresses panel
- Members (list + management forms)
- Global actions (Distribute All, Add SPL Token)

### 3. Completed Improvements
Visual/Structure:
- Glass + luminous design system adoption
- KPI glossary tooltips
- DRY wallet load/create panels
- Recently Accessed wallets (localStorage)
- How It Works onboarding section
- Alias exports (WalletOverviewStats, MembersTable)
- Redirect legacy dashboard

Interaction:
- Members list: search, sort toggle, CSV export, copy, distribute per member
- Distribution modal restyled
- Heuristic topHolderPct + undistributed
- Recently accessed persistence (script injection)

Analytics:
- Dual schema (legacy + normalized) with normalization layer
- Page view events (home, wallet)

Code Maintainability:
- Hooks barrel
- DRY components extracted

### 4. Key Decision Rationales
Tooltips reduce label noise; dual analytics preserves continuity; aliasing allows progressive rename; heuristics unblock layout while signaling future accuracy.

### 5. Current Gaps / Friction
Content: Missing explicit empty states (no members / no inflow).
Distribution: No progress UI for multi-batch; limited success/failure surfacing.
Consistency: Mixed verbs historically (distribute/claim). Action sprawl.
Data Fidelity: Undistributed + claimable are heuristic; per-member claimable not surfaced.
Accessibility: Contrast, ARIA labeling, tooltip keyboard support pending.
Performance: No virtualization; unnecessary re-renders; no suspense boundaries.
Resilience: Partial distribution failures not granularly exposed.
Analytics: Legacy events still emitted; no success/failure distribution events yet.

### 6. Forward Roadmap (Prioritized)
Near Term (Tomorrow / Next Sprint):
1. Replace script tag recent-wallet persistence with React effect.
2. Accurate undistributed + per-member claimable derivation.
3. Consolidate member actions (Add / Transfer / Stake) into a Manage menu.
4. Empty / zero states for KPIs & members.
5. Distribution progress + success/failure analytics (distribution_success / distribution_failure).
6. Remove legacy analytics events after validation.
7. Activity Timeline scaffold (member added, distribution, token added, share transfer).
8. A11y pass (contrast, headings, aria-live, tooltip focus, address alt text).
9. Lightweight tests (analytics track events, KPI computations, member filtering).
10. Memoization for derived metrics (topHolderPct) & row mapping.

Mid Term:
- Virtualized members table
- Inline editable share units
- Share allocation visualization (donut or proportional bar)
- Real-time freshness refresh action
- Draft/simulated distributions (pre-flight estimation)

Later:
- Roles/permissions
- Workspace wallet switcher
- Notification center / queue feedback
- Guided onboarding checklist
- Exportable audit log (JSON & CSV)

### 7. Analytics Plan
Normalized Events (current + planned):
- page_view(page)
- members_search(queryLength)
- distribution_initiated(scope, memberId?)
- distribution_success(scope, txCount, totalAmount) [planned]
- distribution_failure(scope, reason?) [planned]
- member_added(model, shares)
- member_removed(model)
- shares_transferred(from,to,shares)
- copied_value(valueType)
- token_added(mint,symbol?)

Key Metrics: activation funnel (wallet_created→first_member_added), avg_top_holder_pct, distributions_per_wallet (7d/30d), returning_wallets, distribution_failure_rate.

Migration: Remove legacy (dashboard_mount, copy_address, distribute_click, search_members) after 48h of stable normalized parity.

### 8. Accessibility To-Do
- Contrast audit (glass backgrounds & muted text)
- Tooltip keyboard access & aria-describedby
- aria-live status for loading/freshness
- Form validation semantics (aria-invalid, describedby)
- Skip link & logical heading order
- Address truncation: add full value aria-label

### 9. Performance Considerations
Immediate: memoize derived arrays & percentages; only recompute topHolderPct when voucher list changes.
Next: virtualization for large member sets; lazy load heavy forms; chunk distribution updates.

### 10. Risk / Debt Register
| Area | Risk | Mitigation |
|------|------|------------|
| Analytics Migration | Legacy left too long | Set removal date & checklist |
| Heuristic KPIs | Misinterpretation | Add "Approx." badge until real calc |
| Script injection | CSP/security concerns | Replace with effect (near-term) |
| Distribution UX | Partial silent failures | Chunk progress & aggregated summary |
| Action Sprawl | Cognitive load | Manage menu consolidation |
| Scale Rendering | Lag w/ large membership | Virtualization + pagination fallback |

### 11. Tomorrow’s Execution Order
1. Recent wallets React effect + remove inline script
2. Real undistributed + claimable logic
3. Manage actions unification component
4. Empty/zero states (members, inflow, undistributed=0)
5. Distribution progress UI + success/failure events
6. Add distribution_success & distribution_failure events
7. Remove legacy analytics names
8. Activity Timeline scaffold
9. A11y pass (first round)
10. Memoization + micro-perf

### 12. Definition of Done (Short-Term Milestone)
Accurate KPIs; consolidated actions; robust distribution feedback; timeline scaffold; legacy analytics retired; baseline a11y; empty states; persisted recents via effect; test coverage for analytics + core hooks.

### 13. Quick Win Candidates
- Approx badge on Undistributed until accurate
- Copy buttons for all addresses in Key Addresses & token selection
- Tooltip for freshness timestamp showing exact ISO

### 14. Open Questions
- Scheduling automated distributions?
- Multi-token simultaneous view needed?
- Introduce roles now or post-MVP reliability pass?

---
This file is the authoritative short-term UX & product implementation plan for the `ux-redesign-dashboard` branch. Update timestamp whenever materially changed.
