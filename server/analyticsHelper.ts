/**
 * In-memory analytics — session-based user tracking.
 *
 * Each browser tab carries a `bs_session_id` (sessionStorage).
 * On beforeunload the frontend fires sendBeacon → /api/analytics/disconnect.
 * Sessions also expire automatically after SESSION_TTL_MS (45 s) of inactivity,
 * so a crash/hard-close never leaves a ghost visitor in the count.
 */
import type { Request, Response, NextFunction } from "express";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface OrderRecord {
  id:        string;
  timestamp: string;
  total:     number;
  status:    "PAID" | "OPEN";
  items:     Array<{ name: string; quantity: number; price: number }>;
  customer?: string;
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

/** sessionId → lastSeen (ms). Max 45 s stale before pruned. */
const activeSessions = new Map<string, number>();

/** sessionId → cart item count. */
const cartSessions = new Map<string, number>();

/** Up to 500 most recent orders, newest first. */
const orderHistory: OrderRecord[] = [];

const SESSION_TTL_MS = 45_000; // 45 seconds — matches frontend 30 s heartbeat

// ── Helpers ───────────────────────────────────────────────────────────────────

function pruneStale(): void {
  const cutoff = Date.now() - SESSION_TTL_MS;
  for (const [id, ts] of activeSessions) {
    if (ts < cutoff) {
      activeSessions.delete(id);
      cartSessions.delete(id); // ghost cart gone too
    }
  }
}

function totalCartItems(): number {
  let n = 0;
  for (const c of cartSessions.values()) n += c;
  return n;
}

function buildSnapshot(): AnalyticsSnapshot {
  pruneStale();
  const today = new Date().toISOString().slice(0, 10);
  const todayOrders = orderHistory.filter(o => o.timestamp.startsWith(today));
  return {
    activeUsers:    activeSessions.size,
    totalCartItems: totalCartItems(),
    orders:         orderHistory,
    ordersToday:    todayOrders.length,
    revenueToday:   todayOrders.reduce((s, o) => s + o.total, 0),
  };
}

/** Extract sessionId from header, body, or fall back to IP. */
function extractSession(req: Request): string {
  return (
    (req.headers["x-session-id"] as string | undefined) ??
    (req.body as Record<string, unknown>)?.sessionId as string | undefined ??
    (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() ??
    req.socket?.remoteAddress ??
    "unknown"
  );
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Middleware — bump session lastSeen on every API call.
 * Works even without a heartbeat as long as the user does anything (cart sync, etc.)
 */
export function trackActiveUser(req: Request, _res: Response, next: NextFunction): void {
  activeSessions.set(extractSession(req), Date.now());
  next();
}

/** Called by posHelpers after order creation. */
export function recordOrder(order: OrderRecord): void {
  orderHistory.unshift(order);
  if (orderHistory.length > 500) orderHistory.pop();
}

// ── Route handlers ────────────────────────────────────────────────────────────

/** GET /api/analytics/snapshot */
export function handleSnapshot(_req: Request, res: Response): void {
  res.json(buildSnapshot());
}

/**
 * POST /api/analytics/heartbeat
 * Body: { sessionId }
 * Frontend calls this every 30 s to stay "alive" in the counter.
 */
export function handleHeartbeat(req: Request, res: Response): void {
  const sessionId = extractSession(req);
  activeSessions.set(sessionId, Date.now());
  res.json({ ok: true, activeUsers: activeSessions.size });
}

/**
 * POST /api/analytics/disconnect
 * Body: { sessionId }
 * Frontend fires this via navigator.sendBeacon on beforeunload.
 * Immediately removes the session so the counter drops to 0 when the last tab closes.
 */
export function handleDisconnect(req: Request, res: Response): void {
  const sessionId = extractSession(req);
  activeSessions.delete(sessionId);
  cartSessions.delete(sessionId);
  res.json({ ok: true });
}

/**
 * POST /api/analytics/cart-sync
 * Body: { sessionId, count }
 */
export function handleCartSync(req: Request, res: Response): void {
  const { sessionId, count } = req.body as { sessionId?: string; count?: number };
  if (sessionId && typeof count === "number" && count >= 0) {
    activeSessions.set(sessionId, Date.now()); // cart activity = alive
    if (count === 0) cartSessions.delete(sessionId);
    else             cartSessions.set(sessionId, count);
  }
  res.json({ ok: true, totalCartItems: totalCartItems() });
}
