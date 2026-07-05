# E-Mail-Code-Verifizierung für unbezahlte Bestellungen — Implementierungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bar- und Karte-bei-Lieferung-Bestellungen erst nach Bestätigung eines per E-Mail (Resend) versendeten 6-stelligen Codes an den POS weiterreichen.

**Architecture:** Zwei neue Server-Endpunkte (`/api/order/request-code`, `/api/order/confirm`) erzeugen/prüfen den Code in Upstash KV und pushen die Bestellung erst nach erfolgreicher Prüfung server-seitig. Der POS-Push wird aus `handleCreatePosOrder` in eine wiederverwendbare `createPosOrder()`-Funktion extrahiert. `/api/create-pos-order` lehnt danach unbezahlte (`OPEN`) Bestellungen ab, sodass der Check nicht umgangen werden kann. Das Frontend zeigt für Bar/Karte ein Inline-Code-Feld statt sofort zu bestellen.

**Tech Stack:** TypeScript, Express, Upstash Redis (REST, via bestehendem `kvStore`), Resend HTTP-API (fetch, keine npm-Abhängigkeit), Vitest (bereits installiert), React + wouter (Frontend).

## Global Constraints

- Fail-closed bei E-Mail-Versand-Fehler: Bestellung wird NICHT durchgelassen.
- Fehlermeldung bei Versand-/Verifizierungsausfall nennt Telefon-Fallback: `+49 491 997 55279`.
- Kein Code-Change nötig für Domain-Rollout: Versand über `RESEND_API_KEY` + `ORDER_FROM_EMAIL` (Default `onboarding@resend.dev`); ohne `RESEND_API_KEY` wird der Code in die Server-Konsole geloggt.
- Verifizierung gilt für Bar **und** Karte bei Lieferung. Online (SumUp) bleibt unverändert.
- Code: 6 Ziffern, TTL 600 s, max. 5 Fehlversuche.
- Bestehende Muster einhalten: KV-Zugriffe über `server/kvStore.ts`, Anti-Abuse über `rateLimitByIp` / `checkSameOrigin` aus `server/security.ts`.
- Keine neuen npm-Abhängigkeiten.

---

### Task 1: `kvSetEx` — KV-Set mit Ablaufzeit

**Files:**
- Modify: `server/kvStore.ts` (nach `kvSet`, ca. Zeile 48)
- Modify: `package.json` (scripts: `test` ergänzen)
- Test: `server/kvStore.test.ts` (neu)

**Interfaces:**
- Produces: `kvSetEx(key: string, value: string, ttlSeconds: number): Promise<void>`

- [ ] **Step 1: `test`-Script ergänzen**

In `package.json` bei `scripts` diese Zeile hinzufügen (nach `"check": "tsc --noEmit",`):

```json
    "test": "vitest run",
```

- [ ] **Step 2: Failing test schreiben**

Create `server/kvStore.test.ts`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { kvSetEx, kvGet, kvDel } from "./kvStore";

describe("kvSetEx (in-memory fallback)", () => {
  beforeEach(() => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  });

  it("stores and reads back a value", async () => {
    await kvDel("t:1");
    await kvSetEx("t:1", "hello", 600);
    expect(await kvGet("t:1")).toBe("hello");
  });
});
```

- [ ] **Step 3: Test ausführen — muss fehlschlagen**

Run: `npx vitest run server/kvStore.test.ts`
Expected: FAIL — `kvSetEx` is not exported / not a function.

- [ ] **Step 4: `kvSetEx` implementieren**

In `server/kvStore.ts` direkt nach der `kvSet`-Funktion (nach Zeile 48) einfügen:

```ts
/** Like kvSet but with an expiry (seconds). In-memory fallback ignores the TTL —
 *  callers that need expiry in dev should also carry an expiresAt in the value. */
