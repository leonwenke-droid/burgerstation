import { useEffect, useRef, useState } from "react";
import { Search, RefreshCw, TrendingUp, ShoppingCart, Users, Power } from "lucide-react";

// Admin PIN — set VITE_ADMIN_PIN in .env.local to override
const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN ?? "burgerstation";

interface OrderItem  { name: string; quantity: number; price: number }
interface OrderRecord {
  id:        string;
  timestamp: string;
  total:     number;
  status:    "PAID" | "OPEN";
  items:     OrderItem[];
  customer?: string;
  phone?:    string;
}
interface Snapshot {
  activeUsers:    number;
  totalCartItems: number;
  orders:         OrderRecord[];
  ordersToday:    number;
  revenueToday:   number;
}
interface StoreStatus {
  isOpen:        boolean;
  overrideActive: boolean | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(amount: number) {
  return amount.toLocaleString("de-DE", { style: "currency", currency: "EUR" });
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
}

// ── PIN Gate ──────────────────────────────────────────────────────────────────

function PinGate({ onAuth }: { onAuth: () => void }) {
  const [input, setInput] = useState("");
  const [shake, setShake]   = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (input === ADMIN_PIN) {
      sessionStorage.setItem("bs_admin_auth", "1");
      onAuth();
    } else {
      setShake(true);
      setInput("");
      setTimeout(() => setShake(false), 600);
    }
  }

  return (
    <div className="min-h-screen bg-bs-sand flex items-center justify-center p-4">
      <form
        onSubmit={submit}
        className={`retro-card p-8 w-full max-w-xs space-y-5 ${shake ? "animate-[wiggle_0.15s_3]" : ""}`}
      >
        <h1 className="font-subhead text-2xl text-bs-ink text-center uppercase tracking-wider">
          🔒 Admin-Zugang
        </h1>
        <input
          type="password"
          placeholder="PIN eingeben"
          value={input}
          onChange={e => setInput(e.target.value)}
          autoFocus
          className="w-full border-[3px] border-bs-ink rounded-xl px-4 py-3 font-body text-lg bg-white focus:outline-none focus:ring-0 text-center tracking-widest"
        />
        <button type="submit" className="btn-pink w-full">
          EINLOGGEN →
        </button>
      </form>
    </div>
  );
}

// ── Stat Box ──────────────────────────────────────────────────────────────────

function StatBox({
  icon, label, value, sub, color,
}: { icon: React.ReactNode; label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className={`${color} border-[3px] border-bs-ink shadow-[4px_4px_0_var(--bs-ink)] rounded-2xl p-5 flex flex-col gap-1`}>
      <div className="flex items-center gap-2 text-bs-ink-v text-xs font-subhead uppercase tracking-widest">
        {icon}
        <span>{label}</span>
      </div>
      <div className="font-subhead text-4xl text-bs-ink leading-none">{value}</div>
      {sub && <div className="font-body text-sm text-bs-ink-v">{sub}</div>}
    </div>
  );
}

// ── Store Toggle ──────────────────────────────────────────────────────────────

function StoreToggle() {
  const [status, setStatus] = useState<StoreStatus | null>(null);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    const r = await fetch("/api/store-status");
    setStatus(await r.json());
  }

  useEffect(() => { refresh(); }, []);

  async function toggle() {
    if (!status) return;
    setLoading(true);
    const shouldClose = status.isOpen;
    await fetch("/api/admin/store-override", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ closed: shouldClose }),
    });
    await refresh();
    setLoading(false);
  }

  if (!status) return null;

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-[2px] border-bs-ink font-subhead text-sm uppercase ${status.isOpen ? "bg-green-200" : "bg-red-200"}`}>
        <span className={`w-2 h-2 rounded-full ${status.isOpen ? "bg-green-600" : "bg-red-600"}`} />
        {status.isOpen ? "STORE OFFEN" : "STORE GESCHLOSSEN"}
        {status.overrideActive === true && <span className="text-[10px] opacity-60">(Override)</span>}
      </div>
      <button
        onClick={toggle}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 border-[3px] border-bs-ink rounded-xl font-subhead text-sm uppercase shadow-[3px_3px_0_var(--bs-ink)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 ${status.isOpen ? "bg-red-100 hover:bg-red-200" : "bg-green-100 hover:bg-green-200"}`}
      >
        <Power size={14} />
        {status.isOpen ? "JETZT SCHLIESSEN" : "WIEDER ÖFFNEN"}
      </button>
    </div>
  );
}

// ── Order Row ─────────────────────────────────────────────────────────────────

