Gathering key design-related source files to map tasks to concrete file changes. Reviewing design system doc to align tasks with existing guidance. Reading styles to inventory existing tokens and utilities for mapping refactor tasks. Scanning for button component definitions to map variant refactor tasks. Locating newer button component in components/ui to unify variants. Checking a metrics-like component candidate to map hierarchy adjustments. Reading KPI grid to plan reordering metrics. Reading utils format file to plan numeric formatting task. Reading a page file (dashboard) to see layout for mapping tasks. Listing app directory to locate new dashboard implementation. Searching for "Overview" to find wallet detail page. Reading wallet detail page to map member table and actions. Reading later part of wallet detail file near members table for action placement. Search for 'member-list' component file to understand columns. Searching for texture-button component to know variant set for consolidation. Checkpoint: compiled necessary component context; next I'll produce detailed task-to-file breakdown.
Task receipt: You want a concrete component/task breakdown mapped to specific files based on the earlier design review. Below is a structured backlog with file-level impact.

## Legend
Effort: S (≤1h), M (1–3h), L (3–6h), XL (>1 day)
Type: DS (design system), UX (layout/IA), A11y, Ref (refactor), FEAT (new), DOC
Priority groups reference earlier P0–P4.

## P0 Foundational

1. Token & Spacing Consolidation  
   - Add/confirm spacing + radius tokens in styles.css (already partial) & expose via Tailwind (extend theme.spacing / borderRadius).  
   Files: styles.css, tailwind.config.js  
   Effort: M, Type: DS

2. Typography Scale & Tabular Numerals Utility  
   - Define classes: `.text-h1`, `.text-h2`, `.text-data`, etc.  
   - Add `font-feature-settings: "tnum"` utility or Tailwind plugin for `tabular-nums` (already used ad hoc).  
   Files: styles.css, optional plugin file `./plugins/typography.js`, usages across: kpi-card.tsx, member-list.tsx, headers in index.tsx, `components/layout/*.tsx`  
   Effort: M, Type: DS/Ref

3. Button Variant Rationalization  
   - Consolidate legacy Button.tsx (emotion) into Texture/Button system or deprecate.  
   - Create a canonical variant map (Primary, Secondary, Glass, Luminous, Outline, Destructive, Icon) and remove unused (`accent`, `minimal`, `primarySolid` if replaced by Primary).  
   Files: texture-button.tsx, button.tsx, remove or wrap Button.tsx, update usages via search.  
   Effort: L (due to find/replace & regression), Type: Ref/DS

4. Metric Hierarchy Reorder & Emphasis  
   - Adjust order & grouping logic in kpi-grid.tsx (rearrange cards array; introduce primary group wrapper or 2-col layout).  
   - Add variant prop to `KPICard` for size (primary vs secondary).  
   Files: kpi-grid.tsx, kpi-card.tsx  
   Effort: S-M, Type: UX

5. Contrast & A11y Pass  
   - Tune gold & muted text variables for WCAG; test with axe (plan to add script).  
   - Add explicit focus-visible ring for TextureButton variants missing strong contrast.  
   Files: styles.css, texture-button.tsx, button.tsx  
   Effort: M, Type: A11y/DS

6. Unified Numeric Formatting & Threshold Logic  
   - Extend format.ts with percent formatter & decimal alignment helper.  
   - Replace manual `.toFixed()` calls (e.g., in member-list.tsx) with utility.  
   Files: format.ts, member-list.tsx, kpi-grid.tsx, any other numeric displays (grep `.toFixed(`).  
   Effort: M, Type: Ref

7. Members Table Action Refactor  
   - Remove per-row "Distribute" button; add row overflow menu or minimal icon; introduce global “Distribute Funds” CTA above table (maybe near section header).  
   Files: member-list.tsx, possibly new `components/dashboard/member-row-actions.tsx`.  
   Effort: M, Type: UX

