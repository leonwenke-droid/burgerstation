/**
 * The Good Till / SumUp KassenPOS Pro – ExternalSale Integration
 *
 * SumUp KassenPOS Pro (the iPad POS) runs on The Good Till infrastructure.
 * Orders pushed here appear on the POS register within ~10 seconds and trigger
 * kitchen receipt printing automatically once accepted.
 *
 * Required environment variables (.env.local):
 *   GOODTILL_SUBDOMAIN   – Your shop subdomain, e.g. "burgerstation-leer"
 *   GOODTILL_USERNAME    – POS admin email
 *   GOODTILL_PASSWORD    – POS admin password
 *   GOODTILL_OUTLET_ID   – Outlet/register ID (from POS dashboard)
 *
 * Product IDs:
 *   Each menu item needs a `goodtill_product_id` matching its ID in The Good
 *   Till product catalogue. Add these to GOODTILL_PRODUCTS below once you have
 *   them (Settings → Products in the POS dashboard).
 *
 * API docs: https://apidoc.thegoodtill.com
 */

import type { Request, Response } from "express";
import { PRODUCTS, getProductBySku, requiresSumUpForDelivery } from "../shared/products";
import { recordOrder } from "./analyticsHelper";
import { rateLimitByIp, checkSameOrigin } from "./security";
import { isStoreOpen } from "./storeStatusHelper";

// ── Product ID mapping ────────────────────────────────────────────────────────
// Keyed by SumUp variant_id → The Good Till product_id
// Fill in the goodtill_product_id values from the POS dashboard.
const GOODTILL_PRODUCTS: Record<
  string,
  { product_id: string; sku: string; name: string; price: number; tax_rate: number }
> = Object.fromEntries(
  PRODUCTS.flatMap((product) =>
    product.sumup?.posProductId
      ? [
          [
            product.sumup.variantId,
            {
              product_id: product.sumup.posProductId,
              sku: product.sku,
              name: product.name,
              price: product.price,
              tax_rate: product.taxCategory === "drink" ? 19 : 7,
            },
          ],
        ]
      : [],
  ),
);

// ── Types ─────────────────────────────────────────────────────────────────────

type PosPaymentStatus = "OPEN" | "PAID";
type PosPaymentType   = "CASH" | "CARD" | "ECOM";

export interface PosOrderItem {
  variant_id?: string;   // maps to GOODTILL_PRODUCTS for price/id lookup
  sku:         string;
  name:        string;
  quantity:    number;
  price:       number;
  tax_rate:    number;
}

export interface CreatePosOrderBody {
  items:          PosOrderItem[];
  paymentStatus:  PosPaymentStatus;  // "OPEN" = unpaid (bar/karte), "PAID" = online
  paymentType?:   PosPaymentType;    // "CASH" | "CARD" | "ECOM"
  customer?: {
    vorname:  string;
    nachname: string;
    telefon:  string;
    strasse:  string;
    ort:      string;
  };
  orderRef?: string;  // checkout_reference or internal order number
}