function OrderRow({ order }: { order: OrderRecord }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <tr
        className="border-b border-zinc-200 hover:bg-zinc-50 cursor-pointer transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <td className="px-3 py-2.5 font-mono text-xs text-bs-ink-v whitespace-nowrap">
          {order.id.length > 20 ? `…${order.id.slice(-12)}` : order.id}
        </td>
        <td className="px-3 py-2.5 text-xs text-bs-ink-v whitespace-nowrap">
          <span className="block">{fmtDate(order.timestamp)}</span>
          <span className="block font-semibold">{fmtTime(order.timestamp)}</span>
        </td>
        <td className="px-3 py-2.5 text-sm font-body text-bs-ink">
          {order.customer ?? "—"}
        </td>
        <td className="px-3 py-2.5">
          <span className={`inline-block px-2 py-0.5 rounded-full border-[2px] border-bs-ink font-subhead text-[11px] uppercase ${order.status === "PAID" ? "bg-green-200" : "bg-bs-yellow"}`}>
            {order.status === "PAID" ? "PAID" : "BAR/KARTE"}
          </span>
        </td>
        <td className="px-3 py-2.5 text-sm font-semibold text-bs-ink text-right">
          {fmt(order.total)}
        </td>
      </tr>
      {expanded && (
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

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function AdminSettings() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem("bs_admin_auth") === "1",
  );
  const [data,   setData]   = useState<Snapshot | null>(null);
  const [filter, setFilter] = useState<"ALL" | "PAID" | "OPEN">("ALL");
  const [search, setSearch] = useState("");
  const [lastPoll, setLastPoll] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    intervalRef.current = setInterval(poll, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [authed]);

  if (!authed) return <PinGate onAuth={() => setAuthed(true)} />;

  const filteredOrders = (data?.orders ?? [])
    .filter(o => filter === "ALL" || o.status === filter)
    .filter(o => !search || o.id.toLowerCase().includes(search.toLowerCase()) ||
      (o.customer?.toLowerCase().includes(search.toLowerCase()) ?? false));

  const FILTER_BTNS: { label: string; value: typeof filter }[] = [
    { label: "ALLE",              value: "ALL" },
    { label: "ONLINE BEZAHLT",    value: "PAID" },
    { label: "BAR / KARTE",       value: "OPEN" },
  ];

  return (
    <div className="min-h-screen bg-bs-sand">
      {/* Header */}
      <div className="bg-bs-ink text-white px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-subhead text-xl uppercase tracking-widest">🍔 Burger Station — Admin</h1>
          <p className="text-zinc-400 text-xs font-body mt-0.5">
            Live-Zentrale · Leer
            {lastPoll && ` · Aktualisiert ${lastPoll.toLocaleTimeString("de-DE")}`}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <StoreToggle />
          <button
            onClick={poll}
            className="p-2 rounded-xl border-2 border-zinc-600 hover:border-white transition-colors"
            title="Manuell aktualisieren"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={() => { sessionStorage.removeItem("bs_admin_auth"); setAuthed(false); }}
            className="text-xs text-zinc-400 hover:text-white transition-colors font-body"
          >
            Abmelden
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* Stat Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatBox
            icon={<Users size={14} />}
            label="Besucher Live"
            value={data?.activeUsers ?? "—"}
            sub="aktive API-Sessions (5 Min.)"
            color="bg-bs-yellow"
          />
          <StatBox
            icon={<ShoppingCart size={14} />}
            label="Artikel in Warenkörben"
            value={data?.totalCartItems ?? "—"}
            sub="über alle aktiven Sessions"
            color="bg-blue-200"
          />
          <StatBox
            icon={<TrendingUp size={14} />}
            label="Bestellungen Heute"
            value={data?.ordersToday ?? "—"}
            sub={data ? `Umsatz: ${fmt(data.revenueToday)}` : undefined}
            color="bg-green-200"
          />
        </div>

        {/* Order List */}
        <div className="retro-card p-0 overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b-[3px] border-bs-ink flex items-center gap-3 flex-wrap bg-white">
            <h2 className="font-subhead text-lg text-bs-ink uppercase tracking-wide flex-1">
              Bestellungen ({data?.orders.length ?? 0})
            </h2>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-bs-ink-v" />
              <input
                type="text"
                placeholder="Bestellnr. oder Kunde suchen…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-2 border-[2px] border-bs-ink rounded-lg font-body text-sm bg-bs-sand focus:outline-none focus:bg-white transition-colors w-52"
              />
            </div>
          </div>

          {/* Filter buttons */}
          <div className="flex gap-2 px-4 pt-3 pb-2 bg-white border-b border-zinc-200 flex-wrap">
            {FILTER_BTNS.map(btn => (
              <button
                key={btn.value}
                onClick={() => setFilter(btn.value)}
                className={`px-3 py-1.5 border-[2px] border-bs-ink rounded-lg font-subhead text-xs uppercase transition-all ${
                  filter === btn.value
                    ? "bg-bs-ink text-white shadow-[2px_2px_0_var(--bs-sand)]"
                    : "bg-white text-bs-ink hover:bg-bs-sand"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Table */}
          {filteredOrders.length === 0 ? (
            <div className="py-16 text-center text-bs-ink-v font-body text-sm">
              {data === null
                ? "Daten werden geladen…"
                : "Keine Bestellungen gefunden."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-zinc-50 border-b-[2px] border-bs-ink">
                    {["Bestellnr.", "Zeit", "Kunde", "Status", "Betrag"].map(h => (
                      <th key={h} className="px-3 py-2.5 font-subhead text-xs uppercase tracking-wide text-bs-ink-v whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <OrderRow key={order.id} order={order} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-bs-ink-v font-body">
          Daten werden automatisch alle 5 Sekunden aktualisiert · Klick auf eine Bestellung für Details
        </p>
      </div>
    </div>
  );
}
