/**
 * Store open/closed status helper.
 *
 * Öffnungszeiten stehen in server/storeConfig.json (Schlüssel = JS getDay()-Wert,
 * 0=Sonntag … 6=Samstag). Freitag+Samstag schließen um 02:00 Uhr des Folgetages
 * → Cross-Midnight-Logik beachten.
 *
 * Notaus (Vercel-Produktion): Env-Variable STORE_CLOSED_OVERRIDE=true setzen
 * und die Funktion neu deployen (~30 Sek.) — schneller als eine JSON-Datei
 * ändern. Lokal genügt store_closed_override:true in storeConfig.json.
 */
import fs   from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Request, Response } from "express";

// ── Types ─────────────────────────────────────────────────────────────────────

interface DayHours { open: string; close: string }
interface StoreConfig {
  store_closed_override: boolean;
  hours: Record<string, DayHours>;
}
export interface StoreStatus {
  isOpen:   boolean;
  reason?:  "OVERLOAD" | "CLOSED";
  nextOpen: string;
}

// ── Default config (kept in sync with storeConfig.json) ──────────────────────

const DEFAULT_CONFIG: StoreConfig = {
  store_closed_override: false,
  hours: {
    "1": { open: "11:00", close: "23:00" },
    "2": { open: "11:00", close: "23:00" },
    "3": { open: "11:00", close: "23:00" },
    "4": { open: "11:00", close: "23:00" },
    "5": { open: "11:00", close: "02:00" },
    "6": { open: "11:00", close: "02:00" },
    "0": { open: "11:00", close: "23:00" },
  },
};

// ── Runtime state (survives without restart, resets on cold start) ────────────

let runtimeOverride: boolean | null = null;
let runtimeHours: Record<string, DayHours> | null = null;

export function setRuntimeOverride(value: boolean | null): void { runtimeOverride = value; }
export function getRuntimeOverride(): boolean | null { return runtimeOverride; }
export function setRuntimeHours(hours: Record<string, DayHours>): void { runtimeHours = hours; }

// ── Config loader ─────────────────────────────────────────────────────────────

function loadConfig(): StoreConfig {
  // 1. Runtime override (set via admin dashboard)
  if (runtimeOverride !== null) {
    const hours = runtimeHours ?? readFileHours() ?? DEFAULT_CONFIG.hours;
    return { store_closed_override: runtimeOverride, hours };
  }
  // 2. Env-var override (Vercel dashboard)
  if (process.env.STORE_CLOSED_OVERRIDE === "true") {
    return { ...DEFAULT_CONFIG, store_closed_override: true };
  }
  // 3. Runtime hours edit (no override, but hours were changed via admin UI)
  if (runtimeHours) {
    return { store_closed_override: false, hours: runtimeHours };
  }
  // 4. JSON file (local dev, live-editable)
  const fileConfig = readFileHours();
  if (fileConfig) return { store_closed_override: false, hours: fileConfig };
  return DEFAULT_CONFIG;
}

function readFileHours(): Record<string, DayHours> | null {
  try {
    let configPath: string;
    try {
      configPath = fileURLToPath(new URL("./storeConfig.json", import.meta.url));
    } catch {
      configPath = path.join(__dirname, "storeConfig.json");
    }
    const raw = JSON.parse(fs.readFileSync(configPath, "utf-8")) as StoreConfig;
    return raw.hours ?? null;
  } catch {
    return null;
  }
}

/** Returns the currently effective hours (for the admin editor). */
export function getEffectiveHours(): Record<string, DayHours> {
  return runtimeHours ?? readFileHours() ?? DEFAULT_CONFIG.hours;
}

// ── Time helpers ──────────────────────────────────────────────────────────────

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** Returns current time in Europe/Berlin. */
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
  if (hour === 24) hour = 0; // Intl may return 24 for midnight

  return { day: DAY_MAP[weekday] ?? 0, totalMinutes: hour * 60 + minute };
}

/**
 * True if `currentMinutes` falls inside the *pre-midnight* portion of `hours`.
 * For cross-midnight days (close < open), only the "≥ open" part is checked
 * here; the "≤ close (after midnight)" part is handled via yesterday's session.
 */
function isInPreMidnightSession(hours: DayHours, currentMinutes: number): boolean {
  const openMin  = toMinutes(hours.open);
  const closeMin = toMinutes(hours.close);

  if (closeMin > openMin) {
    // Same-day session  e.g. 11:00–23:00
    return currentMinutes >= openMin && currentMinutes <= closeMin;
  }
  // Cross-midnight: only the "before midnight" portion (≥ open until 23:59)
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

// ── Core logic ────────────────────────────────────────────────────────────────

function computeStatus(): StoreStatus {
  const config = loadConfig();

  if (config.store_closed_override) {
    return { isOpen: false, reason: "OVERLOAD", nextOpen: "bald" };
  }

  const { day, totalMinutes } = getBerlinTime();

  // 1. Check today's pre-midnight session
  const todayHours = config.hours[String(day)];
  if (todayHours && isInPreMidnightSession(todayHours, totalMinutes)) {
    return { isOpen: true, nextOpen: "" };
  }

  // 2. Check yesterday's after-midnight session (cross-midnight days only)
  //    e.g. it's 01:30 on Saturday → are we still in Friday's session (closes 02:00)?
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

export function handleStoreStatus(_req: Request, res: Response): void {
  res.json({ ...computeStatus(), overrideActive: runtimeOverride });
}

/** POST /api/admin/store-override  body: { closed: boolean } */
export function handleSetStoreOverride(req: Request, res: Response): void {
  const { closed } = req.body as { closed?: boolean };
  if (typeof closed !== "boolean") {
    res.status(400).json({ error: "closed must be boolean" });
    return;
  }
  setRuntimeOverride(closed);
  console.log(`[Admin] Store override set to: ${closed ? "CLOSED" : "OPEN"}`);
  res.json({ ok: true, closed });
}

/** GET /api/admin/store-config — returns current effective hours + override state. */
export function handleGetStoreConfig(_req: Request, res: Response): void {
  res.json({
    hours:          getEffectiveHours(),
    overrideActive: runtimeOverride,
    isOpen:         computeStatus().isOpen,
  });
}

/** POST /api/admin/set-hours  body: { hours: Record<string, {open,close}> } */
export function handleSetHours(req: Request, res: Response): void {
  const { hours } = req.body as { hours?: Record<string, DayHours> };
  if (!hours || typeof hours !== "object") {
    res.status(400).json({ error: "hours object required" });
    return;
  }
  // Basic validation: each entry needs HH:MM strings
  const HH_MM = /^\d{2}:\d{2}$/;
  for (const [day, h] of Object.entries(hours)) {
    if (!["0","1","2","3","4","5","6"].includes(day) || !HH_MM.test(h.open) || !HH_MM.test(h.close)) {
      res.status(400).json({ error: `Ungültiger Eintrag für Tag ${day}` });
      return;
    }
  }
  setRuntimeHours(hours);
  console.log("[Admin] Öffnungszeiten aktualisiert:", hours);
  res.json({ ok: true, hours });
}
