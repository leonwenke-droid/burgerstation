import fs from "node:fs";
import path from "node:path";
import type { Request, Response } from "express";
import { rateLimitByIp, checkSameOrigin } from "./security";

// ─── Master-Katalog ────────────────────────────────────────────────────────────
// Einzige verlässliche Quelle für Preise und Steuersätze.
// Basiert auf dem offiziellen SumUp CSV-Export.
// Neue Artikel einfach als weiteres Objekt hinzufügen.
// Steuersätze (Lieferung, Deutschland):
//   food  → 7%  (§ 12 Abs. 2 Nr. 1 UStG — Speisen)
//   drink → 19% (§ 12 Abs. 1 UStG    — Getränke)
export const SUMUP_CATALOG = [
  {
    sumup_catalog_id: "c0b10e52-2f19-4614-9633-76e4da4228c3",
    variant_id:       "7569a6cd-268f-4d16-b86f-09676f4dcfaa",
    sku:              "DBL-SMSH-001",
    name:             "Double Smash",
    category:         "food" as const,
    price:            9.40,
    tax_rate:         7.00,
  },
  {
    sumup_catalog_id: "0e9f1a01-c675-40d8-b12a-6bbcdeccd21a",
    variant_id:       "42194cc3-fe98-4a6d-b5fa-04d333730d96",
    sku:              "LNG-CHI-002",
    name:             "Long Chili Cheese",
    category:         "food" as const,
    price:            11.90,
    tax_rate:         7.00,
  },
  // Vorlage für Speisen  (7%):  { sumup_catalog_id: "...", variant_id: "...", sku: "...", name: "...", category: "food"  as const, price: 0.00, tax_rate: 7.00  },
  // Vorlage für Getränke (19%): { sumup_catalog_id: "...", variant_id: "...", sku: "...", name: "...", category: "drink" as const, price: 0.00, tax_rate: 19.00 },
] as const;

// ─── Interfaces ───────────────────────────────────────────────────────────────

/** Item sent from the frontend: either a catalog variant (variant_id + quantity)
 *  or a non-catalog fallback (name + price + quantity + category). */
export interface OrderedItem {
  variant_id?: string;
  name?:       string;
  sku?:        string;
  quantity:    number;
  price?:      number;
  /** "food" → 7% MwSt. | "drink" → 19% MwSt. (Lieferung, Deutschland) */
  category?:   "food" | "drink";
  /** Explicit override — only used when no variant_id; derived from category otherwise. */
  tax_rate?:   number;
}

/** Resolved item after catalog lookup — all fields guaranteed. */
interface ResolvedItem {
  variant_id?: string;
  sku?:        string;
  name:        string;
  quantity:    number;
  price:       number;
  category:    "food" | "drink";
  tax_rate:    number;
}

interface CreateCheckoutBody {
  orderedItems?: OrderedItem[];
  /** Legacy key — still accepted so nothing breaks. */
  items?:        OrderedItem[];
  currency?:     string;
}

// ─── In-memory order store ────────────────────────────────────────────────────
// Maps checkout_reference → resolved items for webhook lookup.
// In production: replace with Redis or a DB row keyed on checkout_reference.
const pendingOrders = new Map<string, ResolvedItem[]>();

// ─── Helpers ──────────────────────────────────────────────────────────────────

type CatalogEntry = (typeof SUMUP_CATALOG)[number];

function lookupVariant(variant_id: string): CatalogEntry | undefined {
  return SUMUP_CATALOG.find((e) => e.variant_id === variant_id);
}

function resolveItems(ordered: OrderedItem[]): { items: ResolvedItem[]; error?: string } {
  const resolved: ResolvedItem[] = [];

  for (const o of ordered) {
    if (o.quantity <= 0 || !Number.isFinite(o.quantity)) {
      return { items: [], error: `Invalid quantity for "${o.variant_id ?? o.name}"` };
    }

    if (o.variant_id) {
      // Catalog path — price and tax always come from server catalog
      const entry = lookupVariant(o.variant_id);
      if (!entry) {
        return {
          items: [],
          error: `Unbekannte variant_id: "${o.variant_id}". Artikel ist nicht im Katalog.`,
        };
      }
      resolved.push({
        variant_id: entry.variant_id,
        sku:        entry.sku,
        name:       entry.name,
        quantity:   o.quantity,
        price:      entry.price,
        category:   entry.category,
        tax_rate:   entry.tax_rate,
      });
    } else {
      // Fallback path for items not yet in catalog
      if (!o.name || typeof o.price !== "number" || o.price <= 0) {
        return { items: [], error: "Fallback-Item muss name und price > 0 haben." };
      }
      const category: "food" | "drink" = o.category ?? "food";
      // Derive tax_rate from category (legal default for delivery in Germany).
      // An explicit o.tax_rate override still takes precedence.
      const tax_rate = o.tax_rate ?? (category === "drink" ? 19 : 7);
      resolved.push({
        sku:      o.sku,
        name:     o.name,
        quantity: o.quantity,
        price:    o.price,
        category,
        tax_rate,
      });
    }
  }

  return { items: resolved };
}