export async function kvSetEx(key: string, value: string, ttlSeconds: number): Promise<void> {
  if (upstashEnabled()) {
    await upstashReq(["SET", key, value, "EX", String(ttlSeconds)]);
  } else {
    mem.set(key, value);
  }
}
```

- [ ] **Step 5: Test ausführen — muss bestehen**

Run: `npx vitest run server/kvStore.test.ts`
Expected: PASS (1 passed).

- [ ] **Step 6: Commit**

```bash
git add server/kvStore.ts server/kvStore.test.ts package.json
git commit -m "Add kvSetEx (KV set with TTL) + vitest test script"
```

---

### Task 2: `emailHelpers.ts` — Code-Erzeugung/-Prüfung, E-Mail-Validierung, Resend-Versand

**Files:**
- Create: `server/emailHelpers.ts`
- Test: `server/emailHelpers.test.ts`

**Interfaces:**
- Consumes: `kvSetEx`, `kvGet`, `kvDel` from `./kvStore`
- Produces:
  - `isValidEmail(email: string): boolean`
  - `isDisposableDomain(email: string): boolean`
  - `generateCode(): string`  (6 Ziffern, mit führenden Nullen)
  - `storeCode(email: string, code: string): Promise<void>`
  - `verifyOrderCode(email: string, code: string): Promise<{ ok: boolean; error?: string }>`
  - `sendCodeEmail(email: string, code: string): Promise<{ ok: boolean }>`

- [ ] **Step 1: Failing tests schreiben**

Create `server/emailHelpers.test.ts`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import {
  isValidEmail,
  isDisposableDomain,
  generateCode,
  storeCode,
  verifyOrderCode,
} from "./emailHelpers";

beforeEach(() => {
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
});

describe("isValidEmail", () => {
  it("accepts a normal address", () => {
    expect(isValidEmail("kunde@example.com")).toBe(true);
  });
  it("rejects malformed input", () => {
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("a@b")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });
});

describe("isDisposableDomain", () => {
  it("flags a known throwaway domain", () => {
    expect(isDisposableDomain("x@mailinator.com")).toBe(true);
  });
  it("passes a normal domain", () => {
    expect(isDisposableDomain("x@gmail.com")).toBe(false);
  });
});

describe("generateCode", () => {
  it("returns a 6-digit numeric string", () => {
    for (let i = 0; i < 50; i++) {
      const c = generateCode();
      expect(c).toMatch(/^\d{6}$/);
    }
  });
});

describe("storeCode + verifyOrderCode", () => {
  it("accepts the correct code once and rejects reuse", async () => {
    await storeCode("kunde@example.com", "123456");
    expect(await verifyOrderCode("kunde@example.com", "123456")).toEqual({ ok: true });
    // consumed → second attempt fails
    const again = await verifyOrderCode("kunde@example.com", "123456");
    expect(again.ok).toBe(false);
  });

  it("rejects a wrong code", async () => {
    await storeCode("k2@example.com", "111111");
    const r = await verifyOrderCode("k2@example.com", "999999");
    expect(r.ok).toBe(false);
    expect(r.error).toBeTruthy();
  });

  it("invalidates after 5 wrong attempts", async () => {
    await storeCode("k3@example.com", "222222");
    for (let i = 0; i < 5; i++) await verifyOrderCode("k3@example.com", "000000");
    // even the correct code is now rejected (code was invalidated)
    const r = await verifyOrderCode("k3@example.com", "222222");
    expect(r.ok).toBe(false);
  });
});
```

- [ ] **Step 2: Tests ausführen — müssen fehlschlagen**

Run: `npx vitest run server/emailHelpers.test.ts`
Expected: FAIL — cannot find module `./emailHelpers`.

- [ ] **Step 3: `emailHelpers.ts` implementieren**

Create `server/emailHelpers.ts`:

