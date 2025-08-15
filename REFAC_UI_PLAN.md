# UI Refactor Roadmap (Refactoring UI Principles Applied Holistically)

Date: 2025‑08‑10 (expanded scope)

This plan widens from a single component tweak to a systematic layout + design language refinement guided by Adam Wathan & Steve Schoger's "Refactoring UI" principles: clarity, hierarchy, purposeful spacing, contrast, and reduction of accidental complexity.

## Core System Goals
1. Hierarchy & Scanability: Each screen should have a clear primary action, obvious grouping, and scannable section headings (consistent typographic scale + spacing rhythm).
2. Consistent Rhythm: Vertical spacing locked to the token scale (4 / 8 based) – eliminate arbitrary `mt-7`, `space-y-3.5`, etc.
3. Intentional Color & Contrast: Use semantic surface + intent tokens, avoid ad‑hoc opacity tweaks; unify glass/elevation layers.
4. Fewer Containers: Reduce nesting depth; flatten when a wrapper adds little semantic meaning.
5. Progressive Disclosure: Secondary/tertiary actions visually quieter (ghost/subtle), destructive isolated with extra affordance.
6. Reuse > Reinvent: Prefer Catalyst components (already aligned with Refactoring UI) + thin wrappers for project‑specific tokens.
7. Motion & Feedback: Subtle, consistent transitions (dur-fast/med) and micro‑interactions (hover lift, active press) applied uniformly.
8. Accessibility: Maintain contrast ratios, focus visibility, touch target min (>= 44px), ARIA roles on custom menus.

## Current Gaps (Audit Highlights)
- Navigation: `TopNav` contains search, environment select, wallets, creation, wallet sections – high cognitive load in one horizontal bar.
- Section Anchors: Inline buttons for `overview / token-selection / addresses` visually compete with primary actions.
- Spacing Variance: Mixed use of `px-4`, `px-6`, `px-8` without clear breakpoint rules.
- Repeated Dropdown Patterns: Environment + wallet list share near‑duplicate markup/logic.
- Button Variants: Legacy + texture + catalyst + new unified button coexist (increases inconsistency risk).
- Surface Layers: Mix of `bg-[var(--glass-bg)]/50`, `glass-panel`, and inline rgba backgrounds; need elevation scale mapping.
- Typography: Headings not always leveraging the `.text-h*` utilities; occasional ad‑hoc sizing.
- Async Patterns: Multiple styles of loading indicators (spinner components, text replacement, disabled states) need consolidation.

## Structural Refactor Phases

### Phase 1 – Foundations (In Progress)
- [x] Unify button system (semantic variants & intents).
- [ ] Introduce layout primitives: `Page`, `Section`, `SectionHeader`, `Card` (thin wrappers around Catalyst components + tokens).
- [ ] Elevation scale: map `data-elev={0..3}` to a Tailwind plugin or utility classes (replace ad‑hoc backgrounds).
- [ ] Abstract dropdown/popover pattern (environment + wallet lists) to a single accessible component (Radix `Popover` or `Menu` under the hood).

### Phase 2 – Navigation & IA
- Split `TopNav` into: `PrimaryNav` (logo + global actions) and `ContextBar` (wallet‑specific anchors) that only renders on wallet pages beneath the main bar.
- Move wallet section jump links into a secondary sub‑nav with subdued styling (smaller size, subtle background, sticky below main nav).
- Convert environment selector into an icon/button with a panel containing richer context (status, latency placeholder, etc.).

### Phase 3 – Dashboard / Wallet Page Layout
- Introduce grid system utility (e.g., `.layout-grid` defining max width + column gap) and standard section spacing: `Section` default vertical margin = `space-10`.
- Replace scattered div wrappers with semantic `<section>` + `<header>` patterns.
- Standardize KPI / card collection using a shared `Card` component w/ optional `Card.Header`, `Card.Body`, `Card.Foot` slots.

### Phase 4 – Async & Feedback
- Global `InlineSpinner` + `LoadingState` variants (skeleton vs. shimmer vs. numeric placeholder) with a single tokenized animation.
- Introduce toast/notice pattern consistent with surface/elevation tokens; deprecate bespoke notifications.

### Phase 5 – Documentation & Hardening
- Generate MDX or Storybook showcase for: layout primitives, cards, nav bars, dropdowns, buttons, async states.
- Lint rules / codemods to prevent introducing legacy patterns (`common/Button`, raw glass backgrounds).

## Immediate Action Items (Next Commits)
- [ ] Add `components/layout/ContextBar.tsx` for wallet sub‑navigation (use existing scroll spy hook) and remove those buttons from `TopNav`.
- [ ] Add `components/primitives/Section.tsx` + `Card.tsx` (composition over config). 
- [ ] Create Tailwind plugin (or interim utilities file) mapping elevation tokens -> class names (`elev-0`..`elev-3`).
- [ ] Refactor environment & wallet dropdowns to shared `Menu` primitive.

## Example New Primitives (Sketch API)
```tsx
<Page>
   <Section title="Overview" description="High-level metrics" actions={<Button size="sm">Refresh</Button>}>
      <KpiGrid />
   </Section>
   <Section title="Distributions" density="comfortable">
      <Card.Group>
         <Card>
            <Card.Header title="Token Balances" />
            <Card.Body><BalancesTable /></Card.Body>
         </Card>
      </Card.Group>
   </Section>
</Page>
```

## Mapping Principles to Tactics
| Principle | Tactic |
|-----------|--------|
| Use fewer borders | Prefer subtle shadow + contrast difference; borders only for separation in dense zones |
| Establish hierarchy with size/weight/color | Use heading scale + accent color sparingly for primaries |
| Reduce noise | Remove redundant wrappers, unify dropdown component, consistent spacing scale |
| Make actions obvious | Primary action = solid accent; secondary = outline/ghost; destructive isolated bottom-right |
| Provide breathing room | Standard vertical section spacing and internal card padding tokens |

## Completed This Session
- Unified Button (see previous section) as enabling step.

## Deferred / Considerations
- Light theme pass (token overrides) later.
- Motion reduction preferences respected (already partly in CSS) – extend to new primitives.
- Potential theme switcher once dark baseline is stable.

## Rollout Strategy
1. Land primitives + context bar (feature‑flag behind env var if desired).
2. Migrate one page (wallet) as reference implementation.
3. Codemod remaining pages/components.
4. Add visual regression stories.

---
This document will evolve; treat as a living roadmap. Edits welcome.