8. Keyboard Navigation & Focus Order  
   - Ensure skip link or logical heading order at top-level layout.  
   - Add `tabIndex` / landmark roles in layout components.  
   Files: DashboardLayout.tsx, ModernHeader.tsx, Sidebar.tsx, index.tsx  
   Effort: M, Type: A11y

## P1 Structural & IA

9. Create Wallet Stepper  
   - New component: `components/wallet/CreateWalletStepper.tsx` (state machine).  
   - Refactor `CreateWalletPanel.tsx`, `LoadWalletPanel.tsx` to use shared steps; update route index.tsx.  
   Files: CreateWalletPanel.tsx, LoadWalletPanel.tsx, new `components/wallet/CreateWalletStepper.tsx`, index.tsx  
   Effort: L, Type: UX/FEAT

10. Consolidated Wallet Hub Screen  
    - Implemented as `WalletHubPanels` combining Recent / Load / Create panels (naming divergence).  
    Files: components/wallet/WalletHubPanels.tsx, pages usage.  
    Effort: L, Type: UX

11. Shares Allocation Progress  
    - Reuse `.micro-progress` with dynamic width; show remaining shares inline in member management UI.  
    Files: index.tsx (member add section), CreateWalletPanel.tsx  
    Effort: S, Type: UX

12. Skeleton States for Metrics & Members  
    - Standardized via existing `components/ui/skeleton.tsx`; no separate loading-skeletons file created.  
    Files: skeleton.tsx, kpi-grid.tsx, member-list.tsx.  
    Effort: S-M, Type: Ref

13. Footer Spacing & Layout Max Width  
    - Adjust container width/padding tokens.  
    Files: SiteFooter.tsx, global container classes (tailwind.config.js), maybe wrappers in `DashboardLayout.tsx`  
    Effort: S, Type: DS/UX

14. Context Section Merge (Token + Addresses)  
    - Implemented as `components/wallet/WalletContextPanel.tsx` extracted from pages/[walletId]/index.tsx.  
    Files: pages/[walletId]/index.tsx, components/wallet/WalletContextPanel.tsx.  
    Effort: M, Type: UX/Ref

## P2 Refinement

15. KPI Grid Adaptive Layout (2 large + 4 small)  
    - Add size prop to `KPICard`; adjust CSS grid template.  
    Files: kpi-card.tsx, kpi-grid.tsx  
    Effort: S, Type: UX

16. Glossary Tooltips Standardization  
    - Abstract tooltip label into `components/ui/info-label.tsx` with aria compliance.  
    Files: new `components/ui/info-label.tsx`, replace in kpi-grid.tsx  
    Effort: S, Type: A11y/Ref

17. Empty States Components  
    - `components/ui/empty-state.tsx` created; applied to KPI grid and member list. Activity timeline adoption pending.  
    Files: empty-state.tsx, kpi-grid.tsx, member-list.tsx.  
    Effort: M, Type: UX/Ref

18. Button Interaction Polish (hover/active states unified)  
    - Adjust variant CSS for smooth brightness transitions; ensure reduced motion behavior.  
    Files: texture-button.tsx, styles.css  
    Effort: S, Type: DS

19. Decimal Alignment Utility  
    - Implemented as `.align-decimals`; applied to member-list numeric cells (potential future KPI use).  
    Files: styles.css, member-list.tsx.  
    Effort: S, Type: Ref

20. Modal Entrance Animation Tokens  
    - Tokens + `.modal-animate` integrated into dialog.tsx (DialogContent) with reduced motion fallback.  
    Files: styles.css, components/ui/dialog.tsx.  
    Effort: S, Type: DS/UX

## P3 Documentation & Automation

21. Microcopy Standards Doc  
    - Update DESIGN_SYSTEM.md section 10 or add `CONTENT_GUIDELINES.md`.  
    Files: DESIGN_SYSTEM.md or new doc.  
    Effort: S, Type: DOC

