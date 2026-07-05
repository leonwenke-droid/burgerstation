/**
 * Security helpers — admin auth, per-IP rate limiting, request-origin utilities.
 *
 * Kept dependency-free and enforced *inside* the route handlers so protection
 * applies no matter which server entry point (api/_source.ts, server/dev.ts,
 * server/index.ts) registers the route.
 */
import crypto from "node:crypto";
import type { Request, Response } from "express";

// ── Admin auth ──────────────────────────────────────────────────────────────

function timingSafeEqualStr(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

/**
 * Guards an admin-only endpoint. The client must send the admin secret as
 * `Authorization: Bearer <secret>`. Returns true when authorized; otherwise it
 * writes the error response and returns false.
 *
 * Fail-closed: if ADMIN_SECRET is not configured, ALL admin access is denied
 * (503). Set ADMIN_SECRET in the Vercel project env to enable the dashboard.
 */
export function requireAdmin(req: Request, res: Response): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    console.warn("[Security] ADMIN_SECRET nicht gesetzt — Admin-Endpunkte gesperrt (fail-closed).");
    res.status(503).json({ error: "Admin nicht konfiguriert (ADMIN_SECRET fehlt)." });
    return false;
  }
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token || !timingSafeEqualStr(token, secret)) {
    res.status(401).json({ error: "Nicht autorisiert." });
    return false;
  }
  return true;
}

// ── Request utilities ───────────────────────────────────────────────────────

export function getClientIp(req: Request): string {
  const fwd = req.headers["x-forwarded-for"];
  const ip = (Array.isArray(fwd) ? fwd[0] : fwd)?.split(",")[0]?.trim();
  return ip || req.socket?.remoteAddress || "unknown";
}

/** Host the site is served from (for Origin/Referer validation). */
export function getRequestHost(req: Request): string {
  const envUrl = process.env.PUBLIC_BASE_URL;
  if (envUrl) {
    try {
      return new URL(envUrl).host;
    } catch {
      /* ignore malformed env */
    }
  }
  const xfHost = req.headers["x-forwarded-host"];
  const host = (Array.isArray(xfHost) ? xfHost[0] : xfHost) ?? req.headers.host;
  return (host as string | undefined)?.split(",")[0]?.trim() ?? "";
}

/**
 * Rejects browser requests whose Origin/Referer is a *different* host than ours
 * (blocks naive cross-site / scripted abuse). Same-origin browser POSTs always
 * send Origin, so this does not break the real checkout flow. Requests without
 * any Origin/Referer are allowed through (can't distinguish) and are covered by
 * the rate limiter instead. Returns true when allowed.
 */
export function checkSameOrigin(req: Request, res: Response): boolean {
  const ourHost = getRequestHost(req);
  if (!ourHost) return true; // can't determine our host → don't block

  const source = (req.headers.origin as string | undefined) ?? (req.headers.referer as string | undefined);
  if (!source) return true;

  try {
    if (new URL(source).host === ourHost) return true;
  } catch {
    /* malformed → fall through to reject */
  }
  res.status(403).json({ error: "Ungültige Anfrage-Herkunft." });
  return false;
}

// ── Rate limiting (in-memory, per instance) ─────────────────────────────────
//
// NOTE: In-memory means per serverless instance on Vercel — it throttles a
// single attacker hammering one instance but is not a global limit. For strict
// cross-instance enforcement, back this with Upstash KV (INCR + EXPIRE).

interface Bucket {
  count: number;
  resetAt: number;
}
const buckets = new Map<string, Bucket>();

/** Returns { ok } — false when the caller exceeded `max` requests per `windowMs`. */
export function allowRequest(
  key: string,
  max: number,
  windowMs: number,
): { ok: boolean; retryAfter: number } {
  const now = Date.now();

  // Opportunistic cleanup so the map can't grow unbounded.
  if (buckets.size > 5000) {
    buckets.forEach((b, k) => {
      if (now >= b.resetAt) buckets.delete(k);
    });
  }

  const bucket = buckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  if (bucket.count >= max) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  bucket.count++;
  return { ok: true, retryAfter: 0 };
}

/** Convenience: rate-limit by client IP, writing a 429 on rejection. */
export function rateLimitByIp(
  req: Request,
  res: Response,
  prefix: string,
  max: number,
  windowMs: number,
): boolean {
  const { ok, retryAfter } = allowRequest(`${prefix}:${getClientIp(req)}`, max, windowMs);
  if (!ok) {
    res.setHeader("Retry-After", String(retryAfter));
    res.status(429).json({ error: "Zu viele Anfragen. Bitte kurz warten und erneut versuchen." });
  }
  return ok;
}
