# Burger Station Rebrand — Work Log

---

## Session: Step 6 Redux — Full Stitch Visual Design Transplant

**Date:** 2026-05-06

---

## Context

The client rejected the Step 6 implementation ("not strong enough") and demanded a complete visual design transplant: "I do NOT want a lightly restyled version of the old website. I want a visual design transplant." The Stitch reference is the authoritative visual system; the existing site content is the business source of truth.

---

## Root Cause of Prior Failure

The core issue was that the CSS token system was fundamentally wrong:

| Token | Old (wrong) | New (Stitch) |
|---|---|---|
| `--bs-ink` | `#0a1530` (navy blue) | `#1d1d03` (olive-black) |
| `--bs-pink` | `#FF2D87` (hot pink) | `#006a62` (teal primary) |
| Primary button | hot pink | teal |
| Secondary button | turquoise | peach (#fed4c8) |
| Checker pattern | navy+white | teal+cream (#006a62+#fefccf) |
| Section alt bg | none | `#eceabe` surface-hi |

The wrong ink color (#0a1530 navy vs #1d1d03 olive-black) affected every border and shadow across the whole site. The wrong primary color (hot pink vs teal) made the entire brand identity wrong.

---

## Changed Files

### `client/src/index.css` — Complete token system rebuild

- **`--bs-ink: #1d1d03`** — biggest impact, olive-black as per Stitch spec
- **`--bs-pink: #006a62`** — remapped to teal (primary action color)
- **`btn-pink`** → teal fill, white text (primary CTA)
- **`btn-cyan`** → peach (#fed4c8) fill, ink text (secondary CTA)
- All checker patterns now use `#006a62` teal on `#fefccf` cream
- `hero-gradient` → plain cream background
- `stripes-yellow-black` → teal+cream checker (used in CTA banners)
- `neon-text-pink` → teal color with turquoise drop-shadow (not glow)
- `neon-flicker` → empty rule (removes flicker animation)
- Added: `--bs-teal`, `--bs-peach`, `--bs-primary-f`, `--bs-surface-hi`, `--bs-surface-top`, `--bs-ink-v`
- Full backwards-compat aliases maintained so no component breaks

### `client/src/components/Header.tsx`

- Active nav: teal underline instead of pink
- Mobile active state: turquoise bg tint instead of pink-cream

### `client/src/components/Footer.tsx`

- Background: `#e6e5b9` (surface-container-highest) instead of cream
- Checker strip: teal+cream (was pink+white)
- All hover colors: teal instead of pink

### `client/src/pages/Home.tsx` — Full section-by-section redesign

| Section | Before | After |
|---|---|---|
| Hero | Pink gradient, floating circles, SVG ring spinner | Plain cream, rounded-full image with border+peach-glow, teal drop-shadow heading, yellow sticker |
| Ticker | Dark ink bg, yellow text, neon classes | surface-hi bg + teal checker bg, ink text, teal stars |
| Bundle CTA | Dark ink bg | Teal checker bg + cream overlay + peach card with ink shadow |
| USPs | White bg, gradient circles | surface-hi bg, white circles with ink border, teal text |
| Reviews | cyan-cream bg | surface-hi bg |
| Location | pink-cream bg | surface-hi bg |
| Contact | Dark ink bg, white text | surface-top bg, checker strip, ink text |
| Cards | bs-pink-cream image area, pink price text | peach image area, teal price text, primary-fixed license plates |

### `client/src/pages/Menu.tsx`

- All card backgrounds: `#FEFCCF` → `white` (cards on cream background)
- Badge stickers on cards: pink → yellow
- Category headers: pink → teal, cyan → turquoise
- Checker dividers: `var(--bs-ink)` → explicit `#006a62`
- Bottom CTA: dark ink box → teal checker bg + peach card
- "FRISCH!" badge: pink → yellow

### `client/src/pages/About.tsx`

- Values section: `bg-bs-ink text-white` → `bg-bs-surface-hi text-bs-ink`
- Value cards: `bg-bs-ink border-white` → `bg-white border-bs-ink`
- Checker divider: teal instead of ink
- All existing `bg-bs-pink` references now render as teal (correct primary)

### `client/src/pages/Locations.tsx` — Full rewrite

- Removed pink glow shadow on hours card
- Card backgrounds: hardcoded `#FEFCCF` → `bg-white`
- Card image areas: peach and turquoise (Stitch)
- License plate footers: primary-fixed (turquoise) and peach
- Walk-in note: dark ink box → peach card
- CTA button hover: removed pink glow
- All accent colors: teal

---

## Build Status

```
✓ TypeScript:  0 errors (npm run check)
✓ Vite build:  1628 modules, no errors (npm run build)
✓ Dev server:  running on http://localhost:3000
✓ Routes:      / /menu /about /locations /impressum /datenschutz → all HTTP 200
```

---

## What Still Needs Manual Review

1. **Real food photos** — SVG illustrations are placeholders. Replace in `/public/burgers/*.svg`.
2. **Google Reviews integration** — Reviews section shows brand-statement placeholders until real ratings arrive.
3. **German legal content** — Impressum and Datenschutz need lawyer review before launch.
4. **OpenStreetMap iframe** — Confirm marker coordinates match exact location.
5. **Instagram grid tiles** — Currently all 6 link to the profile URL; deep-link specific posts when client provides them.

---

## Design Principles Applied

- **No dark sections** — All section backgrounds use the Stitch surface hierarchy (cream, surface-hi, surface-top). No `bg-bs-ink` full-section backgrounds.
- **Teal is primary** — #006a62 for buttons, heading accents, active nav. Not pink, not cyan.
- **Olive-black ink** — #1d1d03 for all borders, shadows, text. Not navy.
- **Hard shadows, zero blur** — Signature Stitch aesthetic.
- **Teal+cream checker** — Used for dividers and CTA banner backgrounds.
- **Cards are white** — On the cream-to-surface-hi backgrounds, cards use white (#ffffff).
- **License plates** — Colored footer strips on cards (primary-fixed, peach, yellow) for Stitch signature detail.

---

## Previous Sessions

### Session: Step 6 — Stitch Multi-Page Expansion (2026-05-05)
Created multi-page app with Header/Footer, all 6 routes. Visual system was wrong
(hot pink primary, navy ink, neon glows). This session replaced that visual system.

### Steps 1–5 (previous sessions)
Token system, typography, hex purge, spacing normalization, static data extraction.
