/**
 * In-memory analytics for the Burger Station admin dashboard.
 *
 * State lives for the lifetime of the server process.
 * On Vercel (serverless), each warm instance tracks its own window;
 * for a single-store operation this is accurate enough.
 */
import type { Request, Response, NextFunction } from "express";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface OrderRecord {
  id:        string;
  timestamp: string; // ISO 8601
  total:     number;
  status:    "PAID" | "OPEN";
  items:     Array<{ name: string; quantity: number; price: number }>;
  customer?: string; // "Vorname Nachname"
  phone?:    string;
}

export interface AnalyticsSnapshot {
  activeUsers:    number;
  totalCartItems: number;
  orders:         OrderRecord[];
  ordersToday:    number;
  revenueToday:   number;
}

// ── In-memory state ───────────────────────────────────────────────────────────

/** IP → lastSeen timestamp (ms). Pruned after SESSION_TTL_MS. */
const activeIPs = new Map<string, number>();

/** sessionId → cart item count. One entry per browser session. */
const cartSessions = new Map<string, number>();

/** Up to 500 most recent orders (newest first). */
const orderHistory: OrderRecord[] = [];

const SESSION_TTL_MS = 5 * 60 * 1000; // 5 min

// ── Helpers ───────────────────────────────────────────────────────────────────

function pruneStale() {
  const cutoff = Date.now() - SESSION_TTL_MS;
  for (const [ip, ts] of activeIPs) {
    if (ts < cutoff) activeIPs.delete(ip);
  }
}

function totalCartItems(): number {
  let total = 0;
  for (const count of cartSessions.values()) total += count;
  return total;
}

function todayPrefix(): string {
  return new Date().toISOString().slice(0, 10);
}

function buildSnapshot(): AnalyticsSnapshot {
  pruneStale();
  const today = todayPrefix();
  const todayOrders = orderHistory.filter(o => o.timestamp.startsWith(today));
  return {
    activeUsers:    activeIPs.size,
    totalCartItems: totalCartItems(),
    orders:         orderHistory,
    ordersToday:    todayOrders.length,
    revenueToday:   todayOrders.reduce((s, o) => s + o.total, 0),
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Express middleware — register each API caller's IP as an active user.
 * Apply this to /api/* routes so every checkout/order ping keeps the counter live.
 */
export function trackActiveUser(req: Request, _res: Response, next: NextFunction): void {
  const ip =
    (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() ??
    req.socket?.remoteAddress ??
    "unknown";
  activeIPs.set(ip, Date.now());
  next();
}

/**
 * Record a completed order. Called by posHelpers after order creation.
 */
export function recordOrder(order: OrderRecord): void {
  orderHistory.unshift(order);
  if (orderHistory.length > 500) orderHistory.pop();
}

// ── Route handlers ────────────────────────────────────────────────────────────

/** GET /api/analytics/snapshot — polled by admin dashboard every 5 s. */
export function handleSnapshot(_req: Request, res: Response): void {
  res.json(buildSnapshot());
}

/**
 * POST /api/analytics/cart-sync
 * Body: { sessionId: string, count: number }
 * Frontend calls this on every cart state change.
 */
export function handleCartSync(req: Request, res: Response): void {
  const { sessionId, count } = req.body as { sessionId?: string; count?: number };
  if (sessionId && typeof count === "number" && count >= 0) {
    if (count === 0) {
      cartSessions.delete(sessionId);
    } else {
      cartSessions.set(sessionId, count);
    }
  }
  res.json({ ok: true, totalCartItems: totalCartItems() });
}