```ts
import crypto from "node:crypto";
import { kvSetEx, kvGet, kvDel } from "./kvStore";

const CODE_TTL_SEC = 600;   // 10 Minuten
const MAX_ATTEMPTS = 5;

// Bekannte Wegwerf-/Trash-Mail-Domains (kostenlose Sperrliste, erweiterbar).
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "10minutemail.com", "guerrillamail.com", "guerrillamail.info",
  "sharklasers.com", "trashmail.com", "yopmail.com", "temp-mail.org", "tempmail.com",
  "getnada.com", "dispostable.com", "maildrop.cc", "fakeinbox.com", "mohmal.com",
  "throwawaymail.com", "mytemp.email", "tmpmail.org", "emailondeck.com", "mailnesia.com",
]);

interface StoredCode {
  code:      string;
  attempts:  number;
  expiresAt: number;
}

function otpKey(email: string): string {
  const norm = email.trim().toLowerCase();
  return `otp:${crypto.createHash("sha256").update(norm).digest("hex")}`;
}

export function isValidEmail(email: string): boolean {
  if (typeof email !== "string") return false;
  const e = email.trim();
  // Simple, strict-enough RFC-ish check: local@domain.tld
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
}

export function isDisposableDomain(email: string): boolean {
  const domain = email.trim().toLowerCase().split("@")[1] ?? "";
  return DISPOSABLE_DOMAINS.has(domain);
}

export function generateCode(): string {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
}

export async function storeCode(email: string, code: string): Promise<void> {
  const payload: StoredCode = { code, attempts: 0, expiresAt: Date.now() + CODE_TTL_SEC * 1000 };
  await kvSetEx(otpKey(email), JSON.stringify(payload), CODE_TTL_SEC);
}

export async function verifyOrderCode(
  email: string,
  code: string,
): Promise<{ ok: boolean; error?: string }> {
  const key = otpKey(email);
  const raw = await kvGet(key);
  if (!raw) {
    return { ok: false, error: "Code abgelaufen oder ungültig. Bitte einen neuen Code anfordern." };
  }

  let data: StoredCode;
  try {
    data = JSON.parse(raw) as StoredCode;
  } catch {
    await kvDel(key);
    return { ok: false, error: "Code ungültig. Bitte einen neuen Code anfordern." };
  }

  if (Date.now() > data.expiresAt) {
    await kvDel(key);
    return { ok: false, error: "Code abgelaufen. Bitte einen neuen Code anfordern." };
  }
  if (data.attempts >= MAX_ATTEMPTS) {
    await kvDel(key);
    return { ok: false, error: "Zu viele Fehlversuche. Bitte einen neuen Code anfordern." };
  }

  if (String(code).trim() !== data.code) {
    data.attempts += 1;
    const remainingSec = Math.max(1, Math.ceil((data.expiresAt - Date.now()) / 1000));
    await kvSetEx(key, JSON.stringify(data), remainingSec);
    return { ok: false, error: "Code falsch. Bitte erneut versuchen." };
  }

  await kvDel(key); // single-use
  return { ok: true };
}

export async function sendCodeEmail(email: string, code: string): Promise<{ ok: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;

  // Kein Key (lokal / noch nicht eingerichtet): Code in die Konsole loggen.
  if (!apiKey) {
    console.log(`[Email] (DEV — kein RESEND_API_KEY) Bestätigungscode für ${email}: ${code}`);
    return { ok: true };
  }

  const from = process.env.ORDER_FROM_EMAIL || "onboarding@resend.dev";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method:  "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [email],
        subject: "Dein Bestätigungscode – Burger Station Leer",
        html:
          `<div style="font-family:sans-serif;font-size:16px;color:#1d1d03">` +
          `<p>Dein Bestätigungscode für deine Bestellung bei der Burger Station Leer:</p>` +
          `<p style="font-size:32px;font-weight:bold;letter-spacing:4px">${code}</p>` +
          `<p>Der Code ist 10 Minuten gültig. Wenn du keine Bestellung aufgegeben hast, ignoriere diese E-Mail.</p>` +
          `</div>`,
      }),
    });
    if (!res.ok) {
      console.error("[Email] Resend-Fehler:", res.status, await res.text());
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error("[Email] Resend nicht erreichbar:", err);
    return { ok: false };
  }
}
```

- [ ] **Step 4: Tests ausführen — müssen bestehen**

Run: `npx vitest run server/emailHelpers.test.ts`
Expected: PASS (alle Tests grün).

- [ ] **Step 5: Commit**

```bash
git add server/emailHelpers.ts server/emailHelpers.test.ts
git commit -m "Add email code helpers: gen/verify via KV, validation, Resend sender"
```

---

### Task 3: `createPosOrder()` extrahieren + `OPEN` in `/api/create-pos-order` ablehnen

**Files:**
- Modify: `server/posHelpers.ts` (Handler ab Zeile 177)

**Interfaces:**
- Consumes: bestehende `sanitizePosItems`, `isStoreOpen`, `recordOrder`, `getToken`, `GOODTILL_PRODUCTS`
- Produces:
  - `interface PosResult { ok: boolean; mode?: "local-only"; posOrderId?: string; ref?: string; error?: string; detail?: string; httpStatus?: number }`
  - `createPosOrder(body: CreatePosOrderBody): Promise<PosResult>`

- [ ] **Step 1: `createPosOrder` einführen (Kernlogik aus dem Handler verschieben)**

In `server/posHelpers.ts` den bestehenden `handleCreatePosOrder` (Zeilen 177–315) durch folgende **zwei** Funktionen ersetzen. Die Kernlogik (Items validieren, Store-Check, Good-Till-Push, `recordOrder`) wandert nach `createPosOrder`; der Handler behält nur die HTTP-Guards und lehnt neu `OPEN` ab.

