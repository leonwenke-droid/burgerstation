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