// ── JWT token cache (one token per server restart) ────────────────────────────

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getToken(baseUrl: string): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) return cachedToken.token;

  const username = process.env.GOODTILL_USERNAME;
  const password = process.env.GOODTILL_PASSWORD;

  if (!username || !password) throw new Error("GOODTILL_USERNAME / GOODTILL_PASSWORD not set");

  const res = await fetch(`${baseUrl}/auth/login`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Good Till auth failed ${res.status}: ${detail}`);
  }

  const data = (await res.json()) as { token?: string };
  if (!data.token) throw new Error("Good Till auth: no token in response");

  // Cache for 50 minutes (tokens are usually valid for 1 hour)
  cachedToken = { token: data.token, expiresAt: Date.now() + 50 * 60 * 1000 };
  return data.token;
}

// ── Input validation / price hardening ────────────────────────────────────────

const MAX_ITEMS      = 40;   // per order
const MAX_QUANTITY   = 50;   // per line
const MAX_UNIT_PRICE = 200;  // € — sanity ceiling for a single item
const MAX_ORDER_TOTAL = 1000; // € — sanity ceiling for the whole order

/**
 * Validates and normalises client-supplied order items. Prices and tax rates for
 * catalog items (known variant_id) are ALWAYS taken from the server-side catalog,
 * so a manipulated client price is ignored. Non-catalog items are bounds-checked.
 */
function sanitizePosItems(raw: unknown): { items?: PosOrderItem[]; error?: string } {
  if (!Array.isArray(raw) || raw.length === 0) {
    return { error: "items must be a non-empty array" };
  }
  if (raw.length > MAX_ITEMS) {
    return { error: `Zu viele Positionen (max. ${MAX_ITEMS}).` };
  }

  const clean: PosOrderItem[] = [];
  for (const entry of raw as PosOrderItem[]) {
    if (!entry || typeof entry !== "object") return { error: "Ungültige Position." };

    const quantity = Number(entry.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      return { error: `Ungültige Menge für "${entry.name ?? entry.variant_id}".` };
    }

    const catalog = entry.variant_id ? GOODTILL_PRODUCTS[entry.variant_id] : undefined;
    if (catalog) {
      // Trusted path — price/tax/name come from the server catalog, never the client.
      clean.push({
        variant_id: entry.variant_id,
        sku:        catalog.sku,
        name:       catalog.name,
        quantity,
        price:      catalog.price,
        tax_rate:   catalog.tax_rate,
      });
    } else {
      const product = typeof entry.sku === "string" ? getProductBySku(entry.sku) : undefined;
      if (!product) return { error: `Unbekannte oder fehlende SKU: "${entry.sku ?? ""}".` };
      if (requiresSumUpForDelivery(product)) {
        return {
          error: `"${product.name}" ist noch nicht für Online-Bestellungen freigeschaltet.`,
        };
      }
      clean.push({
        sku: product.sku,
        name: product.name,
        quantity,
        price: product.price,
        tax_rate: product.taxCategory === "drink" ? 19 : 7,
      });
    }
  }

  const total = clean.reduce((s, i) => s + i.price * i.quantity, 0);
  if (total > MAX_ORDER_TOTAL) {
    return { error: `Bestellsumme unplausibel hoch (max. ${MAX_ORDER_TOTAL} €).` };
  }

  return { items: clean };
}

// ── Main handler ──────────────────────────────────────────────────────────────

/**
 * POST /api/create-pos-order
 *
 * Pushes an order to the SumUp KassenPOS Pro (The Good Till).
 * - paymentStatus "OPEN"  → bar/karte order, appears on iPad as unpaid → kitchen prints on accept
 * - paymentStatus "PAID"  → online order, appears on iPad as already paid → kitchen prints on accept
 */
export interface PosResult {
  ok:          boolean;
  mode?:       "local-only";
  posOrderId?: string;
  ref?:        string;
  error?:      string;
  detail?:     string;
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

  // Validate + normalise items (server-side prices for catalog items).
  const { items, error: itemError } = sanitizePosItems(body.items);
  if (itemError || !items) {
    return { ok: false, error: itemError ?? "Ungültige Bestellung.", httpStatus: 400 };
  }

  // Enforce store-open server-side for unpaid (bar/karte) orders. PAID orders are
  // already paid online, so they are always accepted even if the store just
  // closed — we must never drop a captured payment.
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
    // In demo mode: log the order locally and return success so the UI flow works.
    console.warn(
      `[POS] Good Till nicht konfiguriert (fehlend: ${missingVars.join(", ")}). ` +
      `Bestellung wird nur lokal protokolliert.`,
    );
    console.log("[POS] 📋 Bestellung (lokal):", {
      ref:     orderRef,
      status:  paymentStatus,
      payment: paymentType,
      items:   items.map((i) => `${i.quantity}× ${i.name} @ ${i.price} €`),
      customer,
    });
    recordOrder({
      id:        orderRef ?? `BS-LOCAL-${Date.now()}`,
      timestamp: new Date().toISOString(),
      total:     items.reduce((s, i) => s + i.price * i.quantity, 0),
      status:    paymentStatus,
      items:     items.map((i) => ({ sku: i.sku, name: i.name, quantity: i.quantity, price: i.price })),
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
        product_id: catalogEntry?.product_id ?? null,  // null = free-text item
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
          payment_status: paymentStatus,  // "OPEN" or "PAID"
        },
      ],
      customer_name:  customer ? `${customer.vorname} ${customer.nachname}` : undefined,
      customer_phone: customer?.telefon,
      notes:          customer ? `Lieferung: ${customer.strasse}, ${customer.ort}` : undefined,
      external_reference: orderRef,
    };

    const posRes = await fetch(`${baseUrl}/externalsale`, {
      method:  "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:  `Bearer ${token}`,
        "Outlet-Id":    outletId!,
      },
      body: JSON.stringify(salePayload),
    });

    if (!posRes.ok) {
      const detail = await posRes.text();
      console.error("[POS] ExternalSale failed:", posRes.status, detail);
      // Non-fatal: we don't want to block the customer flow if POS is down.
      return { ok: false, error: `POS Fehler ${posRes.status}`, detail };
    }

    const posData = (await posRes.json()) as { id?: string };
    console.log(
      `[POS] ✅ Bestellung erstellt | ref: ${orderRef} | status: ${paymentStatus} | POS-ID: ${posData.id}`,
    );
    recordOrder({
      id:        orderRef ?? `BS-POS-${posData.id ?? Date.now()}`,
      timestamp: new Date().toISOString(),
      total:     totalAmount,
      status:    paymentStatus,
      items:     items.map((i) => ({ sku: i.sku, name: i.name, quantity: i.quantity, price: i.price })),
      customer:  customer ? `${customer.vorname} ${customer.nachname}` : undefined,
      phone:     customer?.telefon,
    });
    return { ok: true, posOrderId: posData.id, ref: orderRef };
  } catch (err) {
    console.error("[POS] Unexpected error:", err);
    // Also non-fatal — customer flow must not break if POS is unreachable.
    return { ok: false, error: String(err) };
  }
}

/**
 * POST /api/create-pos-order — PAID/online orders only.
 * OPEN (unpaid bar/karte) orders MUST go through /api/order/confirm (email code),
 * so they are rejected here to prevent bypassing verification.
 */
export async function handleCreatePosOrder(req: Request, res: Response) {
  // 1) Rate limit per IP — blocks scripted order floods to the kitchen.
  if (!(await rateLimitByIp(req, res, "pos", 10, 60_000))) return;
  // 2) Reject cross-site / off-origin browser requests.
  if (!checkSameOrigin(req, res)) return;

  const body = req.body as CreatePosOrderBody;

  // 3) Unpaid orders must be email-verified via /api/order/confirm.
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
  const { httpStatus: _omit, ...clean } = result;
  res.json(clean);
}
