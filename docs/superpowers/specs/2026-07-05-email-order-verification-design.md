# E-Mail-Code-Verifizierung für unbezahlte Bestellungen

**Datum:** 2026-07-05
**Status:** Freigegeben (Design)

## Problem

Bar- und Karte-bei-Lieferung-Bestellungen werden aktuell sofort und ohne jede
Identitätsprüfung an den POS/die Küche geschickt. Das Frontend ruft dazu direkt
`POST /api/create-pos-order` mit `paymentStatus: "OPEN"` auf. Jeder kann mit
ausgedachten Kontaktdaten eine Bestellung auslösen, die zubereitet und
ausgeliefert wird, ohne dass jemals bezahlt wird ("Fake-Bestellung"). Online
(SumUp) ist vorbezahlt und damit nicht betroffen.

## Ziel & Einordnung

Unbezahlte Bestellungen (Bar **und** Karte bei Lieferung) erst nach Bestätigung
eines per E-Mail versendeten 6-stelligen Codes an den POS weiterreichen.

**Was das leistet:** stoppt spontane Fake-Bestellungen mit ausgedachter oder
vertippter E-Mail — es wird ein echtes, erreichbares Postfach erzwungen. Fängt
zusätzlich Tippfehler in der E-Mail ab (Bestätigungen erreichen den Kunden).

**Was das nicht leistet:** kein Schutz gegen einen entschlossenen Angreifer mit
Wegwerf-Postfächern. SMS/starke Identität wären wirksamer, kosten aber Geld.
E-Mail ist die stärkste **kostenlose** Maßnahme. Eine Sperrliste für bekannte
Wegwerf-Domains hebt die Hürde zusätzlich.

## Ablauf

1. Kunde füllt Checkout aus, wählt **Bar** oder **Karte**, klickt „Bestellung
   abschicken".
2. Frontend → `POST /api/order/request-code` `{ email }`.
   - Server validiert E-Mail-Format und lehnt Wegwerf-Domains ab.
   - Erzeugt 6-stelligen Code, legt ihn in Upstash KV ab (TTL 10 Min,
     Versuchszähler), versendet die Mail via Resend.
   - Rate-limited: max. 3 Codes / 10 Min pro IP, 60 s Cooldown pro E-Mail.
3. Frontend zeigt inline ein 6-Ziffern-Eingabefeld („Code an d…@… gesendet"),
   Button „Bestätigen" und Link „Neu senden".
4. Kunde gibt Code ein → `POST /api/order/confirm`
   `{ email, code, orderedItems, customer, payment, zeitpunkt }`.
   - Server prüft den Code (max. 5 Versuche, dann Code invalidiert).
   - **Erst bei Erfolg** wird die POS-Bestellung server-seitig erzeugt
     (`OPEN`, `CASH`/`CARD`). Rückgabe `{ ok, orderRef }`.
5. Frontend leitet auf `/bestellen/danke` weiter.

## Geschlossene Lücke

- Bar/Karte laufen **ausschließlich** über `/api/order/confirm` (hinter dem
  Code-Check). Der Frontend-Aufruf `sendPosOrder("OPEN", …)` entfällt.
- `/api/create-pos-order` **lehnt `paymentStatus: "OPEN"` ab** — unbezahlte
  Bestellungen können nicht am Check vorbei injiziert werden.
- Der PAID/ECOM-Weg (Online, aus `SumUpPayment`/`OrderSuccess`) bleibt
  unverändert.

## Komponenten

- **`server/emailHelpers.ts`** (neu): Resend-Versand, Code-Erzeugung/-Prüfung
  über KV, E-Mail-Validierung + Wegwerf-Domain-Sperrliste. Ohne `RESEND_API_KEY`
  (lokal) wird der Code in die Server-Konsole geloggt statt gemailt (Dev-Test).
- **`server/orderVerification.ts`** (neu): Route-Handler `handleRequestCode`
  und `handleConfirmOrder`. Nutzt `resolveItems`/POS-Logik aus den bestehenden
  Helpers, damit Preise server-seitig bestimmt werden.
- **Registrierung** der zwei Routen in `server/index.ts`, `server/dev.ts`,
  `api/_source.ts`.
- **`client/src/pages/Checkout.tsx`**: Bar/Karte-Zweig ruft `request-code` auf
  und rendert das Code-UI; kein POS-Push mehr aus dem Frontend für Bar/Karte.
- **`server/posHelpers.ts`** (`handleCreatePosOrder`): OPEN-Ablehnung.

## Daten (Upstash KV)

- Schlüssel `otp:<sha256(email)>` → `{ code, attempts, createdAt }`, TTL 600 s.
- Rate-Limit-Schlüssel über bestehendes `rateLimitByIp` (Prefix `otp-req`)
  plus Cooldown-Schlüssel `otp-cd:<sha256(email)>` (TTL 60 s).
- Fällt KV weg (lokal), nutzt derselbe In-Memory-Fallback wie beim Rate-Limit.

## Fehlerbehandlung

- Ungültiger/abgelaufener Code → klare Meldung + „neu senden".
- Zu viele Versuche → Code invalidiert, neuer Code nötig.
- **Resend-Ausfall → fail-closed**: Bestellung wird NICHT durchgelassen.
  Meldung: „Verifizierung gerade nicht möglich. Bitte später erneut versuchen
  oder telefonisch bestellen: +49 491 997 55279."
- Wegwerf-Domain/ungültige E-Mail → Meldung, Code wird nicht versendet.

## Umgebungsvariablen (neu)

- `RESEND_API_KEY` — API-Key aus dem Resend-Dashboard.
- `ORDER_FROM_EMAIL` — z.B. `Burger Station <noreply@deine-domain.de>`
  (Domain muss in Resend verifiziert sein).

## Bewusst nicht im Scope (Folge-Punkte)

- Absicherung von `/api/create-pos-order` für `PAID`/`ECOM` gegen Injektion
  gefälschter „bezahlt"-Bestellungen (Verifikation des SumUp-Checkout-Status).
- SMS-/Telefon-Verifizierung (kostenpflichtig).
