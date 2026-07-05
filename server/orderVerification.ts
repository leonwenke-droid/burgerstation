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
