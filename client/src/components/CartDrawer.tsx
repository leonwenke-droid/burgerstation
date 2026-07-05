import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, Loader2, Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { isCartItemDeliveryReady, isCartItemSumUpRequired, ONLINE_ENABLED_VARIANTS } from "@/data/sumupCatalog";

const fmt = (n: number) => n.toFixed(2).replace(".", ",");

export default function CartDrawer() {
  const {
    items,
    drawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    subtotal,
    itemCount,
  } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [, navigate] = useLocation();
  const reduce = useReducedMotion();

  const sumupRequiredBlockedItems = items.filter((i) => !isCartItemDeliveryReady(i));
  const sumupRequiredBlocked = sumupRequiredBlockedItems.length > 0;

  const onlineOnlyBlockedItems = items.filter(
    (i) =>
      !isCartItemSumUpRequired(i) &&
      (!i.variant_id || !ONLINE_ENABLED_VARIANTS.has(i.variant_id)),
  );
  const allOnlineReady = !sumupRequiredBlocked && onlineOnlyBlockedItems.length === 0;

  async function handleCheckout() {
    setCheckoutLoading(true);
    try {
      // Catalog items: send only variant_id + quantity (price resolved server-side).
      // Non-catalog items: send full details as fallback.
      const orderedItems = items.map((i) =>
        i.variant_id
          ? { variant_id: i.variant_id, sku: i.sku, quantity: i.quantity }
          : {
              name:     i.sumup_name ?? i.name,
              sku:      i.sku,
              quantity: i.quantity,
              price:    i.price,
              category: i.category, // "food" → 7% MwSt. | "drink" → 19% MwSt.
            },
      );
      const res = await fetch("/api/create-sandbox-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedItems, currency: "EUR" }),
      });
      const data = (await res.json()) as { checkoutId?: string; error?: string };
      if (data.checkoutId) {
        sessionStorage.setItem("bs_checkout_id", data.checkoutId);
      } else {
        console.warn("[SumUp] No checkoutId returned:", data.error);
      }
    } catch (err) {
      console.error("[SumUp] Checkout creation failed:", err);
    } finally {
      setCheckoutLoading(false);
      closeDrawer();
      navigate("/bestellen/checkout");
    }
  }

  const spring = reduce
    ? {}
    : {
        initial: { x: "100%" },
        animate: { x: 0 },
        exit: { x: "100%" },
        transition: { type: "spring" as const, damping: 30, stiffness: 300 },
      };

  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2 },
      };

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div
            key="cart-backdrop"
            {...fade}
            className="fixed inset-0 bg-bs-ink/50 z-50"
            onClick={closeDrawer}
          />

          <motion.div
            key="cart-panel"
            {...spring}
            className="fixed inset-y-0 right-0 w-full max-w-[420px] bg-bs-cream border-l-[3px] border-bs-ink z-50 flex flex-col"
            style={{ boxShadow: "-6px 0 0 var(--bs-ink)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b-[3px] border-bs-ink bg-bs-surface-hi shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingCart size={20} className="text-bs-teal" />
                <span className="text-subhead text-lg text-bs-ink">
                  Warenkorb
                </span>
                {itemCount > 0 && (
                  <span className="bg-bs-teal text-white text-xs font-bold px-2 py-0.5 rounded-full border-2 border-bs-ink shadow-[2px_2px_0_var(--bs-ink)] tabular-nums">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={closeDrawer}
                className="w-9 h-9 rounded-full border-2 border-bs-ink bg-white flex items-center justify-center shadow-[2px_2px_0_var(--bs-ink)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                aria-label="Warenkorb schließen"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 py-10 text-center">
                <span className="text-7xl select-none" aria-hidden="true">
                  🛒
                </span>
                <p className="text-subhead text-xl text-bs-ink">
                  Noch nix drin
                </p>
                <p className="text-bs-ink-v text-sm leading-relaxed">
                  Schau auf der Karte vorbei und
                  <br />
                  wähl deinen Liebling.
                </p>
                <Link href="/menu" onClick={closeDrawer} className="btn-cyan mt-2">
                  Zur Karte
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border-[3px] border-bs-ink rounded-xl p-3 shadow-[3px_3px_0_var(--bs-ink)] flex items-center gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-body font-bold text-bs-ink text-sm leading-tight truncate">
                          {item.name}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-bs-teal font-bold text-sm">
                            {fmt(item.price * item.quantity)} €
                          </p>
                          {(!item.variant_id || !ONLINE_ENABLED_VARIANTS.has(item.variant_id)) && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-300 rounded px-1.5 py-0.5 leading-none">
                              <AlertTriangle size={9} />
                              Nur Barzahlung
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-7 h-7 rounded-full border-2 border-bs-ink bg-bs-cream flex items-center justify-center hover:bg-bs-primary-c transition-colors"
                          aria-label="Menge verringern"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-bs-ink tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-7 h-7 rounded-full border-2 border-bs-ink bg-bs-teal flex items-center justify-center text-white hover:bg-bs-ink transition-colors"
                          aria-label="Menge erhöhen"
                        >
                          <Plus size={11} />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-7 h-7 ml-1 rounded-full border-2 border-bs-ink bg-white flex items-center justify-center text-bs-ink/40 hover:text-bs-ink hover:bg-red-50 transition-colors"
                          aria-label={`${item.name} entfernen`}
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t-[3px] border-bs-ink px-5 py-4 space-y-3 bg-bs-surface-hi shrink-0">
                  {/* Subtotal */}
                  <div className="flex justify-between items-center">
                    <span className="font-body font-bold text-bs-ink">
                      Zwischensumme
                    </span>
                    <span className="text-headline text-2xl text-bs-teal">
                      {fmt(subtotal)} €
                    </span>
                  </div>

                  {sumupRequiredBlocked && (
                    <div className="flex items-start gap-2 bg-red-50 border-2 border-red-300 rounded-xl px-3 py-2 text-xs text-red-800">
                      <AlertTriangle size={13} className="shrink-0 mt-0.5" />
                      <span>
                        <strong>Bestellung nicht möglich</strong> für:{" "}
                        {sumupRequiredBlockedItems.map((i) => i.name).join(", ")}.
                      </span>
                    </div>
                  )}

                  {!sumupRequiredBlocked && !allOnlineReady && (
                    <div className="flex items-start gap-2 bg-amber-50 border-2 border-amber-300 rounded-xl px-3 py-2 text-xs text-amber-800">
                      <AlertTriangle size={13} className="shrink-0 mt-0.5" />
                      <span>
                        <strong>Online-Zahlung nicht möglich</strong> für:{" "}
                        {onlineOnlyBlockedItems.map((i) => i.name).join(", ")}.
                        Bar- oder Kartenzahlung bei Lieferung ist weiterhin möglich.
                      </span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={checkoutLoading || sumupRequiredBlocked}
                    className="btn-pink flex items-center justify-center gap-2 w-full disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-[4px_4px_0_var(--bs-ink)]"
                  >
                    {checkoutLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Wird vorbereitet…
                      </>
                    ) : (
                      "Zur Kasse →"
                    )}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