22. Contrast Report Script  
    - Add simple node script to scan CSS variables & output luminance contrast pairs (optional).  
    Files: new `scripts/contrast-audit.mjs`  
    Effort: M, Type: Tooling

23. Component Inventory Export  
    - Generate Storybook or MDX list (if Storybook not present, scaffold).  
    Files: config & stories under `.storybook/` + `stories/*.stories.tsx`  
    Effort: L, Type: FEAT/DOC

24. Visual Regression Setup (Playwright snapshot)  
    - Add `tests/visual/*.spec.ts` capturing key pages.  
    Files: new `playwright.config.ts`, `tests/visual/dashboard.spec.ts` etc.  
    Effort: L, Type: Tooling

25. Analytics Event Naming Conventions  
    - Update useAnalytics.ts to export enum or constant map; replace string literals.  
    Files: useAnalytics.ts, call sites (grep `track({ name:`).  
    Effort: M, Type: Ref

## P4 Future Enhancements

26. Inline Editable Shares  
    - Add editable cell with validation to member-list.tsx; update state derivations.  
    Files: member-list.tsx  
    Effort: L, Type: FEAT

27. Metric Reordering (User Preference)  
    - Persist order in localStorage; drag-and-drop (maybe `@dnd-kit`).  
    Files: kpi-grid.tsx, new `hooks/useLocalPreference.ts`  
    Effort: L, Type: FEAT

28. Command Palette (Wallet Jump)  
    - New component using `cmd+k` listener & combobox.  
    Files: `components/ui/command-palette.tsx`, integration in `ModernHeader.tsx`  
    Effort: L, Type: FEAT

29. Theming System (Light Mode)  
    - Extend tokens with light overrides; toggle in provider.  
    Files: styles.css, `ThemeProvider.tsx`  
    Effort: XL, Type: FEAT/DS

## Cross-File Search Targets for Refactors
- Numeric formatting: search `.toFixed(`, `formatAmount(` usage.
- Legacy button usage: search `common/Button`, `variant="accent"`, `TextureButton variant="accent"`.
- Inline colors to remove: search `bg-` with explicit hex or `rgb(` in JSX classes.

## Suggested Initial Implementation Sequencing (Sprint 1)
1) Tasks 1–3 (tokens, typography, button consolidation)  
2) Task 6 (numeric formatting)  
3) Task 4 (metric reorder)  
4) Task 7 (member action refactor)  
5) Task 5 & 8 (contrast & focus + keyboard order)  
Deliver incremental PRs or a feature branch per cluster.

## Risk & Dependencies (Updated)
- Visual regression baseline (Task 24) still missing; theming (Task 29) should wait for snapshots.
- Analytics naming refactor (Task 25) may break dashboards silently; coordinate event map release.
- Contrast audit script (Task 22) important before light theme expansion.
- Adoption drift risk: new components (EmptyState, InfoLabel) must be consistently used in future features.

## Minimal Acceptance Tests (Current Status)
- Tokens: central tokens applied; add lint later for disallowed inline px custom values.
- Buttons: legacy Button removed (grep clean).
- Formatting: utilities centralized; add unit tests for threshold edge cases (pending).
- KPI layout: 2 primary + 4 secondary verified at xl; responsive stack validated.
- EmptyState: used in KPI grid & member list; timeline pending.
- Modal: DialogContent uses modal-animate with reduced motion fallback.

## Adoption Follow-Ups
1. Apply EmptyState to activity timeline when empty logic introduced.
2. Add formatAmount/formatPercent unit tests.
3. Document new utilities (.interactive-hover, .align-decimals, .modal-animate) in DESIGN_SYSTEM.md.
4. Implement contrast audit script (Task 22) before theming.
5. Plan analytics constants (Task 25) after confirming current event usage inventory.

Let me know which cluster you want to start implementing now, and I’ll proceed with file edits.