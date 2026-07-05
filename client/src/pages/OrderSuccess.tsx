import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";

interface StoredPosOrder {
  checkoutRef: string;
  items: { variant_id?: string; sku: string; name: string; quantity: number; price: number; tax_rate: number }[];
  customer: { vorname: string; nachname: string; telefon: string; strasse: string; ort: string };
}

export default function OrderSuccess() {
  const [, navigate] = useLocation();
  const { clearCart } = useCart();

  // Order reference shown on the page. Starts from any stored value, then gets
  // upgraded to the real checkout reference once an APM return is finalized.
  const [orderRef, setOrderRef] = useState<string>(
    () =>
      sessionStorage.getItem("bs_order_ref") ??
      sessionStorage.getItem("bs_order_num") ??
      `BS-${Math.floor(Math.random() * 9000) + 1000}`,
  );

  // Guard against double execution (React StrictMode / re-renders) so we never
  // push the POS order twice.
  const finalizedRef = useRef(false);

  useEffect(() => {
    if (finalizedRef.current) return;
    finalizedRef.current = true;

    // Capture session state BEFORE anything is cleared.
    const rawOrder = sessionStorage.getItem("bs_pos_order");
    const params = new URLSearchParams(window.location.search);
    const checkoutId =
      params.get("checkout_id") ??
      params.get("checkoutId") ??
      params.get("id") ??
      sessionStorage.getItem("bs_checkout_id");

    async function finalize() {
      // ── APM redirect return ────────────────────────────────────────────────
      // Card payments finish inside the widget (SumUpPayment.handleSuccess) which
      // already pushed the PAID POS order and removed bs_pos_order. Redirect-based
      // APMs (PayPal, Apple Pay, Google Pay) come back here via a full page load,
      // so that handler never ran and bs_pos_order is still present. Verify the
      // checkout is actually PAID server-side, then push the POS order.
      if (rawOrder && checkoutId) {
        try {
          const res = await fetch(`/api/verify-checkout/${checkoutId}`);
          if (res.ok) {
            const data = (await res.json()) as { status?: string };
            const status = String(data.status ?? "").toUpperCase();

            if (status === "PAID") {
              const posOrder = JSON.parse(rawOrder) as StoredPosOrder;
              setOrderRef(posOrder.checkoutRef);
              sessionStorage.setItem("bs_order_ref", posOrder.checkoutRef);
              // Consume immediately so a refresh can't push a second time.
              sessionStorage.removeItem("bs_pos_order");

              await fetch("/api/create-pos-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  items: posOrder.items,
                  paymentStatus: "PAID",
                  paymentType: "ECOM",
                  orderRef: posOrder.checkoutRef,
                  customer: posOrder.customer,
                }),
              })
                .then((r) => r.json())
                .then((d) => console.log("[POS] ✅ PAID-Bestellung (APM-Redirect) übermittelt:", d))
                .catch((err) => console.warn("[POS] Nicht erreichbar:", err));
            } else {
              console.warn(`[SumUp] Checkout ${checkoutId} nicht PAID (status: ${status}) — kein POS-Push.`);
            }
          }
        } catch (err) {
          console.warn("[OrderSuccess] APM-Finalisierung fehlgeschlagen:", err);
        }
      }

      // Payment confirmed (or already handled by the widget) — clear cart + session.
      clearCart();
      sessionStorage.removeItem("bs_checkout_id");
      sessionStorage.removeItem("bs_pos_order");
      sessionStorage.removeItem("bs_order_num");
    }

    void finalize();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-bs-cream text-bs-ink overflow-x-hidden flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg retro-card p-8 flex flex-col items-center text-center gap-6">
          <CheckCircle
            size={72}
            className="text-bs-teal"
            strokeWidth={1.5}
            aria-hidden="true"
          />

          <div className="flex flex-col items-center gap-3">
            <span className="badge-neon badge-pink-fill">ONLINE-ZAHLUNG</span>

            {/* Order reference badge */}
            <div className="bg-white border-[3px] border-bs-ink rounded-xl px-4 py-2 shadow-[3px_3px_0_var(--bs-ink)]">
              <p className="text-label-caps text-bs-teal text-xs mb-0.5">
                Bestellnummer
              </p>
              <p className="text-headline text-lg text-bs-ink leading-tight">
                {orderRef}
              </p>
            </div>

            <h1 className="text-display text-4xl sm:text-5xl text-bs-ink uppercase drop-shadow-[2px_2px_0px_#006a62] md:drop-shadow-[3px_3px_0px_#006a62]">
              Bestellung<br />eingegangen!
            </h1>
          </div>

          <p className="text-base text-bs-ink-v leading-relaxed max-w-sm">
            Vielen Dank für deine Bestellung bei der{" "}
            <strong className="text-bs-ink">Burgerstation Leer!</strong> Dein
            Burger wird frisch zubereitet und ist bald auf dem Weg zu dir.
          </p>

          <div className="w-full bg-bs-yellow/30 border-2 border-bs-yellow rounded-xl p-4 text-sm text-bs-ink-v text-left leading-relaxed">
            🛵 Wir melden uns per{" "}
            <strong className="text-bs-ink">WhatsApp oder Anruf</strong> sobald
            deine Bestellung unterwegs ist.
          </div>

          <button
            onClick={() => navigate("/")}
            className="btn-pink w-full text-base mt-2"
          >
            ZURÜCK ZUM MENÜ
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