```ts
export interface PosResult {
  ok:         boolean;
  mode?:      "local-only";
  posOrderId?: string;
  ref?:       string;
  error?:     string;
  detail?:    string;
  /** Set only for hard rejects the caller should surface as an HTTP status (400/403). */
  httpStatus?: number;
}

/**
 * Creates a POS order (validate → store-open check → Good Till push). Reused by
 * the public /api/create-pos-order route (PAID/online) and by the verified
 * /api/order/confirm route (OPEN cash/card after email code). No HTTP concerns.
 */
export async function createPosOrder(body: CreatePosOrderBody): Promise<PosResult> {
  const { paymentStatus, paymentType, customer, orderRef } = body;

  const { items, error: itemError } = sanitizePosItems(body.items);
  if (itemError || !items) {
    return { ok: false, error: itemError ?? "Ungültige Bestellung.", httpStatus: 400 };
  }

  if (paymentStatus === "OPEN" && !(await isStoreOpen())) {
    return { ok: false, error: "Der Store ist aktuell geschlossen — keine Bestellung möglich.", httpStatus: 403 };
  }

  const subdomain = process.env.GOODTILL_SUBDOMAIN;
  const outletId  = process.env.GOODTILL_OUTLET_ID;

  const missingVars = [
    !subdomain && "GOODTILL_SUBDOMAIN",
    !outletId  && "GOODTILL_OUTLET_ID",
    !process.env.GOODTILL_USERNAME && "GOODTILL_USERNAME",
    !process.env.GOODTILL_PASSWORD && "GOODTILL_PASSWORD",
  ].filter(Boolean);

  if (missingVars.length > 0) {
    console.warn(
      `[POS] Good Till nicht konfiguriert (fehlend: ${missingVars.join(", ")}). ` +
      `Bestellung wird nur lokal protokolliert.`,
    );
    console.log("[POS] 📋 Bestellung (lokal):", {
      ref: orderRef, status: paymentStatus, payment: paymentType,
      items: items.map((i) => `${i.quantity}× ${i.name} @ ${i.price} €`), customer,
    });
    recordOrder({
      id:        orderRef ?? `BS-LOCAL-${Date.now()}`,
      timestamp: new Date().toISOString(),
      total:     items.reduce((s, i) => s + i.price * i.quantity, 0),
      status:    paymentStatus,
      items:     items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
      customer:  customer ? `${customer.vorname} ${customer.nachname}` : undefined,
      phone:     customer?.telefon,
    });
    return { ok: true, mode: "local-only", ref: orderRef };
  }

  const baseUrl = `https://${subdomain}.goodtill.com/api`;

  try {
    const token = await getToken(baseUrl);

    const lineItems = items.map((item) => {
      const catalogEntry = item.variant_id ? GOODTILL_PRODUCTS[item.variant_id] : null;
      return {
        product_id: catalogEntry?.product_id ?? null,
        name:       item.name,
        quantity:   item.quantity,
        price:      item.price,
        tax_rate:   item.tax_rate,
      };
    });

    const totalAmount = items.reduce((s, i) => s + i.price * i.quantity, 0);

    const salePayload = {
      sale_items: lineItems,
      payments: [
        {
          payment_type:   paymentType ?? (paymentStatus === "PAID" ? "ECOM" : "CASH"),
          payment_amount: totalAmount,
          payment_status: paymentStatus,
        },
      ],
      customer_name:  customer ? `${customer.vorname} ${customer.nachname}` : undefined,
      customer_phone: customer?.telefon,
      notes:          customer ? `Lieferung: ${customer.strasse}, ${customer.ort}` : undefined,
      external_reference: orderRef,
    };

    const posRes = await fetch(`${baseUrl}/externalsale`, {
      method:  "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, "Outlet-Id": outletId! },
      body: JSON.stringify(salePayload),
    });

    if (!posRes.ok) {
      const detail = await posRes.text();
      console.error("[POS] ExternalSale failed:", posRes.status, detail);
      return { ok: false, error: `POS Fehler ${posRes.status}`, detail };
    }

    const posData = (await posRes.json()) as { id?: string };
    console.log(`[POS] ✅ Bestellung erstellt | ref: ${orderRef} | status: ${paymentStatus} | POS-ID: ${posData.id}`);
    recordOrder({
      id:        orderRef ?? `BS-POS-${posData.id ?? Date.now()}`,
      timestamp: new Date().toISOString(),
      total:     totalAmount,
      status:    paymentStatus,
      items:     items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
      customer:  customer ? `${customer.vorname} ${customer.nachname}` : undefined,
      phone:     customer?.telefon,
    });
    return { ok: true, posOrderId: posData.id, ref: orderRef };
  } catch (err) {
    console.error("[POS] Unexpected error:", err);
    return { ok: false, error: String(err) };
  }
}

/**
 * POST /api/create-pos-order — PAID/online orders only.
 * OPEN (unpaid bar/karte) orders MUST go through /api/order/confirm (email code),
 * so they are rejected here to prevent bypassing verification.
 */
