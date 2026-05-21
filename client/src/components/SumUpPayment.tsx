import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

// ── SumUp Payment Widget type declarations ────────────────────────────────────
// Source: https://developer.sumup.com/online-payments/checkouts/card-widget
interface SumUpMountConfig {
  /** DOM element id to render the widget in. */
  id?: string;
  checkoutId: string;
  locale?: string;
  country?: string;
  showFooter?: boolean;
  showEmail?: boolean;
  email?: string;
  amount?: string;
  currency?: string;
  /**
   * Required for Google Pay. `merchantId` is issued by Google after domain
   * registration; `merchantName` is shown to the customer in the G-Pay sheet.
   * Leave undefined until Google merchant onboarding is complete.
   */
  googlePay?: { merchantId: string; merchantName: string };
  /**
   * Called when the widget has determined which payment methods are available
   * for this checkout. Useful to hide/show the host page payment section.
   */
  onPaymentMethodsLoad?: (methods: string[]) => void;
  onLoad?: () => void;
  onResponse?: (type: SumUpResponseType, body: unknown) => void;
}

interface SumUpCardInstance {
  unmount: () => void;
  submit:  () => void;
  update:  (config: Partial<SumUpMountConfig>) => void;
}

type SumUpResponseType =
  | "sent"
  | "invalid"
  | "auth-screen"
  | "error"
  | "success"
  | "fail";

declare global {
  interface Window {
    /** SumUp Payment Widget — loaded from gateway.sumup.com/gateway/ecom/card/v2/sdk.js */
    SumUpCard: { mount: (config: SumUpMountConfig) => SumUpCardInstance };
  }
}
// ─────────────────────────────────────────────────────────────────────────────

type PaymentStatus =
  | "loading"
  | "ready"
  | "processing"
  | "success"
  | "error"
  | "fail";

interface SumUpPaymentProps {
  checkoutId: string;
  amount: number;
  /** Customer email — passed to the widget so the email field is pre-filled. */
  email?: string;
}

export default function SumUpPayment({ checkoutId, amount, email }: SumUpPaymentProps) {
  const [, navigate] = useLocation();
  const [status, setStatus] = useState<PaymentStatus>("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [availableMethods, setAvailableMethods] = useState<string[]>([]);
  const instanceRef = useRef<SumUpCardInstance | null>(null);
  const didMount = useRef(false);

  useEffect(() => {
    // Guard against double-mount in React StrictMode
    if (didMount.current) return;
    didMount.current = true;

    // Poll until the SDK script has finished loading
    function initWidget() {
      if (!window.SumUpCard) {
        setTimeout(initWidget, 150);
        return;
      }

      instanceRef.current = window.SumUpCard.mount({
        id: "sumup-card",
        checkoutId,
        locale:        "de-DE",
        country:       "DE",
        showFooter:    false,
        amount:        amount.toFixed(2),
        currency:      "EUR",
        paymentMethods: ["card", "apple-pay", "google-pay"],
        ...(email ? { email } : {}),
        onPaymentMethodsLoad: (methods) => {
          setAvailableMethods(methods);
          console.log("[SumUp] Verfügbare Zahlungsarten:", methods);
        },
        onLoad: () => setStatus("ready"),
        onResponse: (type, body) => {
          console.log("[SumUp] Response:", type, body);
          switch (type) {
            case "sent":
              setStatus("processing");
              break;
            case "success":
              setStatus("success");
              sessionStorage.removeItem("bs_checkout_id");
              // Verify checkout details on the server (logs items + amount).
              fetch(`/api/verify-checkout/${checkoutId}`)
                .then((r) => r.json())
                .then((d) => console.log("[SumUp Verify] Frontend response:", d))
                .catch((err) => console.warn("[SumUp Verify] Fehler:", err));
              // Push PAID order to SumUp KassenPOS Pro (The Good Till).
              try {
                const raw = sessionStorage.getItem("bs_pos_order");
                if (raw) {
                  const posOrder = JSON.parse(raw) as {
                    checkoutRef: string;
                    items: { variant_id?: string; name: string; quantity: number; price: number; tax_rate: number }[];
                    customer: { vorname: string; nachname: string; telefon: string; strasse: string; ort: string };
                  };
                  // Persist the reference so OrderSuccess can display it
                  sessionStorage.setItem("bs_order_ref", posOrder.checkoutRef);
                  sessionStorage.removeItem("bs_pos_order");
                  fetch("/api/create-pos-order", {
                    method:  "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      items:         posOrder.items,
                      paymentStatus: "PAID",
                      paymentType:   "ECOM",
                      orderRef:      posOrder.checkoutRef,
                      customer:      posOrder.customer,
                    }),
                  })
                    .then((r) => r.json())
                    .then((d) => console.log("[POS] ✅ PAID-Bestellung übermittelt:", d))
                    .catch((err) => console.warn("[POS] Nicht erreichbar:", err));
                }
              } catch {
                /* non-fatal — customer navigation continues regardless */
              }
              setTimeout(() => navigate("/order-success"), 1800);
              break;
            case "error":
              setStatus("error");
              setErrorMsg(
                "Zahlung fehlgeschlagen. Bitte prüfe deine Kartendaten und versuche es erneut.",
              );
              break;
            case "fail":
              setStatus("fail");
              setErrorMsg(
                "Zahlung abgebrochen oder Sitzung abgelaufen. Du kannst es erneut versuchen.",
              );
              break;
          }
        },
      });
    }

    initWidget();

    return () => {
      instanceRef.current?.unmount();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutId]);

  return (
    <div className="space-y-3">
      {/* ── Status banners ── */}
      {status === "loading" && (
        <div className="flex items-center justify-center gap-3 py-6 text-bs-ink-v">
          <Loader2 size={20} className="animate-spin text-bs-teal shrink-0" />
          <span className="text-sm">Zahlungsformular wird geladen…</span>
        </div>
      )}

      {status === "processing" && (
        <div className="flex items-center gap-3 px-4 py-3 bg-bs-yellow/20 border-2 border-bs-yellow rounded-xl">
          <Loader2 size={16} className="animate-spin text-bs-ink shrink-0" />
          <span className="text-sm font-body font-semibold text-bs-ink">
            Zahlung wird verarbeitet…
          </span>
        </div>
      )}

      {status === "success" && (
        <div className="flex items-center gap-3 px-4 py-3 bg-bs-primary-c/20 border-[3px] border-bs-teal rounded-xl">
          <CheckCircle size={18} className="text-bs-teal shrink-0" />
          <span className="text-sm font-body font-bold text-bs-teal">
            Zahlung erfolgreich — du wirst weitergeleitet…
          </span>
        </div>
      )}

      {(status === "error" || status === "fail") && (
        <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border-[3px] border-red-400 rounded-xl">
          <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{errorMsg}</p>
        </div>
      )}

      {/* ── SumUp widget mount point ── */}
      <div
        id="sumup-card"
        className="rounded-2xl overflow-hidden bg-white border-[3px] border-bs-ink shadow-[4px_4px_0_var(--bs-ink)]"
        style={{ minHeight: status === "loading" ? 0 : undefined }}
      />

      {/* ── Available methods badge (shown once widget reports back) ── */}
      {availableMethods.length > 0 && (
        <p className="text-[11px] text-bs-ink-v text-center">
          Aktive Zahlungsarten:{" "}
          <span className="font-semibold text-bs-ink">
            {availableMethods.join(", ")}
          </span>
        </p>
      )}

    </div>
  );
}
