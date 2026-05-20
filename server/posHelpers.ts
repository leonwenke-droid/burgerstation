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

// ── Product ID mapping ────────────────────────────────────────────────────────
// Keyed by SumUp variant_id → The Good Till product_id
// Fill in the goodtill_product_id values from the POS dashboard.
const GOODTILL_PRODUCTS: Record<string, { product_id: string; name: string; price: number; tax_rate: number }> = {
  "7569a6cd-268f-4d16-b86f-09676f4dcfaa": {
    product_id: "GOODTILL_ID_DOUBLE_SMASH",   // ← replace with real ID from POS dashboard
    name:       "Double Smash",
    price:      9.40,
    tax_rate:   7,
  },
  "42194cc3-fe98-4a6d-b5fa-04d333730d96": {
    product_id: "GOODTILL_ID_LONG_CHILI",     // ← replace with real ID from POS dashboard
    name:       "Long Chili Cheese",
    price:      11.90,
    tax_rate:   7,
  },
};

// ── Types ─────────────────────────────────────────────────────────────────────

type PosPaymentStatus = "OPEN" | "PAID";
type PosPaymentType   = "CASH" | "CARD" | "ECOM";

export interface PosOrderItem {
  variant_id?: string;   // maps to GOODTILL_PRODUCTS for price/id lookup
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

// ── Main handler ──────────────────────────────────────────────────────────────

/**
 * POST /api/create-pos-order
 *
 * Pushes an order to the SumUp KassenPOS Pro (The Good Till).
 * - paymentStatus "OPEN"  → bar/karte order, appears on iPad as unpaid → kitchen prints on accept
 * - paymentStatus "PAID"  → online order, appears on iPad as already paid → kitchen prints on accept
 */
export async function handleCreatePosOrder(req: Request, res: Response) {
  const body = req.body as CreatePosOrderBody;
  const { items, paymentStatus, paymentType, customer, orderRef } = body;

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: "items must be a non-empty array" });
    return;
  }

  const subdomain = process.env.GOODTILL_SUBDOMAIN;
  const outletId  = process.env.GOODTILL_OUTLET_ID;

  // ── Config check: log clearly what's missing ────────────────────────────────
  const missingVars = [
    !subdomain && "GOODTILL_SUBDOMAIN",
    !outletId  && "GOODTILL_OUTLET_ID",
    !process.env.GOODTILL_USERNAME && "GOODTILL_USERNAME",
    !process.env.GOODTILL_PASSWORD && "GOODTILL_PASSWORD",
  ].filter(Boolean);

  if (missingVars.length > 0) {
    // In demo mode: log the order locally and return success so the UI flow works
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
    res.json({ ok: true, mode: "local-only", ref: orderRef });
    return;
  }

  const baseUrl = `https://${subdomain}.goodtill.com/api`;

  try {
    const token = await getToken(baseUrl);

    // ── Map items to Good Till line items ──────────────────────────────────────
    const lineItems = items.map((item) => {
      const catalogEntry = item.variant_id ? GOODTILL_PRODUCTS[item.variant_id] : null;
      return {
        product_id:  catalogEntry?.product_id ?? null,  // null = free-text item
        name:        item.name,
        quantity:    item.quantity,
        price:       item.price,
        tax_rate:    item.tax_rate,
      };
    });

    const totalAmount = items.reduce((s, i) => s + i.price * i.quantity, 0);

    // ── Build The Good Till ExternalSale payload ───────────────────────────────
    const salePayload = {
      sale_items: lineItems,
      payments: [
        {
          payment_type:   paymentType ?? (paymentStatus === "PAID" ? "ECOM" : "CASH"),
          payment_amount: totalAmount,
          payment_status: paymentStatus,  // "OPEN" or "PAID"
        },
      ],
      customer_name: customer
        ? `${customer.vorname} ${customer.nachname}`
        : undefined,
      customer_phone: customer?.telefon,
      notes: customer
        ? `Lieferung: ${customer.strasse}, ${customer.ort}`
        : undefined,
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
      // Non-fatal: we don't want to block the customer flow if POS is down
      res.json({ ok: false, error: `POS Fehler ${posRes.status}`, detail });
      return;
    }

    const posData = (await posRes.json()) as { id?: string };
    console.log(
      `[POS] ✅ Bestellung erstellt | ref: ${orderRef} | status: ${paymentStatus} | POS-ID: ${posData.id}`,
    );
    res.json({ ok: true, posOrderId: posData.id, ref: orderRef });
  } catch (err) {
    console.error("[POS] Unexpected error:", err);
    // Also non-fatal — customer flow must not break if POS is unreachable
    res.json({ ok: false, error: String(err) });
  }
}
