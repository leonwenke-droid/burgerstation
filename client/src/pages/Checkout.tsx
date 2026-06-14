import { type FormEvent, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Banknote,
  CheckCircle,
  CreditCard,
  Info,
  Loader2,
  MapPin,
  Phone,
  Smartphone,
} from "lucide-react";
import { ONLINE_ENABLED_VARIANTS } from "@/data/sumupCatalog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import SumUpPayment from "@/components/SumUpPayment";

const fmt = (n: number) => n.toFixed(2).replace(".", ",");

const INPUT =
  "w-full border-[3px] border-bs-ink rounded-xl px-4 py-2.5 bg-white text-bs-ink font-body text-base focus:outline-none focus:ring-2 focus:ring-bs-teal transition-shadow placeholder:text-bs-ink/30";
const LABEL =
  "block font-body font-bold text-xs text-bs-ink/60 mb-1 uppercase tracking-wider";

const EMPTY_FORM = {
  vorname:    "",
  nachname:   "",
  email:      "",
  telefon:    "",
  strasse:    "",
  hausnummer: "",
  plz:        "",
  ort:        "",
  anmerkungen: "",
};

export type CheckoutPreviewConfig = {
  form?: Partial<typeof EMPTY_FORM>;
  payment?: "bar" | "karte" | "online";
  agb?: boolean;
};

