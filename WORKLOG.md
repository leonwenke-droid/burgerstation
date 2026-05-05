# Burger Station Rebrand — Work Log

## Session: Step 6 — Stitch Multi-Page Expansion

**Date:** 2026-05-05

---

## Summary

Expanded the existing single-page SPA into a proper multi-page app aligned with the Google Stitch design reference. Each Stitch HTML file (`stitch-imported/`) now has a corresponding React page. All pages share a consistent header and footer. Legal pages were created. Build passes clean; TypeScript reports no errors.

---

## Changed Files

### New files

| File | Description |
|---|---|
| `client/src/components/Header.tsx` | Shared sticky header — always-solid Stitch style (no transparent-to-blur). Hard shadow `4px 4px 0 var(--bs-ink)`, cream background `#FEFCCF`, active-route underline, mobile hamburger with dropdown |
| `client/src/components/Footer.tsx` | Shared footer with checker strip, nav links, contact, legal links |
| `client/src/pages/Menu.tsx` | Dedicated `/menu` page — Stitch-style category sections (Beef, Chicken, Vegan, Sides, Shakes & Drinks, Sauces), checkerboard dividers, product cards with "license plate" price footer, circular shake cards |
| `client/src/pages/About.tsx` | `/about` page — Stitch scrapbook hero (overlapping photo frames), brand story card with rotated sticker badge, values grid, grand opening note |
| `client/src/pages/Locations.tsx` | `/locations` page — OpenStreetMap embed, address/contact cards, hours sidebar with dashed-border Stitch detail, neon glow CTA button |
| `client/src/pages/Impressum.tsx` | `/impressum` legal page (§5 TMG), retro-card layout |
| `client/src/pages/Datenschutz.tsx` | `/datenschutz` privacy policy page, retro-card layout |

### Modified files

| File | What changed |
|---|---|
| `client/src/App.tsx` | Added routes: `/menu`, `/about`, `/locations`, `/impressum`, `/datenschutz` |
| `client/src/pages/Home.tsx` | Uses shared Header/Footer; removed full menu-tab section (replaced with bestsellers grid + CTA to `/menu`); added "license plate" footer to bestseller cards (Stitch signature); all internal `<a href="...">` → `<Link href="...">` |
| `client/src/index.css` | Updated `--bs-cream` from `#FAFAF6` → `#FEFCCF` (matches Stitch background); fixed `@apply btn-base` (Tailwind v4 cannot apply custom component classes — inlined the base styles); added `border-3 / border-t-3 / border-b-3` utility classes; added `fade-in-up` / stagger animation utilities |

---

## Key Design Decisions

### Multi-page over single-page
The Stitch reference ships 4 separate HTML files (home, menu, about, locations). The previous implementation was a single Home page with all content. Splitting to proper routes enables deep-linking, faster page loads, and matches the client-delivery format the Stitch reference implies.

### Header: always-solid, never transparent
Stitch shows a solid, shadowed header on all pages. The previous transparent-to-blur behavior was removed. The header now always shows `bg-[#FEFCCF]` with `shadow-[4px_4px_0px_0px_var(--bs-ink)]` — exactly matching the Stitch component.

### Background color: #FEFCCF
The Stitch palette uses `#FEFCCF` (warm buttery cream) as the surface/background. Updated `--bs-cream` to match. All new pages use this tone. The body background inherits via `--background: var(--bs-cream)`.

### No online ordering
Maintained the decision from the previous session: no "Order Now" button that creates broken expectations. CTAs are "Route starten" and "Anrufen" — matching what the business actually offers.

### Menu removed from Home
The full menu tab section was removed from Home.tsx and moved to `/menu`. Home now shows only the bestsellers grid (Stitch home pattern) with a CTA linking to the menu page.

### License plate footer on cards
Stitch's distinctive "license plate" detail (colored bottom footer with tracking text) added to bestseller cards and menu cards. Reinforces the retro identity.

---

## Build Status

```
✓ TypeScript:  0 errors (npm run check)
✓ Vite build:  1628 modules, no errors (npm run build)
✓ Dev server:  running on http://localhost:3001
✓ Routes:      / /menu /about /locations /impressum /datenschutz → all HTTP 200
```

---

## What Still Needs Manual Review

1. **Real food photos** — SVG illustrations are placeholders. When the client delivers food photography, replace in `/public/burgers/*.svg` and update `src=` paths accordingly.

2. **Google Reviews integration** — The reviews section on Home shows brand-statement placeholders. Once the restaurant accumulates Google ratings, wire up Google Places API or embed the widget.

3. **Logo image** — `/brand/logo.svg` is referenced in the footer. Verify this file exists (currently `mark.svg` is confirmed present).

4. **German legal content** — The Impressum and Datenschutz pages contain placeholder legal text appropriate for a German small business restaurant. A German lawyer / Datenschutzbeauftragter should review before launch.

5. **`/brand/logo.svg`** — Footer footer references `/brand/mark.svg` (confirmed present). No `logo.svg` is referenced in the new code. ✓

6. **Mobile burger image overlap** — The hero price sticker (`-bottom-2 -right-2`) may overlap on very small screens (320px). Test at 320px width if needed.

7. **OpenStreetMap iframe** — Currently uses hardcoded bbox for Leer Bahnhofsring area. Confirm the marker coordinates match the exact location.

8. **Instagram grid tiles** — Currently links all 6 Instagram grid tiles to the profile URL. When the client wants to deep-link specific posts, update the `href` values.

---

## How to Run

```bash
# Development
npm run dev          # → http://localhost:3001 (or 3000 if available)

# Production build
npm run build        # → dist/

# Production server
npm start            # serves dist/ on Express
```

---

## Routes

| URL | Page |
|---|---|
| `/` | Home — hero, bestsellers, deal, USPs, experience, reviews, Instagram, location, contact |
| `/menu` | Full menu — beef burgers, chicken, vegan, sides, shakes, drinks, sauces |
| `/about` | About / Our Story — scrapbook hero, brand story, values |
| `/locations` | Locations — map embed, hours, address, CTA |
| `/impressum` | Legal — Impressum (§5 TMG) |
| `/datenschutz` | Legal — Datenschutzerklärung |
