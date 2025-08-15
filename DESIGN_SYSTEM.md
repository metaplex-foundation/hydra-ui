# Hydra UI Design System (Glass & Luminous)

## 1. Foundations
### Color Tokens (CSS Variables)
Defined in `pages/styles.css`:
- --color-accent / --color-accent-ring: Primary accent (purple glow)
- --glass-bg / --glass-bg-alt: Core translucent backgrounds
#### 2025-08 Accent Update
- Primary accent switched to gold (`--color-accent`) aligning with docs visual language; legacy purple moved to `--color-accent-alt`. Luminous gradient & legacy accent buttons now reference `--color-accent-alt*`; new solid / outline styles use gold primary.

- --glass-border: Subtle inner/outer stroke color
- --glow-accent: Shadow/glow color for accent focus / active states
- Surface legacy (surface-1/2/3) retained for fallback; prefer glass-panel going forward.

### Radii
- --radius-sm, --radius-md, --radius-lg, --radius-xl for consistent curvature.

### Motion
- --motion-duration-{fast,base,slow}
- --motion-ease-standard / expressive
Use sparingly; respect `prefers-reduced-motion`.

## 2. Utilities
Class utilities (in global stylesheet) provide composable visual primitives:
- `glass-panel` + data-elev="0|1|2|3" (depth variants adjust bg/border/inner glow)
- `btn-luminous` (gradient animated accent button)
- `nav-item-active` active sidebar item with animated backdrop + rail
- `input-glass` consistent translucent input styling
- `hero-title` gradient + underline flourish (pseudo element)
- Animation helpers: `gradient-pan`, `shimmer-sweep`

## 3. Components
### TextureButton Variants
`primary` (neutral gradient)
`accent` (legacy rich accent – use luminous instead for primary CTA)
`luminous` (animated gradient CTA)
`glass` (neutral translucent container button)
`secondary`, `minimal`, `icon`, `destructive` (legacy/edge cases)

New (2025-08):
`primarySolid` (gold filled, high emphasis)
`secondaryOutline` (gold outline on glass / transparent)

Prefer: luminous -> primary action; glass -> secondary / idle; icon -> compact control; destructive -> irreversible.

### AsyncTextureButton
Wrapper adding loading state, reuses TextureButton, accepts `onAction`.

### Input
Use `<Input className="input-glass" />` plus size overrides (`h-10`, `h-12`).
Avoid ad hoc bg/ border classes.

## 4. Patterns
- Panels & Cards: always `glass-panel` with appropriate `data-elev` (1: inline list/card, 2: primary container, 3: modal/focus layer)
- Disable state: rely on `disabled:opacity-50` & remove animated gradient; glass fallback variant when disabled on luminous actions (see Load Wallet logic)
- Active Navigation: assign `nav-item-active` only to current route item; ensure text/icon have relative z-index above effect layer.

## 5. Accessibility
- Focus ring unified via `data-focus-ring="true"` applying `--focus-ring` shadow.
- Maintain contrast: luminous text always white; glass text prefers neutral (gray-200/300). Verify min 4.5:1 for body text over backgrounds.
- Animated backgrounds turn off / reduce under `prefers-reduced-motion` (add future enhancement: override animation-duration to 0s).

## 6. Migration Guidance
Legacy classes to phase out:
- surface-1 / surface-2 wrappers -> replace with `glass-panel`
- bespoke gray backgrounds (`bg-gray-800/50`, `border-gray-700/50`) -> `input-glass` or glass-panel segment
- accent actions currently using `variant="accent"` -> consider `luminous` unless specifically needing static accent

## 7. Extensibility
Add a new semantic color accent:
1. Define `--color-accent-alt` & ring in root.
2. Create `.btn-luminous-alt` cloning luminous base with updated gradient stops.
3. Expose variant by extending `TextureButton` variants (add `luminousAlt`).

## 8. Do / Avoid
Do: compose via utilities + variants.
Do: gate new visual primitives behind tokens.
Avoid: inline rgba/hex colors on structural elements.
Avoid: stacking multiple heavy blur layers inside scroll lists (performance).

## 9. Future Enhancements
- Motion reduction wrapper class to suspend gradient animations.
- Elevation shadows tokenization (currently implicit in glass-panel definitions).
- Theme switching expansions (light mode glass mapping) if required.

## 10. Changelog (Initial)
- v1: Introduced glass & luminous system, migrated core pages (index, create, wallet detail, header, sidebar).
