import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

// ── SumUp Payment Widget — card + dashboard-enabled APMs (PayPal, Apple Pay, …) ─
// Docs: https://developer.sumup.com/online-payments/checkouts/card-widget/
const SUMUP_WIDGET_ID = "sumup-card";

interface SumUpMountConfig {
  id?: string;
  checkoutId: string;
  locale?: string;
  country?: string;
  showFooter?: boolean;
  showEmail?: boolean;
  email?: string;
  amount?: string;
  currency?: string;
  googlePay?: { merchantId: string; merchantName: string };
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
    SumUpCard: { mount: (config: SumUpMountConfig) => SumUpCardInstance };
  }
}

const GOOGLE_PAY_MERCHANT_ID = import.meta.env.VITE_GOOGLE_PAY_MERCHANT_ID as string | undefined;
const GOOGLE_PAY_MERCHANT_NAME = "Burger Station Leer";

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
  email?: string;
}

export default function SumUpPayment({ checkoutId, amount, email }: SumUpPaymentProps) {
  const [, navigate] = useLocation();
  const [status, setStatus] = useState<PaymentStatus>("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<SumUpCardInstance | null>(null);

  const handleSuccess = useCallback(() => {
    setStatus("success");
    sessionStorage.removeItem("bs_checkout_id");
    fetch(`/api/verify-checkout/${checkoutId}`)
      .then((r) => r.json())
      .then((d) => console.log("[SumUp Verify]", d))
      .catch(() => {});

    try {
      const raw = sessionStorage.getItem("bs_pos_order");
      if (raw) {
        const posOrder = JSON.parse(raw) as {
          checkoutRef: string;
          items: { variant_id?: string; name: string; quantity: number; price: number; tax_rate: number }[];
          customer: { vorname: string; nachname: string; telefon: string; strasse: string; ort: string };
        };
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
      /* non-fatal */
    }

    setTimeout(() => navigate("/order-success"), 1800);
  }, [checkoutId, navigate]);

  useEffect(() => {
    let cancelled = false;

    function mountWidget() {
      if (cancelled || !window.SumUpCard || !containerRef.current) {
        if (!cancelled) setTimeout(mountWidget, 150);
        return;
      }

      instanceRef.current?.unmount();
      setStatus("loading");

      // No onPaymentMethodsLoad filter — widget renders all dashboard-active methods.
      instanceRef.current = window.SumUpCard.mount({
        id: SUMUP_WIDGET_ID,
        checkoutId,
        locale:     "de-DE",
        country:    "DE",
        showFooter: false,
        showAmount: true,
        currency:   "EUR",
        ...(email ? { email } : {}),
        ...(GOOGLE_PAY_MERCHANT_ID
          ? {
              googlePay: {
                merchantId:   GOOGLE_PAY_MERCHANT_ID,
                merchantName: GOOGLE_PAY_MERCHANT_NAME,
              },
            }
          : {}),
        onLoad: () => {
          if (!cancelled) setStatus("ready");
        },
        onResponse: (type, body) => {
          console.log("[SumUp] Response:", type, body);
          switch (type) {
            case "sent":
              setStatus("processing");
              break;
            case "success":
              handleSuccess();
              break;
            case "error":
              setStatus("error");
              setErrorMsg(
                "Zahlung fehlgeschlagen. Bitte prüfe deine Zahlungsdaten und versuche es erneut.",
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

    mountWidget();

    return () => {
      cancelled = true;
      instanceRef.current?.unmount();
      instanceRef.current = null;
    };
  }, [checkoutId, amount, email, handleSuccess]);

  return (
    <div className="space-y-3">
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

      <div
        ref={containerRef}
        id={SUMUP_WIDGET_ID}
        className="w-full min-h-[450px] rounded-2xl bg-transparent border-[3px] border-bs-ink shadow-[4px_4px_0_var(--bs-ink)] sumup-payment-container"
      />
    </div>
  );
}
