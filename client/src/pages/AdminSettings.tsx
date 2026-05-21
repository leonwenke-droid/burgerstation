import { useEffect, useRef, useState } from "react";
import { Search, RefreshCw, TrendingUp, ShoppingCart, Users, Save, Check, AlertTriangle } from "lucide-react";

const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN ?? "burgerstation";

// ── Types ─────────────────────────────────────────────────────────────────────

interface DayHours  { open: string; close: string }
interface OrderItem { name: string; quantity: number; price: number }
interface OrderRecord {
  id: string; timestamp: string; total: number;
  status: "PAID" | "OPEN"; items: OrderItem[];
  customer?: string; phone?: string;
}
interface Snapshot {
  activeUsers: number; totalCartItems: number;
  orders: OrderRecord[]; ordersToday: number; revenueToday: number;
}
interface StoreConfig {
  hours: Record<string, DayHours>;
  overrideActive: boolean | null;
  isOpen: boolean;
}

const DAY_LABELS: Record<string, string> = {
  "1": "Montag", "2": "Dienstag", "3": "Mittwoch",
  "4": "Donnerstag", "5": "Freitag", "6": "Samstag", "0": "Sonntag",
};
const DAY_ORDER = ["1","2","3","4","5","6","0"];

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt     = (n: number)  => n.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });

// ── PIN Gate ──────────────────────────────────────────────────────────────────

function PinGate({ onAuth }: { onAuth: () => void }) {
  const [input, setInput] = useState("");
  const [shake, setShake] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (input === ADMIN_PIN) { sessionStorage.setItem("bs_admin_auth", "1"); onAuth(); }
    else { setShake(true); setInput(""); setTimeout(() => setShake(false), 500); }
  }
  return (
    <div className="min-h-screen bg-bs-sand flex items-center justify-center p-4">
      <form onSubmit={submit}
        className={`retro-card p-8 w-full max-w-xs space-y-5 ${shake ? "translate-x-1" : ""} transition-transform`}>
        <h1 className="font-subhead text-2xl text-bs-ink text-center uppercase tracking-wider">🔒 Admin</h1>
        <input type="password" placeholder="PIN eingeben" value={input}
          onChange={e => setInput(e.target.value)} autoFocus
          className="w-full border-[3px] border-bs-ink rounded-xl px-4 py-3 font-body text-lg bg-white focus:outline-none text-center tracking-widest" />
        <button type="submit" className="btn-pink w-full">EINLOGGEN →</button>
      </form>
    </div>
  );
}

// ── Emergency Stop ─────────────────────────────────────────────────────────────