export async function handleCreatePosOrder(req: Request, res: Response) {
  if (!(await rateLimitByIp(req, res, "pos", 10, 60_000))) return;
  if (!checkSameOrigin(req, res)) return;

  const body = req.body as CreatePosOrderBody;

  if (body.paymentStatus === "OPEN") {
    res.status(403).json({
      error: "Unbezahlte Bestellungen müssen per E-Mail-Code bestätigt werden.",
    });
    return;
  }

  const result = await createPosOrder(body);
  if (result.httpStatus) {
    res.status(result.httpStatus).json({ error: result.error, detail: result.detail });
    return;
  }
  const { httpStatus, ...clean } = result;
  res.json(clean);
}
```

- [ ] **Step 2: Type-Check**

Run: `npx tsc --noEmit -p tsconfig.json 2>&1 | grep posHelpers || echo "posHelpers clean"`
Expected: `posHelpers clean`.

- [ ] **Step 3: Smoke-Test — OPEN wird jetzt abgelehnt**

```bash
ADMIN_SECRET=x npx tsx server/dev.ts > /tmp/bs_t3.log 2>&1 &
sleep 2.5
curl -s -o /dev/null -w "OPEN -> %{http_code}\n" -X POST -H "Content-Type: application/json" -H "Origin: http://localhost:8787" \
  -d '{"items":[{"name":"x","quantity":1,"price":5,"tax_rate":7}],"paymentStatus":"OPEN","paymentType":"CASH","orderRef":"t3"}' \
  http://localhost:8787/api/create-pos-order
pkill -f "tsx server/dev.ts"; rm -f /tmp/bs_t3.log orders.txt
```

Expected: `OPEN -> 403`.

- [ ] **Step 4: Commit**

```bash
git add server/posHelpers.ts
git commit -m "Extract createPosOrder(); reject OPEN orders on /api/create-pos-order"
```

---

### Task 4: `orderVerification.ts` — Endpunkte + Registrierung

**Files:**
- Create: `server/orderVerification.ts`
- Modify: `server/dev.ts`, `server/index.ts`, `api/_source.ts` (Import + Routen)

**Interfaces:**
- Consumes: `isValidEmail`, `isDisposableDomain`, `generateCode`, `storeCode`, `verifyOrderCode`, `sendCodeEmail` (Task 2); `createPosOrder`, `CreatePosOrderBody`, `PosOrderItem` (Task 3); `rateLimitByIp`, `checkSameOrigin` (`./security`); `kvIncrFixedWindow` (`./kvStore`)
- Produces:
  - `handleRequestCode(req: Request, res: Response): Promise<void>`
  - `handleConfirmOrder(req: Request, res: Response): Promise<void>`

- [ ] **Step 1: `orderVerification.ts` implementieren**

Create `server/orderVerification.ts`:

```ts
import crypto from "node:crypto";
import type { Request, Response } from "express";
import { rateLimitByIp, checkSameOrigin } from "./security";
import { kvIncrFixedWindow } from "./kvStore";
import {
  isValidEmail,
  isDisposableDomain,
  generateCode,
  storeCode,
  verifyOrderCode,
  sendCodeEmail,
} from "./emailHelpers";
import { createPosOrder, type CreatePosOrderBody, type PosOrderItem } from "./posHelpers";

const PHONE_FALLBACK = "+49 491 997 55279";

/** POST /api/order/request-code  { email } → sends a 6-digit code. */
export async function handleRequestCode(req: Request, res: Response) {
  if (!(await rateLimitByIp(req, res, "otp-req", 3, 600_000))) return; // 3 / 10 min / IP
  if (!checkSameOrigin(req, res)) return;

  const email = String((req.body as { email?: string }).email ?? "").trim();

  if (!isValidEmail(email)) {
    res.status(400).json({ error: "Bitte gib eine gültige E-Mail-Adresse an." });
    return;
  }
  if (isDisposableDomain(email)) {
    res.status(400).json({ error: "Wegwerf-E-Mail-Adressen sind nicht erlaubt. Bitte nutze deine echte Adresse." });
    return;
  }

  // Per-email cooldown (60 s) — reuse the KV fixed-window counter. null = no KV (dev) → skip.
  const cdKey = `otp-cd:${crypto.createHash("sha256").update(email.toLowerCase()).digest("hex")}`;
  const cd = await kvIncrFixedWindow(cdKey, 60);
  if (cd !== null && cd > 1) {
    res.status(429).json({ error: "Bitte warte kurz, bevor du einen neuen Code anforderst." });
    return;
  }

  const code = generateCode();
  await storeCode(email, code);

  const sent = await sendCodeEmail(email, code);
  if (!sent.ok) {
    // Fail-closed: never let an order through if we couldn't deliver the code.
    res.status(502).json({
      error: `Verifizierung gerade nicht möglich. Bitte später erneut versuchen oder telefonisch bestellen: ${PHONE_FALLBACK}.`,
    });
    return;
  }

  res.json({ ok: true });
}

interface ConfirmBody {
  email:    string;
  code:     string;
  items:    PosOrderItem[];
  payment:  "bar" | "karte";
  customer?: CreatePosOrderBody["customer"];
}

