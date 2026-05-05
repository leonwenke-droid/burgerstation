# Burger Station Leer — Rebrand

Rebrand der bestehenden Codebase auf Agenturlevel. American Retro Diner Look, individuell für Burger Station Leer.

## Was geändert wurde

### Komplett neu
- `client/src/pages/Home.tsx` — alle Sections von Grund auf neu strukturiert
- `client/src/index.css` — neues Design-System (Tokens, Buttons, Cards, Animationen)
- `client/index.html` — SEO Meta, Schema.org Restaurant, Open Graph, neue Fonts
- `client/public/brand/logo.svg` — Logo-Rekonstruktion aus Instagram-Vorlage
- `client/public/brand/mark.svg` — kompakte Logo-Mark für Header/Favicon
- `client/public/burgers/*.svg` — 6 hochwertige Burger-Illustrationen (Hero + 4 Bestseller + Sides)
- `client/public/patterns/*.svg` — 3 Interior-Mockups (Neonwand, Booth, Storefront) + Checker

### Designsystem
- **Farben**: Neon Pink `#FF2D87`, Neon Cyan `#00E0E0`, Yellow `#FFE15D`, Ink `#0a1530`, Cream `#FAFAF6`
- **Typografie**: Bebas Neue (Display), DM Sans (Body), Monoton & Permanent Marker (Akzente)
- **Buttons**: Hard-Shadow Retro-Style mit Hover-Translate
- **Cards**: 2px Border + 6px Hard-Shadow, Hover Lift
- **Animationen**: Neon Flicker, Pulse Glow, Float, Spin, Ticker Marquee

### Sections (in Reihenfolge)
1. **Header** – sticky, transparent → blur on scroll, Logo + Nav + CTA
2. **Hero** – Status-Badge "seit Mai 2025 geöffnet", H1 mit Neon-Effekt, 3 CTAs, Trust-Badges, Hero-Burger mit Sunburst + Sticker-Preis
3. **Marquee Ticker** – läuft Text durch ("Smash Burgers · Halal & Handmade · ...")
4. **Erlebnis** – Headline + Interior-Collage + 3 Feature-Cards + Instagram-Tag-Prompt
5. **Bestseller** – 4 Cards (Double Smash, Long Chili Cheese, BBQ Smash, Croissant Smash), je Bild + Badge + Preis
6. **Bundle** – auf Ink-Background mit gelb-schwarzen Streifen, Burger+Fries+Drink ab +3€
7. **USPs** – 4 Kreise (Handmade, 100% Halal, Fries & Shakes, Retro Diner)
8. **Menü** – Tabs (Beef/Chicken/Vegan/Sides/Sauces/Shakes/Drinks), horizontal scrollbar mobile, alle Preise korrekt
9. **Reviews** – ehrlich gelöst: keine Fake-Reviews, stattdessen "Frisch eröffnet — erste Stimmen folgen" + 3 Brand-Statement-Cards + CTA "Auf Google bewerten"
10. **Instagram** – Headline + 6 Tile Grid (verlinkt auf Instagram)
11. **Standort** – OpenStreetMap-Embed + Adresse-Card + Öffnungszeiten-Card + Telefon-Card
12. **Kontakt** – auf dunklem Background, 3 CTAs (Anrufen, Route, Instagram)
13. **Footer** – heller, Logo + Adresse + Kontakt + Impressum/Datenschutz
14. **Sticky Mobile CTA** – Menü / Route / Anruf

## Verifizierte Daten (aus Instagram-Screenshot)
- **Adresse**: Bahnhofsring 30, 26789 Leer
- **Telefon**: 0491 99 755 279
- **Instagram**: @burgerstationleer
- **Öffnungszeiten**: So–Do 11:00–23:00, Fr&Sa 11:00–02:00 (aus Instagram Post bestätigt)
- **Eröffnung**: 02.05.2026 (Grand Opening)
- **Bio**: "Authentic American Smash Burgers · Fries · Shakes · Retro Vibes · Halal & Handmade"

## Wichtige Entscheidungen / Disclaimer

### Bilder
Die Burger-Bilder sind als **SVG-Illustrationen** umgesetzt — kein Foto-Stock, keine geklauten Bilder, keine fragwürdigen Lizenzen. Stilistisch passend zum Diner-Look (Hard-Outline, flat shapes, Pastell + Neon). Wenn der Kunde eigene Foto-Assets hat, einfach an der gleichen Stelle in `/public/burgers/` ablegen und Pfade in `Home.tsx` (Bestseller-Array, Hero-Img-src, Instagram-Tiles) anpassen.

### Reviews
**Keine Fake-Reviews.** Der Laden hatte Grand Opening am 02.05.2026 — echte Google-Bewertungen liegen praktisch noch nicht vor. Die Section ist als Brand-Statement-Block gelöst und verweist explizit darauf, dass echte Reviews später eingebunden werden. Zusätzlich CTA "Auf Google bewerten" verlinkt direkt zur Google-Suche.

### Bestellen-Buttons
**Bewusst entfernt.** Es gibt kein Online-Bestellsystem. Stattdessen Hinweis "Vor Ort bestellen" + Anruf + Route. Keine kaputten/erwartungsweckenden Buttons.

### Map
OpenStreetMap-Embed statt Google Maps Iframe — keine API-Key-Abhängigkeit, kein Tracking, ladbar offline-fähig im Hosting. Kann später durch Google Maps Embed ersetzt werden, wenn der Kunde das wünscht.

## Run

```bash
npm install --legacy-peer-deps
npm run dev    # Vite Dev Server
npm run build  # Production Build → dist/
npm start      # Production-Server (Express)
```

## Was als Nächstes (für die Verkaufs-Präsentation)
- Echte Foodfotos einbauen (Kunde sollte 5–8 hochwertige Foodshots liefern: Double Smash, Long Chili Cheese, BBQ Smash, Croissant Smash, Fries, Shake, Interior, Storefront bei Nacht)
- Echte Google-Bewertungen einbinden (Google Places API oder manuell pflegen)
- Impressum + Datenschutz Pages tatsächlich anlegen
- Optional: Reservierung/Kontaktformular (wenn der Kunde das möchte)
- Optional: WhatsApp-Button (nur wenn echter WhatsApp-Account)
