import { useEffect, useRef, useState } from "react";
import { Search, RefreshCw, TrendingUp, ShoppingCart, Users } from "lucide-react";

// The admin secret is entered at login and verified server-side. It is never
// baked into the bundle — it only lives in sessionStorage after a successful login.
const SECRET_KEY = "bs_admin_secret";

function getSecret(): string | null {
  return sessionStorage.getItem(SECRET_KEY);
}

/** Auth header for admin-only endpoints (snapshot, store-override). */
function authHeaders(): Record<string, string> {
  const s = getSecret();
  return s ? { Authorization: `Bearer ${s}` } : {};
}

function clearSecret(): void {
  sessionStorage.removeItem(SECRET_KEY);
}

// ── Types ─────────────────────────────────────────────────────────────────────

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
interface StoreStatus {
  isOpen: boolean;
  overrideActive?: boolean;
  reason?: "OVERLOAD" | "CLOSED";
  nextOpen?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt     = (n: number)  => n.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });

// ── PIN Gate ──────────────────────────────────────────────────────────────────

function PinGate({ onAuth }: { onAuth: () => void }) {
  const [input, setInput] = useState("");
  const [shake, setShake] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function fail(msg: string) {
    setErr(msg);
    setShake(true);
    setInput("");
    setTimeout(() => setShake(false), 500);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!input || busy) return;
    setBusy(true);
    setErr("");
    try {
      // Verify the secret against a protected endpoint before granting access.
      const r = await fetch("/api/analytics/snapshot", {
        headers: { Authorization: `Bearer ${input}` },
      });
      if (r.ok) {
        sessionStorage.setItem(SECRET_KEY, input);
        onAuth();
        return;
      }
      if (r.status === 503) fail("Server: ADMIN_SECRET ist nicht gesetzt.");
      else fail("Falscher Zugangscode.");
    } catch {
      fail("Netzwerkfehler — bitte erneut versuchen.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-bs-sand flex items-center justify-center p-4">
      <form onSubmit={submit}
        className={`retro-card p-8 w-full max-w-xs space-y-5 ${shake ? "translate-x-1" : ""} transition-transform`}>
        <h1 className="font-subhead text-2xl text-bs-ink text-center uppercase tracking-wider">🔒 Admin</h1>
        <input type="password" placeholder="Zugangscode eingeben" value={input}
          onChange={e => { setInput(e.target.value); setErr(""); }} autoFocus
          className="w-full border-[3px] border-bs-ink rounded-xl px-4 py-3 font-body text-lg bg-white focus:outline-none text-center tracking-widest" />
        {err && <p className="text-sm text-red-600 font-body text-center">{err}</p>}
        <button type="submit" disabled={busy} className="btn-pink w-full disabled:opacity-50">
          {busy ? "PRÜFE…" : "EINLOGGEN →"}
        </button>
      </form>
    </div>
  );
}

// ── Emergency Stop ─────────────────────────────────────────────────────────────

function EmergencyStop() {
  const [status, setStatus] = useState<StoreStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  async function load() {
    const r = await fetch("/api/store-status");
    setStatus(await r.json());
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 60_000);
    return () => clearInterval(t);
  }, []);

  async function toggle() {
    if (!status) return;
    const wantsClose = !status.overrideActive;
    if (wantsClose && !confirm) { setConfirm(true); return; }
    setConfirm(false);
    setLoading(true);
    await fetch("/api/admin/store-override", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ closed: wantsClose }),
    });
    await load();
    setLoading(false);
  }

  const notausActive = status?.overrideActive === true;
  const hoursClosed  = !status?.isOpen && !notausActive;
  const storeOpen    = status?.isOpen === true && !notausActive;

  // Kunden-sichtbarer Gesamtstatus (Priorität: Notaus > Öffnungszeiten > Offen)
  const boxBg = notausActive ? "bg-red-200" : hoursClosed ? "bg-bs-yellow/50" : "bg-green-200";
  const barBg = notausActive ? "bg-red-400" : hoursClosed ? "bg-bs-yellow" : "bg-green-300";
  const dotBg = notausActive ? "bg-red-700" : hoursClosed ? "bg-amber-600" : "bg-green-600";

  const headline = notausActive
    ? "🛑 NOTAUS — ONLINE-KASSE GESPERRT"
    : hoursClosed
      ? "🕐 STORE GESCHLOSSEN"
      : "✅ STORE OFFEN";

  const customerLabel = notausActive
    ? "Kunden sehen: „Online-Kasse kurzzeitig pausiert“"
    : hoursClosed
      ? "Kunden sehen: „Der Lieferstore hat aktuell geschlossen“"
      : "Kunden sehen: Bestellungen möglich";

  return (
    <div className={`border-[4px] border-bs-ink rounded-2xl shadow-[6px_6px_0_var(--bs-ink)] overflow-hidden ${boxBg}`}>
      <div className={`px-6 py-4 flex items-center justify-between gap-4 flex-wrap ${barBg}`}>
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`w-4 h-4 rounded-full border-2 border-bs-ink shrink-0 ${storeOpen ? "animate-pulse" : ""} ${dotBg}`} />
          <span className="font-subhead text-xl text-bs-ink uppercase tracking-wider">{headline}</span>
        </div>
        <span className="bg-white/80 border-2 border-bs-ink rounded-full px-3 py-1 font-body text-xs text-bs-ink">
          {customerLabel}
        </span>
      </div>

      <div className="px-6 py-5 space-y-4">
        {/* Status-Detail */}
        <p className="font-body text-sm text-bs-ink leading-relaxed">
          {notausActive ? (
            <>
              Ausverkauf oder zu hohes Bestellaufkommen — Online-Bestellungen sind manuell gestoppt.
              {hoursClosed && " (Zusätzlich außerhalb der Öffnungszeiten.)"}
            </>
          ) : hoursClosed ? (
            <>
              Der Store ist laut Öffnungszeiten geschlossen
              {status?.nextOpen ? ` — wieder ab ${status.nextOpen}.` : "."}
              {" "}Zeiten in <code className="text-xs bg-white/60 px-1 rounded">server/storeConfig.json</code> anpassen.
            </>
          ) : (
            <>
              Online-Bestellungen sind aktiv. Bei <strong>Ausverkauf oder Überlastung</strong> den Notaus unten nutzen.
            </>
          )}
        </p>

        {/* Notaus-Bereich — visuell abgetrennt */}
        <div className="border-[3px] border-bs-ink rounded-xl bg-white/60 px-4 py-4 flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <p className="font-subhead text-xs uppercase tracking-widest text-bs-ink-v mb-1">Notaus (Ausverkauf)</p>
            {hoursClosed && !notausActive ? (
              <p className="font-body text-sm text-bs-ink-v">
                Nicht nötig — Store ist bereits geschlossen. Notaus greift während der Öffnungszeiten.
              </p>
            ) : notausActive ? (
              <p className="font-body text-sm text-bs-ink">
                Notaus ist aktiv. Klicke „Wieder öffnen“, um Bestellungen wieder freizugeben.
              </p>
            ) : (
              <p className="font-body text-sm text-bs-ink">
                Stoppt sofort alle Online-Bestellungen — unabhängig vom Warenkorb.
              </p>
            )}
          </div>

          {hoursClosed && !notausActive ? null : confirm ? (
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
              disabled={loading || status === null}
              className={`
                px-6 py-3 border-[3px] border-bs-ink rounded-xl font-subhead text-sm uppercase whitespace-nowrap
                shadow-[4px_4px_0_var(--bs-ink)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_var(--bs-ink)]
                transition-all disabled:opacity-50
                ${notausActive
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-red-600 text-white hover:bg-red-700"}
              `}
            >
              {loading ? "…" : notausActive ? "✅ WIEDER ÖFFNEN" : "🛑 NOTAUS AKTIVIEREN"}
            </button>
          )}
        </div>
      </div>
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
  const [authed, setAuthed] = useState(() => getSecret() !== null);
  const [data,   setData]   = useState<Snapshot | null>(null);
  const [filter, setFilter] = useState<"ALL" | "PAID" | "OPEN">("ALL");
  const [search, setSearch] = useState("");
  const [lastPoll, setLastPoll] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function poll() {
    try {
      const r = await fetch("/api/analytics/snapshot", { headers: authHeaders() });
      if (r.status === 401 || r.status === 503) {
        // Secret revoked/invalid — drop back to the login gate.
        clearSecret();
        setAuthed(false);
        return;
      }
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
          <button onClick={() => { clearSecret(); setAuthed(false); }}
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

        {/* ── 3. ORDER LIST ── */}
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