/** POST /api/order/confirm  { email, code, items, payment, customer } → verifies code, pushes POS order. */
export async function handleConfirmOrder(req: Request, res: Response) {
  if (!(await rateLimitByIp(req, res, "order-confirm", 10, 60_000))) return;
  if (!checkSameOrigin(req, res)) return;

  const { email, code, items, payment, customer } = req.body as ConfirmBody;

  if (!isValidEmail(String(email ?? ""))) {
    res.status(400).json({ error: "Ungültige E-Mail-Adresse." });
    return;
  }
  if (payment !== "bar" && payment !== "karte") {
    res.status(400).json({ error: "Ungültige Zahlungsart." });
    return;
  }

  const verify = await verifyOrderCode(email, String(code ?? ""));
  if (!verify.ok) {
    res.status(400).json({ error: verify.error });
    return;
  }

  const orderRef = `BS-${Math.floor(Math.random() * 9000) + 1000}`;
  const result = await createPosOrder({
    items,
    paymentStatus: "OPEN",
    paymentType:   payment === "karte" ? "CARD" : "CASH",
    customer,
    orderRef,
  });

  if (result.httpStatus) {
    res.status(result.httpStatus).json({ error: result.error });
    return;
  }
  res.json({ ok: result.ok, orderRef });
}
```

- [ ] **Step 2: Routen registrieren (3 Dateien)**

In `server/dev.ts`: nach `import { handleCreatePosOrder } from "./posHelpers";` ergänzen:

```ts
import { handleRequestCode, handleConfirmOrder } from "./orderVerification";
```

und nach der Zeile `app.post("/api/create-pos-order", handleCreatePosOrder);` ergänzen:

```ts
  app.post("/api/order/request-code", handleRequestCode);
  app.post("/api/order/confirm",      handleConfirmOrder);
```

In `server/index.ts`: denselben Import ergänzen (bei den übrigen `./`-Imports) und dieselben zwei `app.post(...)`-Zeilen direkt nach der `create-pos-order`-Route (Zeile 21) einfügen.

In `api/_source.ts`: denselben Import ergänzen und dieselben zwei `app.post(...)`-Zeilen direkt nach der `create-pos-order`-Route (Zeile 25) einfügen.

- [ ] **Step 3: Type-Check**

Run: `npx tsc --noEmit -p tsconfig.json 2>&1 | grep -E "orderVerification|dev\.ts|index\.ts|_source" || echo "routes clean"`
Expected: `routes clean`.

- [ ] **Step 4: Smoke-Test — voller Flow (Code aus Konsole)**

```bash
ADMIN_SECRET=x npx tsx server/dev.ts > /tmp/bs_t4.log 2>&1 &
sleep 2.5
B=http://localhost:8787
echo "request-code:"; curl -s -X POST -H "Content-Type: application/json" -H "Origin: $B" -d '{"email":"kunde@example.com"}' $B/api/order/request-code; echo
CODE=$(grep -oE "Bestätigungscode für kunde@example.com: [0-9]{6}" /tmp/bs_t4.log | grep -oE "[0-9]{6}" | tail -1)
echo "geloggter Code: $CODE"
echo "confirm falsch:"; curl -s -o /dev/null -w "%{http_code}\n" -X POST -H "Content-Type: application/json" -H "Origin: $B" -d '{"email":"kunde@example.com","code":"000000","items":[{"name":"Double Smash","quantity":1,"price":9.4,"tax_rate":7}],"payment":"bar"}' $B/api/order/confirm
echo "confirm richtig:"; curl -s -X POST -H "Content-Type: application/json" -H "Origin: $B" -d '{"email":"kunde@example.com","code":"'$CODE'","items":[{"name":"Double Smash","quantity":1,"price":9.4,"tax_rate":7}],"payment":"bar","customer":{"vorname":"A","nachname":"B","telefon":"1","strasse":"S 1","ort":"26789 Leer"}}' $B/api/order/confirm; echo
pkill -f "tsx server/dev.ts"; rm -f /tmp/bs_t4.log orders.txt
```

Expected: request-code `{"ok":true}`; confirm-falsch → `400`; confirm-richtig → `{"ok":true,"orderRef":"BS-…"}`.

- [ ] **Step 5: Commit**

```bash
git add server/orderVerification.ts server/dev.ts server/index.ts api/_source.ts
git commit -m "Add email-verified order endpoints (request-code, confirm)"
```

---

### Task 5: Frontend — Inline-Code-Feld für Bar/Karte in `Checkout.tsx`

**Files:**
- Modify: `client/src/pages/Checkout.tsx`

**Interfaces:**
- Consumes: `POST /api/order/request-code`, `POST /api/order/confirm` (Task 4)

- [ ] **Step 1: State + Reset ergänzen**

In `Checkout.tsx` bei den übrigen `useState`-Hooks (nach `const [submitting, setSubmitting] = useState(false);`, ca. Zeile 51) einfügen:

```tsx
  const [codeSent, setCodeSent]   = useState(false);
  const [code, setCode]           = useState("");
  const [verifying, setVerifying] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);