function EmergencyStop() {
  const [cfg, setCfg]     = useState<StoreConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  async function load() {
    const r = await fetch("/api/admin/store-config");
    setCfg(await r.json());
  }

  useEffect(() => { load(); }, []);

  async function toggle() {
    if (!cfg) return;
    if (cfg.isOpen && !confirm) { setConfirm(true); return; }
    setConfirm(false);
    setLoading(true);
    await fetch("/api/admin/store-override", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ closed: cfg.isOpen }),
    });
    await load();
    setLoading(false);
  }

  const isOverrideOff = cfg?.isOpen === true;

  return (
    <div className={`border-[4px] border-bs-ink rounded-2xl shadow-[6px_6px_0_var(--bs-ink)] overflow-hidden ${isOverrideOff ? "bg-green-200" : "bg-red-200"}`}>
      {/* Status bar */}
      <div className={`px-6 py-4 flex items-center justify-between gap-4 flex-wrap ${isOverrideOff ? "bg-green-300" : "bg-red-400"}`}>
        <div className="flex items-center gap-3">
          <span className={`w-4 h-4 rounded-full border-2 border-bs-ink animate-pulse ${isOverrideOff ? "bg-green-600" : "bg-red-700"}`} />
          <span className="font-subhead text-xl text-bs-ink uppercase tracking-wider">
            {isOverrideOff ? "✅ ONLINE-BESTELLUNGEN AKTIV" : "🛑 ONLINE-BESTELLUNGEN GESTOPPT"}
          </span>
        </div>
        {cfg?.overrideActive === true && (
          <span className="bg-white border-2 border-bs-ink rounded-full px-3 py-1 font-subhead text-xs uppercase text-red-700">
            Manuell gesperrt
          </span>
        )}
      </div>

      {/* Action area */}
      <div className="px-6 py-5 flex items-center gap-6 flex-wrap">
        <div className="flex-1">
          {isOverrideOff ? (
            <p className="font-body text-sm text-bs-ink leading-relaxed">
              Kunden können gerade bestellen. Klicke den Button rechts um bei{" "}
              <strong>Ausverkauf oder zu vielen Bestellungen</strong> sofort alle Online-Bestellungen zu stoppen.
            </p>
          ) : (
            <p className="font-body text-sm text-bs-ink leading-relaxed">
              Die Online-Kasse ist gesperrt. Kunden sehen die Meldung{" "}
              <em>"Online-Kasse kurzzeitig pausiert"</em> und können nicht bestellen.
            </p>
          )}
        </div>

        {confirm ? (
          <div className="flex flex-col items-end gap-2">
            <p className="font-subhead text-sm text-bs-ink uppercase">Wirklich stoppen?</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirm(false)}
                className="px-4 py-2 border-[3px] border-bs-ink rounded-xl font-subhead text-sm bg-white hover:bg-zinc-100 transition-colors shadow-[3px_3px_0_var(--bs-ink)]">
                ABBRECHEN
              </button>
              <button onClick={toggle} disabled={loading}
                className="px-4 py-2 border-[3px] border-bs-ink rounded-xl font-subhead text-sm bg-red-600 text-white hover:bg-red-700 transition-colors shadow-[3px_3px_0_var(--bs-ink)] disabled:opacity-50">
                JA, STOPPEN
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={toggle}
            disabled={loading || cfg === null}
            className={`
              px-8 py-4 border-[4px] border-bs-ink rounded-2xl font-subhead text-lg uppercase
              shadow-[5px_5px_0_var(--bs-ink)] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0_var(--bs-ink)]
              transition-all disabled:opacity-50
              ${isOverrideOff
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-green-500 text-white hover:bg-green-600"}
            `}
          >
            {loading ? "…" : isOverrideOff ? "🛑 JETZT STOPPEN" : "✅ WIEDER ÖFFNEN"}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Opening Hours Editor ───────────────────────────────────────────────────────

function HoursEditor() {
  const [hours, setHours]   = useState<Record<string, DayHours> | null>(null);
  const [dirty, setDirty]   = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/store-config")
      .then(r => r.json())
      .then((d: StoreConfig) => setHours(d.hours));
  }, []);

  function update(day: string, field: "open" | "close", val: string) {
    setHours(prev => prev ? { ...prev, [day]: { ...prev[day], [field]: val } } : prev);
    setDirty(true);
    setSaved(false);
  }

  async function save() {
    if (!hours) return;
    setSaving(true); setError(null);
    const r = await fetch("/api/admin/set-hours", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hours }),
    });
    const d = await r.json() as { ok?: boolean; error?: string };
    setSaving(false);
    if (d.ok) { setDirty(false); setSaved(true); setTimeout(() => setSaved(false), 3000); }
    else setError(d.error ?? "Unbekannter Fehler");
  }

  return (
    <div className="retro-card p-0 overflow-hidden">
      <div className="px-5 py-4 border-b-[3px] border-bs-ink bg-white flex items-center justify-between gap-4 flex-wrap">
        <h2 className="font-subhead text-lg text-bs-ink uppercase tracking-wide">🕐 Öffnungszeiten</h2>
        <div className="flex items-center gap-3">
          {dirty && (
            <span className="flex items-center gap-1 text-amber-600 font-body text-xs">
              <AlertTriangle size={12} /> Ungespeicherte Änderungen
            </span>
          )}
          {saved && (
            <span className="flex items-center gap-1 text-green-600 font-body text-xs">
              <Check size={12} /> Gespeichert
            </span>
          )}
          <button onClick={save} disabled={!dirty || saving}
            className="flex items-center gap-2 px-4 py-2 border-[3px] border-bs-ink rounded-xl font-subhead text-sm uppercase bg-bs-teal text-white shadow-[3px_3px_0_var(--bs-ink)] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity">
            <Save size={14} />
            {saving ? "Speichern…" : "SPEICHERN"}
          </button>
        </div>
      </div>

      {error && (
        <div className="px-5 py-3 bg-red-50 border-b border-red-200 text-sm text-red-700 font-body">{error}</div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-50 border-b-[2px] border-bs-ink">
              <th className="px-5 py-3 text-left font-subhead text-xs uppercase tracking-wide text-bs-ink-v">Tag</th>
              <th className="px-5 py-3 text-left font-subhead text-xs uppercase tracking-wide text-bs-ink-v">Öffnet</th>
              <th className="px-5 py-3 text-left font-subhead text-xs uppercase tracking-wide text-bs-ink-v">Schließt</th>
              <th className="px-5 py-3 text-left font-subhead text-xs uppercase tracking-wide text-bs-ink-v">Hinweis</th>
            </tr>
          </thead>
          <tbody>
            {hours === null ? (
              <tr><td colSpan={4} className="px-5 py-8 text-center text-bs-ink-v font-body text-sm">Lade…</td></tr>
            ) : (
              DAY_ORDER.map(day => {
                const h = hours[day];
                const crossMidnight = h && h.close < h.open;
                return (
                  <tr key={day} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                    <td className="px-5 py-3 font-subhead text-sm text-bs-ink">{DAY_LABELS[day]}</td>
                    <td className="px-5 py-3">
                      <input type="time" value={h?.open ?? "11:00"}
                        onChange={e => update(day, "open", e.target.value)}
                        className="border-[2px] border-bs-ink rounded-lg px-3 py-1.5 font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-bs-teal" />
                    </td>
                    <td className="px-5 py-3">
                      <input type="time" value={h?.close ?? "23:00"}
                        onChange={e => update(day, "close", e.target.value)}
                        className="border-[2px] border-bs-ink rounded-lg px-3 py-1.5 font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-bs-teal" />
                    </td>
                    <td className="px-5 py-3 text-xs text-bs-ink-v font-body">
                      {crossMidnight ? "⚠️ Schließt nach Mitternacht (Folgetag)" : ""}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <p className="px-5 py-3 text-xs text-bs-ink-v font-body bg-zinc-50 border-t border-zinc-200">
        Änderungen sind sofort aktiv · Bei Server-Neustart werden die Zeiten aus <code>server/storeConfig.json</code> neu geladen
      </p>
    </div>
  );
}

// ── Stat Box ──────────────────────────────────────────────────────────────────

function StatBox({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <div className={`${color} border-[3px] border-bs-ink shadow-[4px_4px_0_var(--bs-ink)] rounded-2xl p-5 flex flex-col gap-1`}>
      <div className="flex items-center gap-2 text-bs-ink-v text-xs font-subhead uppercase tracking-widest">{icon}<span>{label}</span></div>
      <div className="font-subhead text-4xl text-bs-ink leading-none">{value}</div>
      {sub && <div className="font-body text-sm text-bs-ink-v">{sub}</div>}
    </div>
  );
}

// ── Order Row ─────────────────────────────────────────────────────────────────

function OrderRow({ order }: { order: OrderRecord }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <tr className="border-b border-zinc-100 hover:bg-zinc-50 cursor-pointer transition-colors" onClick={() => setOpen(o => !o)}>
        <td className="px-3 py-2.5 font-mono text-xs text-bs-ink-v">{order.id.length > 22 ? `…${order.id.slice(-14)}` : order.id}</td>
        <td className="px-3 py-2.5 text-xs text-bs-ink-v">
          <span className="block">{fmtDate(order.timestamp)}</span>
          <span className="block font-semibold">{fmtTime(order.timestamp)}</span>
        </td>
        <td className="px-3 py-2.5 text-sm font-body text-bs-ink">{order.customer ?? "—"}</td>
        <td className="px-3 py-2.5">
          <span className={`px-2 py-0.5 rounded-full border-[2px] border-bs-ink font-subhead text-[11px] uppercase ${order.status === "PAID" ? "bg-green-200" : "bg-bs-yellow"}`}>
            {order.status === "PAID" ? "PAID" : "BAR/KARTE"}
          </span>
        </td>
        <td className="px-3 py-2.5 text-sm font-semibold text-bs-ink text-right">{fmt(order.total)}</td>
      </tr>
      {open && (
        <tr className="bg-zinc-50 border-b border-zinc-200">
          <td colSpan={5} className="px-4 py-3">
            <div className="space-y-1 text-xs font-body text-bs-ink-v">
              {order.items.map((it, i) => (
                <div key={i} className="flex justify-between max-w-xs">
                  <span>{it.quantity}× {it.name}</span>
                  <span>{fmt(it.price * it.quantity)}</span>
                </div>
              ))}
              {order.phone && <div className="pt-1 text-zinc-400">📞 {order.phone}</div>}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function AdminSettings() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("bs_admin_auth") === "1");
  const [data,   setData]   = useState<Snapshot | null>(null);
  const [filter, setFilter] = useState<"ALL" | "PAID" | "OPEN">("ALL");
  const [search, setSearch] = useState("");
  const [lastPoll, setLastPoll] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function poll() {
    try {
      const r = await fetch("/api/analytics/snapshot");
      setData(await r.json());
      setLastPoll(new Date());
    } catch { /* silent */ }
  }

  useEffect(() => {
    if (!authed) return;
    poll();
    timerRef.current = setInterval(poll, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [authed]);

  if (!authed) return <PinGate onAuth={() => setAuthed(true)} />;

  const filtered = (data?.orders ?? [])
    .filter(o => filter === "ALL" || o.status === filter)
    .filter(o => !search || o.id.toLowerCase().includes(search.toLowerCase()) ||
      (o.customer?.toLowerCase().includes(search.toLowerCase()) ?? false));

  const FILTERS: { label: string; val: typeof filter }[] = [
    { label: "Alle", val: "ALL" },
    { label: "Online bezahlt", val: "PAID" },
    { label: "Bar / Karte", val: "OPEN" },
  ];

  return (
    <div className="min-h-screen bg-bs-sand">
      {/* Header */}
      <div className="bg-bs-ink text-white px-6 py-3 flex items-center justify-between gap-3 flex-wrap">
        <h1 className="font-subhead text-lg uppercase tracking-widest">🍔 Burger Station — Admin</h1>
        <div className="flex items-center gap-3">
          <span className="text-zinc-400 text-xs font-body">
            {lastPoll ? `Aktualisiert ${lastPoll.toLocaleTimeString("de-DE")}` : "Lädt…"}
          </span>
          <button onClick={poll} className="p-1.5 rounded-lg border border-zinc-600 hover:border-white transition-colors" title="Refresh">
            <RefreshCw size={14} />
          </button>
          <button onClick={() => { sessionStorage.removeItem("bs_admin_auth"); setAuthed(false); }}
            className="text-xs text-zinc-400 hover:text-white transition-colors font-body">
            Abmelden
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        {/* ── 1. EMERGENCY STOP — most prominent section ── */}
        <EmergencyStop />

        {/* ── 2. STATS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatBox icon={<Users size={14} />} label="Besucher Live"
            value={data?.activeUsers ?? "—"} sub="aktive Sessions (5 Min.)" color="bg-bs-yellow" />
          <StatBox icon={<ShoppingCart size={14} />} label="Artikel in Warenkörben"
            value={data?.totalCartItems ?? "—"} sub="alle aktiven Nutzer" color="bg-blue-200" />
          <StatBox icon={<TrendingUp size={14} />} label="Bestellungen Heute"
            value={data?.ordersToday ?? "—"}
            sub={data ? `Umsatz: ${fmt(data.revenueToday)}` : undefined} color="bg-green-200" />
        </div>

        {/* ── 3. OPENING HOURS EDITOR ── */}
        <HoursEditor />

        {/* ── 4. ORDER LIST ── */}
        <div className="retro-card p-0 overflow-hidden">
          <div className="px-4 py-4 border-b-[3px] border-bs-ink flex items-center gap-3 flex-wrap bg-white">
            <h2 className="font-subhead text-lg text-bs-ink uppercase tracking-wide flex-1">
              Bestellungen ({data?.orders.length ?? 0})
            </h2>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-bs-ink-v" />
              <input type="text" placeholder="Suche…" value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-2 border-[2px] border-bs-ink rounded-lg font-body text-sm bg-bs-sand focus:outline-none focus:bg-white transition-colors w-44" />
            </div>
          </div>
          <div className="flex gap-2 px-4 py-2 bg-white border-b border-zinc-200 flex-wrap">
            {FILTERS.map(f => (
              <button key={f.val} onClick={() => setFilter(f.val)}
                className={`px-3 py-1.5 border-[2px] border-bs-ink rounded-lg font-subhead text-xs uppercase transition-all ${filter === f.val ? "bg-bs-ink text-white" : "bg-white text-bs-ink hover:bg-bs-sand"}`}>
                {f.label}
              </button>
            ))}
          </div>
          {filtered.length === 0 ? (
            <div className="py-14 text-center text-bs-ink-v font-body text-sm">
              {data === null ? "Daten werden geladen…" : "Keine Bestellungen gefunden."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-zinc-50 border-b-[2px] border-bs-ink">
                    {["Bestellnr.", "Zeit", "Kunde", "Status", "Betrag"].map(h => (
                      <th key={h} className="px-3 py-2.5 font-subhead text-xs uppercase tracking-wide text-bs-ink-v whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(o => <OrderRow key={o.id} order={o} />)}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-bs-ink-v font-body">
          Automatisch alle 5 Sek. · Zeile antippen für Bestelldetails
        </p>
      </div>
    </div>
  );
}
