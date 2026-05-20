import fs from "node:fs";
import path from "node:path";
import type { Request, Response } from "express";

// ─── Master-Katalog ────────────────────────────────────────────────────────────
// Einzige verlässliche Quelle für Preise und Steuersätze.
// Basiert auf dem offiziellen SumUp CSV-Export.
// Neue Artikel einfach als weiteres Objekt hinzufügen.
export const SUMUP_CATALOG = [
  {
    sumup_catalog_id: "c0b10e52-2f19-4614-9633-76e4da4228c3",  // Item ID aus dem SumUp CSV-Export
    variant_id:       "7569a6cd-268f-4d16-b86f-09676f4dcfaa",  // Variant ID aus dem SumUp CSV-Export
    sku:              "DBL-SMSH-001",
    name:             "Double Smash",
    price:            9.40,
    tax_rate:         7.00,
  },
  {
    sumup_catalog_id: "0e9f1a01-c675-40d8-b12a-6bbcdeccd21a",
    variant_id:       "42194cc3-fe98-4a6d-b5fa-04d333730d96",
    sku:              "LNG-CHI-002",
    name:             "Long Chili Cheese",
    price:            11.90,
    tax_rate:         7.00,
  },
  // Vorlage für neue Artikel (aus SumUp CSV-Export einfügen):
  // { sumup_catalog_id: "HIER_ID_EINTRAGEN", variant_id: "HIER_VARIANT_ID", sku: "...", name: "Single Smash", price: 0.00, tax_rate: 7.00 },
] as const;

// ─── Interfaces ───────────────────────────────────────────────────────────────

/** Item sent from the frontend: either a catalog variant (variant_id + quantity)
 *  or a non-catalog fallback (name + price + quantity). */
export interface OrderedItem {
  variant_id?: string;
  name?:       string;
  sku?:        string;
  quantity:    number;
  price?:      number;   // used only when no variant_id
  tax_rate?:   number;   // defaults to 7 when no variant_id
}

/** Resolved item after catalog lookup — all fields guaranteed. */
interface ResolvedItem {
  variant_id?: string;
  sku?:        string;
  name:        string;
  quantity:    number;
  price:       number;
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
        tax_rate:   entry.tax_rate,
      });
    } else {
      // Fallback path for items not yet in catalog
      if (!o.name || typeof o.price !== "number" || o.price <= 0) {
        return { items: [], error: "Fallback-Item muss name und price > 0 haben." };
      }
      resolved.push({
        sku:      o.sku,
        name:     o.name,
        quantity: o.quantity,
        price:    o.price,
        tax_rate: o.tax_rate ?? 7,
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
