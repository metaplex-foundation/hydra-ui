# Hydra UI UX / Design Refactor Backlog

Status Legend: [ ] Pending  [~] In Progress  [x] Complete  [!] Blocked

## P0 Foundational
1. [x] Tokens & spacing consolidation (tailwind + CSS vars)
2. [x] Typography scale & tabular numerals utilities
3. [x] Button variant rationalization & deprecate legacy Button.tsx
4. [x] KPI metric hierarchy reorder & primary emphasis sizing
5. [x] Contrast adjustments & focus ring consistency
6. [x] Unified numeric formatting (percent + threshold) & replace manual toFixed
7. [x] Members table action refactor (remove per-row primary distribute)
8. [x] Keyboard navigation & focus order review (skip link + outline offset + nav focusable)
- 2025-08-10: Completed tasks #5 and #8 (contrast tuning & full focus audit); P0 phase finished.
- 2025-08-10: Completed tasks #3, #7; task #8 started (skip link); next: contrast/focus pass (#5) and finalize focus order (#8).

## P1 Structural & IA
9. [ ] Create Wallet stepper flow (replace 3-column)
9. [x] Create Wallet stepper flow (replace 3-column)
10. [x] Consolidated wallet hub screen (merge list + load/create)
11. [x] Shares allocation progress indicator
12. [x] Standardized skeleton states extraction
13. [x] Footer spacing & max-width consistency
14. [x] Context panel (merge token selection + addresses)

## P2 Refinement
15. [x] KPI grid adaptive layout (2 large + 4 small)
16. [x] Glossary tooltip abstraction (InfoLabel)
17. [x] Empty states componentization
18. [x] Button interaction polish (hover/active, reduced motion) – interactive-hover utility applied to buttons
19. [x] Decimal alignment utility class
20. [x] Modal entrance animation tokens

## P3 Documentation & Automation
21. [ ] Microcopy standards doc / update DESIGN_SYSTEM.md
22. [ ] Contrast report script
23. [ ] Component inventory / Storybook or MDX index
24. [ ] Visual regression (Playwright snapshot tests)
25. [ ] Analytics event constants & replace string literals

## P4 Future Enhancements
26. [ ] Inline editable member shares
27. [ ] User metric reordering & persistence
28. [ ] Command palette (wallet jump)
29. [ ] Theming (light mode) expansion

### Change Log
- 2025-08-10: Completed task #9 (Create Wallet stepper integrated on create page).
- 2025-08-10: Completed tasks #10 & #11 (wallet hub consolidation + reusable progress bar component).
- 2025-08-10: Completed task #12 (standardized skeleton variants + replaced ad-hoc inline pulses).
- 2025-08-10: Completed task #1 (spacing & radius tokens integrated into Tailwind).
- 2025-08-10: Completed tasks #13 & #14 (footer layout normalization + unified wallet context panel replacing separate token & address panes).
- 2025-08-10: Completed task #15 (adaptive KPI grid: two emphasized primary metrics + four compact metrics responsive).
- 2025-08-10: Completed task #16 (InfoLabel component + replaced ad-hoc KPI tooltip buttons).
- 2025-08-10: Completed task #17 (EmptyState component + KPIGrid empty refactor).
- 2025-08-10: Completed task #18 (interactive-hover utility + applied to TextureButton variants respecting reduced motion).
- 2025-08-10: Completed task #19 (decimal alignment utilities added to stylesheet: .align-decimals).
- 2025-08-10: Completed task #20 (modal animation tokens + .modal-animate with reduced motion fallback).