```

Im `set`-Helper (der bei Formularänderung `setCheckoutId(null)` aufruft, ca. Zeile 107) direkt nach `setCheckoutId(null);` ergänzen, damit ein bereits gesendeter Code bei Datenänderung verfällt:

```tsx
        if (codeSent) { setCodeSent(false); setCode(""); setCodeError(null); }
```

- [ ] **Step 2: Bar/Karte-Zweig auf Code-Anforderung umstellen**

In `handleSubmit` den bestehenden Block (aktuell ca. Zeilen 192–200):

```tsx
    // ── Bar / Karte ───────────────────────────────────────────────────────
    if (payment !== "online") {
      const orderNum = `BS-${Math.floor(Math.random() * 9000) + 1000}`;
      sessionStorage.setItem("bs_order_num", orderNum);
      // Push to POS as OPEN (unpaid) → appears on iPad immediately
      void sendPosOrder("OPEN", payment === "bar" ? "CASH" : "CARD", orderNum);
      window.location.href = "/bestellen/danke";
      return;
    }
```

ersetzen durch:

```tsx
    // ── Bar / Karte: E-Mail-Code anfordern (fail-closed) ──────────────────
    if (payment !== "online") {
      setSubmitting(true);
      try {
        const res = await fetch("/api/order/request-code", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ email: form.email }),
        });
        const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
        if (!res.ok || !data.ok) {
          setFormError(data.error ?? "Verifizierung gerade nicht möglich. Bitte telefonisch bestellen: +49 491 997 55279.");
          return;
        }
        setCodeSent(true);
        setCodeError(null);
        setTimeout(
          () => document.getElementById("code-section")?.scrollIntoView({ behavior: "smooth" }),
          120,
        );
      } catch {
        setFormError("Verifizierung gerade nicht möglich. Bitte telefonisch bestellen: +49 491 997 55279.");
      } finally {
        setSubmitting(false);
      }
      return;
    }
```

- [ ] **Step 3: Confirm-Funktion ergänzen**

Direkt nach `handleSubmit` (vor `submitLabel`, ca. Zeile 272) einfügen:

```tsx
  const handleConfirmCode = async () => {
    setVerifying(true);
    setCodeError(null);
    try {
      const posItems = items.map((i) => ({
        variant_id: i.variant_id,
        name:       i.name,
        quantity:   i.quantity,
        price:      i.price,
        tax_rate:   7,
      }));
      const res = await fetch("/api/order/confirm", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email:   form.email,
          code,
          items:   posItems,
          payment: payment === "karte" ? "karte" : "bar",
          customer: {
            vorname:  form.vorname,
            nachname: form.nachname,
            telefon:  form.telefon,
            strasse:  `${form.strasse} ${form.hausnummer}`,
            ort:      `${form.plz} ${form.ort}`,
          },
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; orderRef?: string; error?: string };
      if (!res.ok || !data.ok) {
        setCodeError(data.error ?? "Code ungültig. Bitte erneut versuchen.");
        return;
      }
      sessionStorage.setItem("bs_order_num", data.orderRef ?? `BS-${Math.floor(Math.random() * 9000) + 1000}`);
      window.location.href = "/bestellen/danke";
    } catch {
      setCodeError("Bestätigung fehlgeschlagen. Bitte erneut versuchen.");
    } finally {
      setVerifying(false);
    }
  };
```

- [ ] **Step 4: Submit-Button-Label anpassen**

In `submitLabel()` (ca. Zeile 275) die Bar/Karte-Rückgabe anpassen. Ersetze den Schluss der Funktion:

```tsx
    if (payment === "online") {
      if (checkoutId) return "Zur Zahlung scrollen ↓";
      return "Kreditkarte freischalten →";
    }
    return "Bestellung abschicken →";
```

durch:

```tsx
    if (payment === "online") {
      if (checkoutId) return "Zur Zahlung scrollen ↓";
      return "Kreditkarte freischalten →";
    }
    if (codeSent) return "Code erneut senden";
    return "Bestätigungscode anfordern →";
