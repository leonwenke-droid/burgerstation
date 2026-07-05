/**
 * Store open/closed status helper.
 *
 * Öffnungszeiten: ausschließlich in server/storeConfig.json pflegen (wird beim
 * Build eingebunden). Schlüssel = JS getDay(): 0=So … 6=Sa.
 * Fr+Sa schließen um 02:00 Uhr am Folgetag → Cross-Midnight-Logik.
 *
 * Notaus (Ausverkauf): POST /api/admin/store-override — persistiert in Upstash KV
 * wenn konfiguriert, sonst In-Memory-Fallback (lokal).
 */
import type { Request, Response } from "express";
import { kvSet, kvGet } from "./kvStore";
import storeConfigFile from "./storeConfig.json";
import { requireAdmin } from "./security";

// ── Types ─────────────────────────────────────────────────────────────────────

interface DayHours { open: string; close: string }
interface StoreConfig {
  /** false = Store ist zeitlich immer offen; hours bleiben für späteres Reaktivieren erhalten. */
  enforce_opening_hours: boolean;
  store_closed_override: boolean;
  hours: Record<string, DayHours>;
}
export interface StoreStatus {
  isOpen:   boolean;
  reason?:  "OVERLOAD" | "CLOSED";
  nextOpen: string;
}

/** Beim Build aus server/storeConfig.json eingebunden — auf Vercel die Quelle der Wahrheit. */
const BUNDLED_CONFIG = storeConfigFile as StoreConfig;

const KV_OVERRIDE = "bs:store_force_closed";

// ── Config loader ─────────────────────────────────────────────────────────────

async function loadConfig(): Promise<StoreConfig> {
  const overrideRaw = await kvGet(KV_OVERRIDE);
  const forceClosed = overrideRaw === "true";
  return {
    enforce_opening_hours: BUNDLED_CONFIG.enforce_opening_hours ?? true,
    store_closed_override: forceClosed,
    hours: BUNDLED_CONFIG.hours,
  };
}

// ── Time helpers ──────────────────────────────────────────────────────────────

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function getBerlinTime(): { day: number; totalMinutes: number } {
  const now   = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Berlin",
    weekday:  "short",
    hour:     "2-digit",
    minute:   "2-digit",
    hour12:   false,
  }).formatToParts(now);

  const DAY_MAP: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };

  const weekday = parts.find(p => p.type === "weekday")?.value ?? "Mon";
  let   hour    = parseInt(parts.find(p => p.type === "hour")?.value   ?? "0", 10);
  const minute  = parseInt(parts.find(p => p.type === "minute")?.value ?? "0", 10);
  if (hour === 24) hour = 0;

  return { day: DAY_MAP[weekday] ?? 0, totalMinutes: hour * 60 + minute };
}

function isInPreMidnightSession(hours: DayHours, currentMinutes: number): boolean {
  const openMin  = toMinutes(hours.open);
  const closeMin = toMinutes(hours.close);
  if (closeMin > openMin) {
    return currentMinutes >= openMin && currentMinutes <= closeMin;
  }
  return currentMinutes >= openMin;
}

function nextOpeningLabel(config: StoreConfig, day: number): string {
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    const h = config.hours[String(d)];
    if (h) return `${h.open} Uhr`;
  }
  return "11:00 Uhr";
}

async function computeStatus(): Promise<StoreStatus> {
  const config = await loadConfig();

  if (config.store_closed_override) {
    return { isOpen: false, reason: "OVERLOAD", nextOpen: "bald" };
  }

  if (!config.enforce_opening_hours) {
    return { isOpen: true, nextOpen: "" };
  }

  const { day, totalMinutes } = getBerlinTime();

  const todayHours = config.hours[String(day)];
  if (todayHours && isInPreMidnightSession(todayHours, totalMinutes)) {
    return { isOpen: true, nextOpen: "" };
  }

  const yesterday      = (day + 6) % 7;
  const yesterdayHours = config.hours[String(yesterday)];
  if (yesterdayHours) {
    const yOpen  = toMinutes(yesterdayHours.open);
    const yClose = toMinutes(yesterdayHours.close);
    if (yClose < yOpen && totalMinutes <= yClose) {
      return { isOpen: true, nextOpen: "" };
    }
  }

  return {
    isOpen:   false,
    reason:   "CLOSED",
    nextOpen: nextOpeningLabel(config, day),
  };
}

// ── Express handlers ──────────────────────────────────────────────────────────

export async function handleStoreStatus(_req: Request, res: Response): Promise<void> {
  const [status, overrideRaw] = await Promise.all([
    computeStatus(),
    kvGet(KV_OVERRIDE),
  ]);
  res.json({ ...status, overrideActive: overrideRaw === "true" });
}

/** Server-side store-open check for enforcing order acceptance. */
export async function isStoreOpen(): Promise<boolean> {
  return (await computeStatus()).isOpen;
}

/** POST /api/admin/store-override  body: { closed: boolean } — admin only. */
export async function handleSetStoreOverride(req: Request, res: Response): Promise<void> {
  if (!requireAdmin(req, res)) return;

  const { closed } = req.body as { closed?: boolean };
  if (typeof closed !== "boolean") {
    res.status(400).json({ error: "closed must be boolean" });
    return;
  }
  await kvSet(KV_OVERRIDE, String(closed));
  console.log(`[Admin] Store override set to: ${closed ? "CLOSED" : "OPEN"}`);
  res.json({ ok: true, closed });
}