export default function Checkout({ preview }: { preview?: CheckoutPreviewConfig }) {
  const { items, subtotal, itemCount } = useCart();

  const [form, setForm] = useState({ ...EMPTY_FORM, ...preview?.form });
  const [zeitpunkt, setZeitpunkt] = useState<"sofort" | "geplant">("sofort");
  const [payment, setPayment] = useState<"bar" | "karte" | "online">(preview?.payment ?? "bar");
  const [agb, setAgb] = useState(preview?.agb ?? false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [checkoutId, setCheckoutId] = useState<string | null>(() =>
    sessionStorage.getItem("bs_checkout_id"),
  );

  // ── Store status ──────────────────────────────────────────────────────────
  const [storeStatus, setStoreStatus] = useState<{
    isOpen: boolean;
    reason?: "OVERLOAD" | "CLOSED";
    nextOpen?: string;
  } | null>(null);

  useEffect(() => {
    if (preview) {
      setStoreStatus({ isOpen: true });
      return;
    }
    fetch("/api/store-status")
      .then((r) => r.json())
      .then((s) => setStoreStatus(s))
      .catch(() => setStoreStatus({ isOpen: true })); // fail-open: don't block on network error
  }, [preview]);

  // ── Derived state ─────────────────────────────────────────────────────────

  /** True when every required delivery field has a value. */
  const isFormValid = useMemo(
    () =>
      Boolean(
        form.vorname.trim() &&
          form.nachname.trim() &&
          form.email.trim() &&
          form.telefon.trim() &&
          form.strasse.trim() &&
          form.hausnummer.trim() &&
          form.plz.trim() &&
          form.ort.trim(),
      ),
    [form],
  );

  const uncataloguedItems = items.filter(
    (i) => !i.variant_id || !ONLINE_ENABLED_VARIANTS.has(i.variant_id),
  );
  const onlinePaymentBlocked = uncataloguedItems.length > 0;

  /** The SumUp widget should only mount once form is valid, online is selected, and a checkoutId exists. */
  const showSumUpWidget =
    isFormValid && payment === "online" && checkoutId !== null && !onlinePaymentBlocked;

  const set =
    (f: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((p) => ({ ...p, [f]: e.target.value }));
      // Clear checkout ID if form changes after widget was shown (stale checkout)
      if (f !== "anmerkungen") setCheckoutId(null);
    };

  // ── Helpers ───────────────────────────────────────────────────────────────

  /** Fire-and-forget POS push — never blocks the customer flow. */
  async function sendPosOrder(
    paymentStatus: "OPEN" | "PAID",
    paymentType:   "CASH" | "CARD" | "ECOM",
    ref:           string,
  ) {
    const posItems = items.map((i) => ({
      variant_id: i.variant_id,
      name:       i.name,
      quantity:   i.quantity,
      price:      i.price,
      tax_rate:   7,
    }));
    try {
      const res = await fetch("/api/create-pos-order", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items:         posItems,
          paymentStatus,
          paymentType,
          orderRef:      ref,
          customer: {
            vorname:  form.vorname,
            nachname: form.nachname,
            telefon:  form.telefon,
            strasse:  `${form.strasse} ${form.hausnummer}`,
            ort:      `${form.plz} ${form.ort}`,
          },
        }),
      });
      const data = (await res.json()) as { ok: boolean; mode?: string };
      console.log("[POS]", data.mode === "local-only" ? "📋 lokal geloggt" : "✅ POS-Bestellung erstellt", data);
    } catch (err) {
      console.warn("[POS] Nicht erreichbar:", err);
    }
  }

  function buildOrderedItems() {
    return items.map((i) =>
      i.variant_id
        ? { variant_id: i.variant_id, quantity: i.quantity }
        : {
            name:     i.sumup_name ?? i.name,
            sku:      i.sumup_sku,
            quantity: i.quantity,
            price:    i.price,
            category: i.category, // "food" → 7% MwSt. | "drink" → 19% MwSt.
          },
    );
  }

  // ── Submit handler ────────────────────────────────────────────────────────

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!agb) {
      setFormError("Bitte akzeptiere die AGB, Widerrufsbelehrung und Datenschutzerklärung.");
      return;
    }

    if (!isFormValid) {
      setFormError("Bitte fülle alle Pflichtfelder (Kontakt + Adresse) aus.");
      document.getElementById("checkout-form-top")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const orderedItems = buildOrderedItems();

    console.log("[Burger Station] 🍔 Bestelldaten:", {
      timestamp: new Date().toISOString(),
      customer:  { ...form },
      zeitpunkt,
      payment,
      orderedItems,
      subtotal:  fmt(subtotal),
    });

    // ── Bar / Karte ───────────────────────────────────────────────────────
    if (payment !== "online") {
      const orderNum = `BS-${Math.floor(Math.random() * 9000) + 1000}`;
      sessionStorage.setItem("bs_order_num", orderNum);
      // Push to POS as OPEN (unpaid) → appears on iPad immediately
      void sendPosOrder("OPEN", payment === "bar" ? "CASH" : "CARD", orderNum);
      window.location.href = "/bestellen/danke";
      return;
    }

    // ── Online: guard ─────────────────────────────────────────────────────
    if (onlinePaymentBlocked) {
      setFormError(
        `Online-Zahlung nicht möglich. Noch nicht freigeschaltet: ${uncataloguedItems.map((i) => i.name).join(", ")}.`,
      );
      return;
    }

    // ── Online: widget already loaded ─────────────────────────────────────
    if (checkoutId) {
      document.getElementById("sumup-payment-section")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // ── Online: create checkout → reveals widget ──────────────────────────
    setSubmitting(true);
    try {
      const res = await fetch("/api/create-sandbox-checkout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ orderedItems, currency: "EUR" }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? `Server-Fehler ${res.status}`);
      }
      const data = (await res.json()) as { checkoutId?: string; error?: string };
      if (data.checkoutId) {
        sessionStorage.setItem("bs_checkout_id", data.checkoutId);
        // Save order context so SumUpPayment can push PAID status after success
        sessionStorage.setItem("bs_pos_order", JSON.stringify({
          checkoutRef: data.checkoutReference ?? data.checkoutId,
          items: items.map((i) => ({
            variant_id: i.variant_id,
            name:       i.name,
            quantity:   i.quantity,
            price:      i.price,
            tax_rate:   7,
          })),
          customer: {
            vorname:  form.vorname,
            nachname: form.nachname,
            telefon:  form.telefon,
            strasse:  `${form.strasse} ${form.hausnummer}`,
            ort:      `${form.plz} ${form.ort}`,
          },
        }));
        setCheckoutId(data.checkoutId);
        // Small delay so React renders the widget before we scroll
        setTimeout(
          () =>
            document
              .getElementById("sumup-payment-section")
              ?.scrollIntoView({ behavior: "smooth" }),
          120,
        );
      } else {
        throw new Error(data.error ?? "Keine Checkout-ID erhalten.");
      }
    } catch (err) {
      console.error("[SumUp] Checkout error:", err);
      setFormError(
        err instanceof Error
          ? `Online-Zahlung konnte nicht gestartet werden: ${err.message}. Bitte wähle eine andere Zahlungsmethode oder versuche es erneut.`
          : "Online-Zahlung konnte nicht gestartet werden. Bitte versuche es erneut.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── Submit button label ───────────────────────────────────────────────────

  function submitLabel() {
    if (submitting)
      return (
        <span className="flex items-center justify-center gap-2">
          <Loader2 size={16} className="animate-spin" />
          Zahlung wird vorbereitet…
        </span>
      );
    if (payment === "online") {
      if (checkoutId) return "Zur Zahlung scrollen ↓";
      return "Kreditkarte freischalten →";
    }
    return "Bestellung abschicken →";
  }

  // ── Right-column info box ─────────────────────────────────────────────────

  function RightColumnStatus() {
    // Form incomplete
    if (!isFormValid) {
      return (
        <div className="mt-5 pt-5 border-t-[3px] border-bs-ink/20 flex flex-col items-center text-center gap-3 py-4">
          <div className="w-12 h-12 rounded-full border-[3px] border-bs-ink/20 bg-bs-cream flex items-center justify-center">
            <MapPin size={22} className="text-bs-ink/30" />
          </div>
          <p className="text-sm text-bs-ink-v leading-snug">
            Bitte fülle zuerst deine{" "}
            <strong className="text-bs-ink">Kontaktdaten und Lieferadresse</strong>{" "}
            aus, um die Zahlung freizuschalten.
          </p>
        </div>
      );
    }

    // Form valid, non-online payment
    if (payment !== "online") {
      return (
        <div className="mt-5 pt-5 border-t-[3px] border-bs-ink/20 flex flex-col items-center text-center gap-3 py-4">
          <div className="w-12 h-12 rounded-full border-[3px] border-bs-teal bg-bs-primary-c flex items-center justify-center">
            <CheckCircle size={22} className="text-bs-teal" />
          </div>
          <p className="text-sm text-bs-ink leading-snug font-body font-semibold">
            Alles bereit!
          </p>
          <p className="text-xs text-bs-ink-v">
            Klicke unten auf{" "}
            <strong className="text-bs-ink">„Bestellung abschicken"</strong>{" "}
            — wir melden uns gleich zur Bestätigung.
          </p>
        </div>
      );
    }

    // Online payment blocked
    if (onlinePaymentBlocked) {
      return (
        <div className="mt-5 pt-5 border-t-[3px] border-bs-ink/20 flex flex-col gap-2 py-2">
          <div className="flex items-start gap-2 bg-amber-50 border-2 border-amber-300 rounded-xl px-3 py-2 text-xs text-amber-800">
            <AlertTriangle size={13} className="shrink-0 mt-0.5" />
            <span>
              <strong>Online-Zahlung nicht möglich</strong> für:{" "}
              {uncataloguedItems.map((i) => i.name).join(", ")}.
              Bitte wähle Bar- oder Kartenzahlung.
            </span>
          </div>
        </div>
      );
    }

    // Online payment, widget not yet loaded
    if (!checkoutId) {
      return (
        <div className="mt-5 pt-5 border-t-[3px] border-bs-ink/20 flex flex-col items-center text-center gap-3 py-4">
          <div className="w-12 h-12 rounded-full border-[3px] border-bs-ink bg-white flex items-center justify-center shadow-[3px_3px_0_var(--bs-ink)]">
            <Smartphone size={22} className="text-bs-teal" />
          </div>
          <p className="text-sm text-bs-ink leading-snug font-body font-semibold">
            Online-Zahlung bereit
          </p>
          <p className="text-xs text-bs-ink-v">
            Klicke unten auf{" "}
            <strong className="text-bs-ink">„Kreditkarte freischalten"</strong>{" "}
            um das Zahlungsformular zu laden.
          </p>
        </div>
      );
    }

    // Widget active — rendered below by showSumUpWidget
    return null;
  }

  // ── Empty cart guard ──────────────────────────────────────────────────────

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-bs-cream text-bs-ink overflow-x-hidden flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
          <span className="text-6xl" aria-hidden="true">🛒</span>
          <h1 className="text-headline text-3xl text-bs-ink">Dein Warenkorb ist leer</h1>
          <p className="text-bs-ink-v">Füg zuerst etwas aus der Karte hinzu.</p>
          <a href="/menu" className="btn-pink mt-2">Zur Karte</a>
        </div>
        <Footer />
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-bs-cream text-bs-ink overflow-x-hidden">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-10 pb-24">
        {/* Page header */}
        <div className="mb-8">
          <span className="badge-neon badge-pink-fill">BESTELLUNG</span>
          <h1 className="text-display text-4xl sm:text-5xl text-bs-ink mt-3 uppercase drop-shadow-[2px_2px_0px_#006a62] md:drop-shadow-[3px_3px_0px_#006a62]">
            Kasse
          </h1>
          <p className="text-bs-ink-v mt-2 leading-relaxed">
            Lieferung nach Leer und Umgebung — wir melden uns zur Bestätigung.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div id="checkout-form-top" />
          <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">

            {/* ── Left: Form fields ── */}
            <div className="space-y-5">

              {/* Kontaktdaten */}
              <div className="retro-card p-6 space-y-4">
                <h2 className="text-subhead text-xl text-bs-ink">Kontaktdaten</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={LABEL}>Vorname *</label>
                    <input className={INPUT} type="text" autoComplete="given-name"
                      value={form.vorname} onChange={set("vorname")} />
                  </div>
                  <div>
                    <label className={LABEL}>Nachname *</label>
                    <input className={INPUT} type="text" autoComplete="family-name"
                      value={form.nachname} onChange={set("nachname")} />
                  </div>
                </div>
                <div>
                  <label className={LABEL}>E-Mail *</label>
                  <input className={INPUT} type="email" autoComplete="email"
                    value={form.email} onChange={set("email")} />
                </div>
                <div>
                  <label className={LABEL}>Telefon *</label>
                  <input className={INPUT} type="tel" autoComplete="tel" placeholder="+49 …"
                    value={form.telefon} onChange={set("telefon")} />
                </div>
              </div>

              {/* Lieferadresse */}
              <div className="retro-card p-6 space-y-4">
                <h2 className="text-subhead text-xl text-bs-ink flex items-center gap-2">
                  <MapPin size={18} className="text-bs-teal shrink-0" />
                  Lieferadresse
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className={LABEL}>Straße *</label>
                    <input className={INPUT} type="text" autoComplete="street-address"
                      value={form.strasse} onChange={set("strasse")} />
                  </div>
                  <div>
                    <label className={LABEL}>Nr. *</label>
                    <input className={INPUT} type="text"
                      value={form.hausnummer} onChange={set("hausnummer")} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={LABEL}>PLZ *</label>
                    <input className={INPUT} type="text" inputMode="numeric" pattern="[0-9]{5}"
                      autoComplete="postal-code" value={form.plz} onChange={set("plz")} />
                  </div>
                  <div className="col-span-2">
                    <label className={LABEL}>Ort *</label>
                    <input className={INPUT} type="text" autoComplete="address-level2"
                      value={form.ort} onChange={set("ort")} />
                  </div>
                </div>
              </div>

              {/* Bestelloptionen */}
              <div className="retro-card p-6 space-y-5">
                <h2 className="text-subhead text-xl text-bs-ink">Bestelloptionen</h2>

                {/* Zeitpunkt */}
                <div>
                  <p className={LABEL + " mb-2"}>Bestellzeitpunkt</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {(["sofort", "geplant"] as const).map((v) => (
                      <label key={v}
                        className={`flex items-center gap-2.5 cursor-pointer flex-1 px-4 py-3 rounded-xl border-[3px] border-bs-ink transition-colors ${
                          zeitpunkt === v ? "bg-bs-primary-c" : "bg-white hover:bg-bs-cream"
                        }`}>
                        <input type="radio" name="zeitpunkt" value={v}
                          checked={zeitpunkt === v} onChange={() => setZeitpunkt(v)}
                          className="accent-bs-teal" />
                        <span className="font-body font-semibold text-sm text-bs-ink">
                          {v === "sofort" ? "So bald wie möglich" : "Geplant für später"}
                        </span>
                      </label>
                    ))}
                  </div>
                  {zeitpunkt === "geplant" && (
                    <div className="mt-2">
                      <input type="datetime-local" disabled
                        className={INPUT + " opacity-50 cursor-not-allowed"} />
                      <p className="text-xs text-bs-ink-v mt-1">Demo: Zeitwahl noch nicht aktiv.</p>
                    </div>
                  )}
                </div>

                {/* Bezahlart */}
                <div>
                  <p className={LABEL + " mb-2"}>Bezahlart</p>
                  <div className="flex flex-col gap-2">
                    {(
                      [
                        { v: "bar",    label: "Bar bei Lieferung",  icon: <Banknote size={16} /> },
                        { v: "karte",  label: "Karte bei Lieferung", icon: <CreditCard size={16} /> },
                        {
                          v: "online",
                          label: "Online-Zahlung",
                          icon: <Smartphone size={16} />,
                          hint: onlinePaymentBlocked
                            ? `Nicht verfügbar für: ${uncataloguedItems.map((i) => i.name).join(", ")}`
                            : "Karte, PayPal, Apple Pay & Google Pay",
                          disabled: onlinePaymentBlocked,
                        },
                      ] as { v: string; label: string; icon: React.ReactNode; disabled?: boolean; hint?: string }[]
                    ).map(({ v, label, icon, disabled, hint }) => (
                      <label key={v}
                        className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-[3px] border-bs-ink transition-colors ${
                          disabled
                            ? "opacity-50 cursor-not-allowed bg-white"
                            : `cursor-pointer ${payment === v ? "bg-bs-primary-c" : "bg-white hover:bg-bs-cream"}`
                        }`}>
                        <input type="radio" name="payment" value={v}
                          checked={payment === v}
                          onChange={() => !disabled && setPayment(v as typeof payment)}
                          disabled={disabled}
                          className="accent-bs-teal" />
                        <span className="text-bs-teal shrink-0">{icon}</span>
                        <span className="font-body font-semibold text-sm text-bs-ink flex-1">
                          {label}
                        </span>
                        {hint && (
                          <span title={hint} className="text-bs-ink-v cursor-help shrink-0">
                            <Info size={14} />
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Anmerkungen */}
              <div className="retro-card p-6">
                <label className={LABEL}>Anmerkungen zur Bestellung</label>
                <textarea className={INPUT + " resize-none mt-1"} rows={3}
                  placeholder="Allergien, besondere Wünsche, Klingelcode …"
                  value={form.anmerkungen}
                  onChange={(e) => setForm((p) => ({ ...p, anmerkungen: e.target.value }))} />
              </div>

              {/* AGB + Submit */}
              <div className="space-y-4">
                {formError && (
                  <div role="alert"
                    className="flex items-start gap-3 bg-red-50 border-[3px] border-red-400 rounded-xl px-4 py-3 text-sm text-red-700 font-body">
                    <span className="shrink-0 mt-0.5">⚠️</span>
                    <span>{formError}</span>
                  </div>
                )}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={agb}
                    onChange={(e) => setAgb(e.target.checked)}
                    className="mt-0.5 w-5 h-5 accent-bs-teal shrink-0" />
                  <span className="text-sm text-bs-ink-v leading-relaxed">
                    Ich habe die{" "}
                    <a href="/agb" target="_blank" rel="noopener noreferrer" className="text-bs-teal underline hover:text-bs-ink transition-colors">AGB</a>
                    {", die "}
                    <a href="/widerrufsbelehrung" target="_blank" rel="noopener noreferrer" className="text-bs-teal underline hover:text-bs-ink transition-colors">Widerrufsbelehrung</a>
                    {" "}und die{" "}
                    <a href="/datenschutz" target="_blank" rel="noopener noreferrer" className="text-bs-teal underline hover:text-bs-ink transition-colors">Datenschutzerklärung</a>
                    {" "}zur Kenntnis genommen und akzeptiere diese. *
                  </span>
                </label>

                {/* ── Store closed / overload banner ── */}
                {storeStatus && !storeStatus.isOpen && (
                  <div className="border-[3px] border-bs-ink bg-bs-yellow shadow-[4px_4px_0_var(--bs-ink)] rounded-xl px-4 py-3 space-y-1">
                    <p className="font-subhead font-bold text-bs-ink text-sm uppercase tracking-wide">
                      {storeStatus.reason === "OVERLOAD"
                        ? "⏸ Online-Kasse pausiert"
                        : "🕐 Aktuell geschlossen"}
                    </p>
                    <p className="text-sm text-bs-ink font-body">
                      {storeStatus.reason === "OVERLOAD"
                        ? "Wegen sehr hohem Bestellaufkommen ist die Online-Kasse kurzzeitig pausiert. Bitte versuch es später nochmal."
                        : `Der Lieferstore hat aktuell geschlossen. Wir sind ab ${storeStatus.nextOpen ?? "11:00 Uhr"} wieder für dich da!`}
                    </p>
                  </div>
                )}

                <button type="submit"
                  disabled={!agb || submitting || (storeStatus !== null && !storeStatus.isOpen)}
                  className="btn-pink w-full text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-[4px_4px_0_var(--bs-ink)]">
                  {submitLabel()}
                </button>

                <p className="text-xs text-bs-ink-v text-center">
                  * Pflichtfelder · Demo-Modus · Keine echte Zahlung
                </p>
              </div>
            </div>

            {/* ── Right: Order summary + payment state ── */}
            <div className="retro-card p-6 lg:sticky lg:top-24">
              <h2 className="text-subhead text-xl text-bs-ink mb-4">Bestellübersicht</h2>

              {/* Items */}
              <div className="space-y-2.5 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-2">
                    <span className="text-sm text-bs-ink font-body leading-snug">
                      <span className="font-bold">{item.quantity}×</span> {item.name}
                    </span>
                    <span className="text-bs-teal font-bold text-sm whitespace-nowrap tabular-nums">
                      {fmt(item.price * item.quantity)} €
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t-2 border-dashed border-bs-ink/20 pt-3 space-y-2">
                <div className="flex justify-between text-sm text-bs-ink-v">
                  <span>Lieferung</span>
                  <span>Auf Anfrage</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body font-bold text-bs-ink">Gesamt</span>
                  <span className="text-headline text-2xl text-bs-teal tabular-nums">
                    {fmt(subtotal)} €
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="mt-4 bg-bs-yellow/30 border-2 border-bs-yellow rounded-xl p-3">
                <p className="text-xs text-bs-ink-v leading-relaxed">
                  🛵 Wir liefern in Leer und Umgebung. Nach der Bestellung melden wir uns per{" "}
                  <strong className="text-bs-ink">WhatsApp oder Anruf</strong> zur Bestätigung.
                </p>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-bs-ink-v">
                <Phone size={12} className="shrink-0" />
                <span>+49 491 997 55279</span>
              </div>

              {/* ── Payment state panel ── */}
              {showSumUpWidget ? (
                <div id="sumup-payment-section" className="mt-6 pt-5 border-t-[3px] border-bs-ink w-full">
                  <h3 className="text-subhead text-lg text-bs-ink mb-3">Bezahlung</h3>
                  <p className="text-xs text-bs-ink-v mb-4 leading-relaxed">
                    Wähle deine Zahlungsart — PayPal, Apple Pay, Google Pay oder Karte.
                  </p>
                  <SumUpPayment checkoutId={checkoutId!} amount={subtotal} email={form.email || undefined} />
                </div>
              ) : (
                <RightColumnStatus />
              )}
            </div>

          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