```

- [ ] **Step 5: Code-Eingabe-Panel rendern**

Im JSX direkt nach dem Submit-Button-Block (nach dem `<button type="submit" …>{submitLabel()}</button>` und dessen umgebendem `</p>`, ca. Zeile 601, innerhalb des `space-y-4`-Containers) einfügen:

```tsx
                {payment !== "online" && codeSent && (
                  <div id="code-section" className="retro-card p-5 space-y-3 border-[3px] border-bs-teal">
                    <p className="font-body font-bold text-sm text-bs-ink">
                      Wir haben dir einen 6-stelligen Code an <strong>{form.email}</strong> geschickt.
                    </p>
                    <p className="text-xs text-bs-ink-v">
                      Gib den Code ein, um deine Bestellung verbindlich abzuschicken. (Prüfe ggf. den Spam-Ordner.)
                    </p>
                    <input
                      className={INPUT + " text-center text-2xl tracking-[0.5em] font-bold"}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      placeholder="______"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    />
                    {codeError && (
                      <p className="text-sm text-red-700 font-body">{codeError}</p>
                    )}
                    <button
                      type="button"
                      onClick={handleConfirmCode}
                      disabled={code.length !== 6 || verifying}
                      className="btn-pink w-full text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {verifying ? "Wird bestätigt…" : "Bestellung bestätigen →"}
                    </button>
                  </div>
                )}
```

- [ ] **Step 6: `sendPosOrder` entfernen, falls ungenutzt**

Prüfen, ob `sendPosOrder` nach Step 2 noch referenziert wird:

Run: `grep -n "sendPosOrder" client/src/pages/Checkout.tsx`
Expected: nur noch die Definition (ca. Zeile 113). Wenn ja, die gesamte `async function sendPosOrder(...) { … }`-Definition (ca. Zeilen 113–148) löschen, um toten Code zu vermeiden.

- [ ] **Step 7: Build + Type-Check**

Run: `npm run build 2>&1 | tail -4 && npx tsc --noEmit -p tsconfig.json 2>&1 | grep Checkout || echo "Checkout clean"`
Expected: Build erfolgreich; `Checkout clean`.

- [ ] **Step 8: Commit**

```bash
git add client/src/pages/Checkout.tsx
git commit -m "Checkout: require email code for cash/card orders before POS push"
```

---

### Task 6: Env-Doku + Memory-Notiz

**Files:**
- Modify: `.env.example`
- Modify: `/Users/londinium06/.claude/projects/-Users-londinium06-Downloads-burger-station-rebrand/memory/MEMORY.md` und neue Memory-Datei

- [ ] **Step 1: `.env.example` ergänzen**

Am Ende von `.env.example` anhängen:

```bash

# ── E-Mail-Verifizierung für Bar/Karte-Bestellungen (Resend) ──
# Ohne RESEND_API_KEY wird der Code lokal in die Server-Konsole geloggt.
RESEND_API_KEY=
# Absender. Default onboarding@resend.dev (Test). Nach Domain-Verifizierung umstellen:
# ORDER_FROM_EMAIL=Burger Station <noreply@deine-domain.de>
ORDER_FROM_EMAIL=onboarding@resend.dev
```

- [ ] **Step 2: Memory-Notiz schreiben**

Neue Datei `…/memory/email-order-verification.md` (type: project) mit Kurzfassung: Endpunkte `/api/order/request-code` + `/api/order/confirm`, Code in KV (`otp:*`, TTL 600s, max 5 Versuche), `/api/create-pos-order` lehnt OPEN ab, fail-closed, Resend + Konsolen-Fallback, Env `RESEND_API_KEY`/`ORDER_FROM_EMAIL`, Rollout-Stufen bis eigene Domain. Verlinke `[[security-hardening]]`, `[[sumup-apm-redirect-url]]`. Danach eine Indexzeile in `MEMORY.md` ergänzen.

- [ ] **Step 3: Commit**

```bash
git add .env.example
git commit -m "Document RESEND_API_KEY / ORDER_FROM_EMAIL for order verification"
```

---

## Self-Review Notes

- **Spec-Abdeckung:** request-code/confirm (T4), Code in KV + TTL + Versuche (T2), Wegwerf-Domain-Sperre (T2), OPEN-Ablehnung (T3), fail-closed + Telefon-Fallback (T4/T5), Bar+Karte (T4/T5), Resend + Konsolen-Fallback + Env-Rollout (T2/T6), Frontend-UI (T5). Alle Spec-Abschnitte abgedeckt.
- **Nicht im Scope (laut Spec):** Absicherung von `PAID`/`ECOM` gegen gefälschte „bezahlt"-Injektion; SMS-Verifizierung.
- **Typkonsistenz:** `createPosOrder` / `PosResult` (T3) werden in T4 mit exakt diesen Namen konsumiert; `PosOrderItem` / `CreatePosOrderBody` sind bereits in `posHelpers.ts` exportiert.