function buildDescription(items: ResolvedItem[]): string {
  return items
    .map((i) => `${i.name} × ${i.quantity}`)
    .join(", ")
    .slice(0, 999);
}

/**
 * Absolute base URL of the live site (e.g. "https://burgerstation.de").
 *
 * SumUp requires an absolute `redirect_url` on checkout creation to offer
 * Alternative Payment Methods (PayPal, Apple Pay, Google Pay); redirect-based
 * methods send the payer to this URL after they finish paying.
 *
 * Priority: explicit PUBLIC_BASE_URL env → Origin header → forwarded host →
 * Host header. Derived from the request so it works both locally and on Vercel
 * without hard-coding the domain.
 */
function resolveBaseUrl(req: Request): string {
  const envUrl = process.env.PUBLIC_BASE_URL;
  if (envUrl) return envUrl.replace(/\/+$/, "");

  const origin = req.headers.origin;
  if (typeof origin === "string" && origin) return origin.replace(/\/+$/, "");

  const forwardedProto =
    (req.headers["x-forwarded-proto"] as string | undefined)?.split(",")[0] ?? "https";
  const host =
    (req.headers["x-forwarded-host"] as string | undefined) ??
    (req.headers.host as string | undefined);

  return host ? `${forwardedProto}://${host}` : "";
}

const ORDERS_LOG = path.resolve(process.cwd(), "orders.txt");

function appendOrderLog(entry: object) {
  const line = `[${new Date().toISOString()}] ${JSON.stringify(entry)}\n`;
  try {
    fs.appendFileSync(ORDERS_LOG, line, "utf-8");
  } catch (err) {
    console.error("[OrderLog] Schreiben fehlgeschlagen:", err);
  }
}

// ─── Route handlers ───────────────────────────────────────────────────────────

/**
 * POST /api/create-sandbox-checkout
 *
 * Accepts `orderedItems: [{ variant_id, quantity }]` from the frontend.
 * Catalog items are resolved server-side (price cannot be manipulated).
 * Non-catalog items fall back to the provided name/price.
 */
