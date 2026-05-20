import { useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";

export default function OrderSuccess() {
  const [, navigate] = useLocation();
  const { clearCart } = useCart();

  // Read order reference before clearing — falls back to a random number
  const orderRef = useMemo(
    () =>
      sessionStorage.getItem("bs_order_ref") ??
      sessionStorage.getItem("bs_order_num") ??
      `BS-${Math.floor(Math.random() * 9000) + 1000}`,
    [],
  );

  // Clear the cart and all session keys once page mounts — payment is confirmed.
  useEffect(() => {
    clearCart();
    sessionStorage.removeItem("bs_checkout_id");
    sessionStorage.removeItem("bs_pos_order");
    sessionStorage.removeItem("bs_order_ref");
    sessionStorage.removeItem("bs_order_num");
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
