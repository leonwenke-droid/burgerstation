import { useMemo } from "react";
import { Link } from "wouter";
import { CheckCircle, MessageCircle, Phone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const WHATSAPP = "https://wa.me/4949199755279";
const PHONE = "tel:+4949199755279";

export default function ThankYou() {
  const orderNum = useMemo(
    () =>
      sessionStorage.getItem("bs_order_num") ??
      `BS-${Math.floor(Math.random() * 9000) + 1000}`,
    [],
  );

  return (
    <div className="min-h-screen bg-bs-cream text-bs-ink overflow-x-hidden flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-16 flex flex-col items-center text-center gap-6">
        <CheckCircle
          size={72}
          className="text-bs-teal"
          strokeWidth={1.5}
          aria-hidden="true"
        />

        <div>
          <span className="badge-neon badge-pink-fill">
            BESTELLUNG EINGEGANGEN
          </span>
          <h1 className="text-display text-4xl sm:text-5xl text-bs-ink mt-4 uppercase drop-shadow-[2px_2px_0px_#006a62] md:drop-shadow-[3px_3px_0px_#006a62]">
            Vielen Dank!
          </h1>
        </div>

        <p className="text-lg text-bs-ink-v leading-relaxed max-w-md">
          Deine Bestellung ist bei uns eingegangen. Wir melden uns gleich per{" "}
          <strong className="text-bs-ink">WhatsApp oder Anruf</strong> zur
          Bestätigung.
        </p>

        <div className="retro-card-cyan p-5 w-full text-left">
          <p className="text-label-caps text-bs-teal mb-1">Bestellnummer</p>
          <p className="text-headline text-3xl text-bs-ink">{orderNum}</p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <a href={PHONE} className="btn-pink">
            <Phone size={16} />
            Anrufen
          </a>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cyan"
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>
          <Link href="/" className="btn-ghost-ink">
            Startseite
          </Link>
        </div>

        <p className="text-xs text-bs-ink-v mt-2">
          Bahnhofsring 30 · 26789 Leer · Mo–So 11–22 Uhr
        </p>
      </main>
      <Footer />
    </div>
  );
}