export async function handleCreateCheckout(req: Request, res: Response) {
  // Anti-abuse: each call creates a real SumUp checkout (API cost). Throttle per
  // IP and reject off-origin requests before touching SumUp.
  if (!rateLimitByIp(req, res, "checkout", 15, 60_000)) return;
  if (!checkSameOrigin(req, res)) return;

  const { orderedItems, items: legacyItems, currency = "EUR" } = req.body as CreateCheckoutBody;

  const raw = orderedItems ?? legacyItems;

  if (!Array.isArray(raw) || raw.length === 0) {
    res.status(400).json({ error: "orderedItems must be a non-empty array" });
    return;
  }

  const { items, error } = resolveItems(raw);
  if (error) {
    res.status(400).json({ error });
    return;
  }

  const apiKey      = process.env.SUMUP_API_KEY;
  const merchantCode = process.env.SUMUP_MERCHANT_CODE ?? "MB38NMGV";

  if (!apiKey) {
    res.status(500).json({ error: "SUMUP_API_KEY not configured" });
    return;
  }

  // Amount always calculated server-side
  const amount = Math.round(items.reduce((s, i) => s + i.price * i.quantity, 0) * 100) / 100;

  const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, ""); // YYMMDD
  const checkoutReference = `BS-${datePart}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

  pendingOrders.set(checkoutReference, items);

  // ── Alternative Payment Methods (PayPal, Apple Pay, Google Pay) ──────────────
  // SumUp only renders APMs in the widget when the checkout is created with an
  // absolute `redirect_url`. Without it, the widget shows the card field only.
  // Redirect-based methods return the payer here (with ?checkout_id=…) after pay.
  const baseUrl = resolveBaseUrl(req);
  const redirectUrl = baseUrl ? `${baseUrl}/order-success` : undefined;

  if (!redirectUrl) {
    console.warn(
      "[SumUp] Kein redirect_url ermittelbar (weder PUBLIC_BASE_URL noch Origin/Host-Header). " +
        "APMs wie PayPal/Apple Pay/Google Pay werden ohne redirect_url nicht angezeigt.",
    );
  }

  try {
    const sumupRes = await fetch("https://api.sumup.com/v0.1/checkouts", {
      method: "POST",
      headers: {
        Authorization:  `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        checkout_reference: checkoutReference,
        amount,
        currency,
        merchant_code: merchantCode,
        description:   buildDescription(items),
        // Required for APMs; also enables clean 3DS return for cards.
        ...(redirectUrl ? { redirect_url: redirectUrl } : {}),
      }),
    });

    if (!sumupRes.ok) {
      pendingOrders.delete(checkoutReference);
      const detail = await sumupRes.text();
      console.error("[SumUp] Checkout creation failed:", sumupRes.status, detail);
      res.status(sumupRes.status).json({ error: "SumUp checkout creation failed", detail });
      return;
    }

    const checkout = (await sumupRes.json()) as { id: string };
    console.log(
      `[SumUp] Checkout created: ${checkout.id} | ref: ${checkoutReference} | ${amount} EUR | ${items.length} Artikel`,
    );
    res.json({ checkoutId: checkout.id, checkoutReference, amount });
  } catch (err) {
    pendingOrders.delete(checkoutReference);
    console.error("[SumUp] Unexpected error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * GET /api/verify-checkout/:checkoutId
 *
 * Fetches the checkout details from SumUp and logs the items array so you can
 * verify exactly what was avisiert — name, price, quantity, tax rate — right
 * after a successful frontend payment.
 */
export async function handleVerifyCheckout(req: Request, res: Response) {
  const { checkoutId } = req.params as { checkoutId: string };
  const apiKey = process.env.SUMUP_API_KEY;

  if (!apiKey) {
    res.status(500).json({ error: "SUMUP_API_KEY not configured" });
    return;
  }

  try {
    const sumupRes = await fetch(`https://api.sumup.com/v0.1/checkouts/${checkoutId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!sumupRes.ok) {
      const detail = await sumupRes.text();
      console.error("[SumUp Verify] Fehler:", sumupRes.status, detail);
      res.status(sumupRes.status).json({ error: "SumUp Checkout nicht gefunden", detail });
      return;
    }

    const data = (await sumupRes.json()) as Record<string, unknown>;

    console.log("[SumUp Verify] ── Checkout-Details ──────────────────────");
    console.log("  ID:          ", data.id);
    console.log("  Status:      ", data.status);
    console.log("  Amount:      ", data.amount, data.currency);
    console.log("  Description: ", data.description);
    console.log("Avisierte Artikel:", data.items ?? "(kein items-Feld in API-Antwort)");
    console.log("[SumUp Verify] ─────────────────────────────────────────");

    res.json(data);
  } catch (err) {
    console.error("[SumUp Verify] Unexpected error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * POST /api/webhooks/sumup
 *
 * Receives SumUp payment events. On `transaction.successful`, looks up the
 * order from `pendingOrders` (keyed by checkout_reference), logs the order
 * to console and appends a line to `orders.txt`.
 *
 * In production: verify the `x-payload-signature` header against your webhook
 * secret before processing. Replace the TODO block with your POS/printer call.
 */
export function handleSumUpWebhook(req: Request, res: Response) {
  // ── Authenticity check ──────────────────────────────────────────────────────
  // SumUp lets you set the webhook URL in the dashboard; append a secret token
  // (?token=… or an X-Webhook-Token header) and verify it here so forged events
  // can't poison the order log. Fail-closed only when a secret is configured, so
  // an unconfigured deployment keeps working (the webhook currently only logs).
  const expected = process.env.SUMUP_WEBHOOK_TOKEN;
  if (expected) {
    const provided =
      (req.query.token as string | undefined) ??
      (req.headers["x-webhook-token"] as string | undefined);
    if (provided !== expected) {
      console.warn("[SumUp Webhook] Abgelehnt: fehlendes/falsches Token.");
      res.status(401).json({ error: "unauthorized" });
      return;
    }
  } else {
    console.warn(
      "[SumUp Webhook] SUMUP_WEBHOOK_TOKEN nicht gesetzt — Event wird ungeprüft angenommen. " +
        "Vor Kopplung an die Kasse: Token setzen und das Event zusätzlich per API gegen-verifizieren.",
    );
  }

  res.status(200).json({ received: true });

  const event     = req.body as Record<string, unknown>;
  const eventType =
    (event.type as string | undefined) ??
    (event.event_type as string | undefined);

  console.log("[SumUp Webhook] Event:", eventType);

  const isSuccess =
    eventType === "transaction.successful" ||
    (eventType === "PAYMENT" &&
      (event.payload as Record<string, unknown> | undefined)?.status === "SUCCESSFUL");

  if (!isSuccess) return;

  const transaction =
    (event.data  as Record<string, unknown> | undefined)?.transaction ??
    (event.payload as Record<string, unknown> | undefined);

  const checkoutReference = (transaction as Record<string, unknown> | undefined)
    ?.checkout_reference as string | undefined;

  const orderItems = checkoutReference ? pendingOrders.get(checkoutReference) : undefined;

  if (checkoutReference) pendingOrders.delete(checkoutReference);

  const logEntry = {
    event:    "transaction.successful",
    ref:      checkoutReference,
    items:    orderItems,
  };

  console.log("[SumUp Webhook] Zahlung erfolgreich:", logEntry);
  appendOrderLog(logEntry);

  // ─────────────────────────────────────────────────────────────────────────
  // TODO: Bon-Druck / Küchenbefehl
  //
  // `orderItems` enthält name, sku, variant_id, quantity, price, tax_rate.
  //
  // Option A – Deliverect / Lieferbuddy:
  //   await fetch(process.env.POS_WEBHOOK_URL!, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.POS_API_KEY}` },
  //     body: JSON.stringify({ items: orderItems, reference: checkoutReference }),
  //   });
  //
  // Option B – Direkter Bondrucker via ESC/POS (z.B. node-thermal-printer):
  //   await printer.printOrder(orderItems);
  // ─────────────────────────────────────────────────────────────────────────
}
