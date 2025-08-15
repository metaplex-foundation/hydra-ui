# CONTINUE

Concise status + next-step guide for ongoing UX refactor & Catalyst adoption.

## 1. What Was Just Done
- Purged legacy `TextureButton` + `AsyncTextureButton` usage across pages (`index`, wallet detail, dashboard modals, member list, load/create panels, headers, sidebar).
- Replaced with consolidated `Button` (Catalyst-inspired) and `AsyncButton` wrappers.
- Removed the obsolete `components/ui/texture-button.tsx` file and stray imports.
- Normalized variant logic: using `color` (solid), `outline`, or `plain` booleans instead of custom variant strings.
- Fixed runtime "Element type is invalid" error (root cause: relying on components that resolved to `undefined` / unsupported exports in earlier abstraction path; simplified to direct, valid React elements).
- Eliminated wrapper indirection (UnifiedButton / legacy luminous styles) to reduce surface area and SSR risk.
- Adjusted multiple components to remove variant-specific class dependencies and rely on base Tailwind tokens.

## 2. Current Button System
`components/catalyst-ui-ts/button.tsx` provides:
- Props: `color` (palette key), `outline`, `plain`, anchor support via `href` (renders `<a>`), plus standard button attributes.
- Internal `TouchTarget` for minimum hit area.
- Color scales implemented via CSS variable-aware class clusters.

`AsyncButton`:
- Wraps the Button; handles async `onAction` with loading state + optional `loadingText` & spinner.
- Ensures disabled + cursor state while pending.

## 3. Codebase State Snapshot
| Area | Status |
|------|--------|
| Button migration | COMPLETE (legacy removed) |
| Async interactions | Converted base async pattern (distribution, add token) |
| Layout (TopNav, dashboard panels) | Using simplified buttons |
| Sidebar / ModernHeader | ModernHeader deprecated; Sidebar still present but refactored buttons |
| Catalyst extended components (navbar, sidebar, badges, etc.) | Present; verify removal of unsupported HeadlessUI Button variants if reintroduced |
| Token & surface design tokens | In place (not yet fully mapped to Catalyst naming) |
| Accessibility: focus ring & touch target | Focus ring via data attribute earlier; touch target in new Button |

## 4. Verification Performed
- Type checks: no TypeScript errors after migrations.
- Grep confirms no remaining `TextureButton` imports.
- Runtime: Home page now renders without the previous invalid element error.

## 5. Technical Debt / Follow-Ups
1. Unify Design Tokens: Map `--color-accent` & surface tokens to Catalyst semantic layer for consistent theming.
2. Remove Luminous CSS: Prune obsolete `.btn-luminous` / brightness hover styles in `styles.css` if unused.
3. Audit Catalyst Components: Ensure no lingering references to unsupported `Headless.CloseButton` / `Headless.Button` in Catalyst-derived sidebar/navbar; replace with native `button` or anchor if re-enabled.
4. Form Elements: Consider replacing custom `Input` with Catalyst-aligned input styling (consistent radius, focus outlines).
5. State Density Toggle (optional P3): Provide compact vs. spacious layout toggle once core migration stable.
6. Visual Regression Baseline: Capture screenshots (Storybook or Playwright) post-migration to detect styling regressions in future refactors.
7. Accessibility Pass: Re-check contrast after color token remap; verify keyboard reachability & focus order.
8. Analytics Event Consolidation: Normalize event naming (e.g., `wallet_open` sources) into a single util to prevent drift.
9. Tree Shaking / Dead CSS: Run a purge (Tailwind JIT handles most) but confirm removal of now-unused classes and variables.
10. Error & Loading States: Add skeleton or inline error boundaries for async wallet/member panels.

## 6. Recommended Immediate Next Step
Perform a quick audit of Catalyst sidebar/navbar files to ensure no reintroduction of unsupported HeadlessUI element names; simplify if necessary (replace with native `<button>` / `<a>` + motion where needed).

## 7. Rollback Plan
If unforeseen regressions appear:
1. Reintroduce prior button file from VCS (before purge) on a throwaway branch.
2. Incrementally port single section at a time while diffing computed styles in DevTools.

## 8. Success Criteria Going Forward
- Zero runtime console errors (React warnings, invalid element types).
- Shared button styling consistent across all entry points (home, wallet detail, modals).
- No dead legacy component files lingering.
- Accessibility: All interactive elements have at least 44px touch target (handled) & visible focus.

## 9. Quick Reference: Button Usage
```tsx
<Button color="indigo" onClick={...}>Primary</Button>
<Button outline onClick={...}>Secondary</Button>
<Button plain onClick={...}>Tertiary</Button>
<Button href="/create" color="indigo">Anchor Action</Button>
<AsyncButton onAction={doAsync} loadingText="Saving" color="indigo">Save</AsyncButton>
```

---
Maintainer note: Continue with token alignment + form component unification before expanding new feature surface to avoid inconsistent future retrofits.
