import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Phone, Clock, Instagram } from "lucide-react";

const PHONE = "tel:+4949199755279";
const PHONE_DISPLAY = "0491 99 755 279";
const MAPS =
  "https://www.google.com/maps/search/?api=1&query=Burger+Station+Bahnhofsring+30+26789+Leer";
const INSTAGRAM = "https://instagram.com/burgerstationleer";

export default function Locations() {
  return (
    <div className="min-h-screen bg-bs-cream text-bs-ink overflow-x-hidden">
      <Header />

      <main className="w-full pb-20">
        {/* Page header */}
        <section className="w-full pt-14 pb-6 px-4 max-w-7xl mx-auto flex justify-center">
          <h1 className="text-display text-6xl md:text-8xl text-center relative inline-block drop-shadow-[4px_4px_0px_#40e0d0]">
            <span className="relative z-10 uppercase text-bs-ink">Find Us.</span>
            <span className="absolute -bottom-2 left-0 w-full h-4 bg-bs-yellow -z-10 border-2 border-bs-ink"></span>
          </h1>
        </section>

        {/* Teal checker divider */}
        <div
          className="w-full h-4 border-y-4 border-bs-ink my-8"
          style={{
            backgroundImage:
              "linear-gradient(45deg, #006a62 25%, transparent 25%, transparent 75%, #006a62 75%, #006a62), linear-gradient(45deg, #006a62 25%, #fefccf 25%, #fefccf 75%, #006a62 75%, #006a62)",
            backgroundSize: "16px 16px",
            backgroundPosition: "0 0, 8px 8px",
          }}
          aria-hidden="true"
        />

        {/* Main layout: map + sidebar */}
        <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Map + Address Card */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            {/* Map embed */}
            <div className="w-full border-4 border-bs-ink shadow-[8px_8px_0_var(--bs-ink)] relative overflow-hidden bg-bs-surface-hi aspect-video md:aspect-[21/9]">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=7.4505%2C53.2275%2C7.4665%2C53.2375&layer=mapnik&marker=53.2325%2C7.4585"
                className="w-full h-full border-0 min-h-[300px]"
                loading="lazy"
                title="Burger Station Leer – Bahnhofsring 30"
              />
              {/* Map label overlay */}
              <div className="absolute top-4 left-4 bg-bs-cream border-[3px] border-bs-ink px-3 py-2 shadow-[3px_3px_0_var(--bs-ink)]">
                <span className="text-label-caps text-bs-teal uppercase tracking-widest flex items-center gap-2 text-sm font-bold">
                  <MapPin size={16} />
                  Leer · Bahnhofsring
                </span>
              </div>
            </div>

            {/* Location detail cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Address card */}
              <div className="bg-white border-[3px] border-bs-ink shadow-[5px_5px_0_var(--bs-ink)] flex flex-col group hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0_var(--bs-ink)] transition-all duration-200">
                <div className="h-40 border-b-[3px] border-bs-ink overflow-hidden bg-bs-peach relative">
                  <img
                    src="/patterns/interior-3.svg"
                    alt="Burger Station Leer Außenansicht und Storefront"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute -top-2 -right-2 bg-bs-yellow border-2 border-bs-ink rounded-full w-11 h-11 flex items-center justify-center rotate-12 shadow-[2px_2px_0_var(--bs-ink)] z-10 text-xl">
                    ★
                  </div>
                </div>
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <h3 className="text-subhead text-2xl text-bs-ink">
                    Leer — Bahnhofsring
                  </h3>
                  <p className="text-bs-ink-v leading-relaxed">
                    Bahnhofsring 30
                    <br />
                    26789 Leer, Niedersachsen
                  </p>
                  <a
                    href={MAPS}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pink btn-sm mt-3 self-start"
                  >
                    Route starten
                  </a>
                </div>
                {/* License plate footer */}
                <div className="w-full bg-bs-primary-f text-bs-ink text-label-caps text-xs py-2 text-center border-t-[3px] border-bs-ink tracking-widest font-bold uppercase shadow-[inset_0_2px_0_rgba(255,255,255,0.3)]">
                  BAHNHOFSRING · LEER
                </div>
              </div>

              {/* Phone / Info card */}
              <div className="bg-white border-[3px] border-bs-ink shadow-[5px_5px_0_var(--bs-ink)] flex flex-col group hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0_var(--bs-ink)] transition-all duration-200">
                <div className="h-40 border-b-[3px] border-bs-ink overflow-hidden bg-bs-primary-c relative">
                  <img
                    src="/patterns/interior-1.svg"
                    alt="Burger Station Leer Innenraum mit Neonwand"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex flex-col gap-4 flex-1">
                  <h3 className="text-subhead text-2xl text-bs-ink">
                    Kontakt
                  </h3>
                  <div className="flex items-center gap-3">
                    <Phone size={20} className="text-bs-teal shrink-0" />
                    <a
                      href={PHONE}
                      className="text-lg font-body font-semibold text-bs-ink hover:text-bs-teal transition"
                    >
                      {PHONE_DISPLAY}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Instagram size={20} className="text-bs-teal shrink-0" />
                    <a
                      href={INSTAGRAM}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body font-semibold text-bs-ink hover:text-bs-teal transition"
                    >
                      @burgerstationleer
                    </a>
                  </div>
                </div>
                <div className="w-full bg-bs-peach text-bs-ink text-label-caps text-xs py-2 text-center border-t-[3px] border-bs-ink tracking-widest font-bold uppercase shadow-[inset_0_2px_0_rgba(255,255,255,0.3)]">
                  WALK-IN · KEIN ONLINE-BESTELL
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar: Hours + CTA */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            {/* Hours card */}
            <div className="bg-white border-4 border-bs-ink p-6 flex flex-col items-center justify-center shadow-[8px_8px_0_var(--bs-ink)]">
              <div className="w-full border-b-2 border-dashed border-bs-ink pb-4 mb-4 text-center">
                <span className="text-label-caps text-bs-teal tracking-[0.2em] text-sm font-bold uppercase">
                  NOW SERVING
                </span>
              </div>
              <div className="text-center flex flex-col gap-3 my-4 w-full">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock size={20} className="text-bs-primary-c" />
                  <h2 className="text-headline text-3xl text-bs-ink uppercase italic">
                    Öffnungszeiten
                  </h2>
                </div>
                <div className="space-y-3 text-base w-full">
                  <div className="flex justify-between items-center border-b border-dashed border-bs-ink/30 pb-2">
                    <span className="font-body font-semibold text-bs-ink">
                      So – Do
                    </span>
                    <span className="font-body font-bold text-bs-ink tracking-wider">
                      11:00 – 23:00
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-body font-semibold text-bs-teal">
                      Fr &amp; Sa
                    </span>
                    <span className="font-body font-bold text-bs-teal tracking-wider">
                      11:00 – 02:00
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full border-t-2 border-dashed border-bs-ink pt-4 mt-4 flex justify-center gap-5 text-2xl">
                <span title="Kaffee & Drinks">☕</span>
                <span title="Burger & Food">🍔</span>
                <span title="Shakes & Eis">🥤</span>
              </div>
            </div>

            {/* CTA buttons */}
            <a
              href={MAPS}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-bs-yellow text-bs-ink border-4 border-bs-ink rounded-full py-5 text-headline text-2xl shadow-[6px_6px_0_var(--bs-ink)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[2px_2px_0_var(--bs-ink)] transition-all flex items-center justify-center gap-3 group font-bold uppercase tracking-wider"
            >
              Route starten
              <MapPin
                size={28}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>

            <a
              href={PHONE}
              className="w-full btn-pink py-5 text-xl rounded-full border-4 border-bs-ink shadow-[6px_6px_0_var(--bs-ink)] flex items-center justify-center gap-3 pulse-pink"
            >
              <Phone size={24} /> {PHONE_DISPLAY}
            </a>

            {/* Walk-in note */}
            <div className="bg-bs-peach border-[3px] border-bs-ink rounded-2xl p-5 text-center shadow-[5px_5px_0_var(--bs-ink)]">
              <p className="text-label-caps text-bs-teal text-sm font-bold uppercase tracking-widest mb-1">
                VOR ORT BESTELLEN
              </p>
              <p className="text-bs-ink-v text-sm leading-relaxed">
                Keine Online-Bestellung. Einfach vorbeikommen, bestellen,
                genießen.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Sticky mobile CTA */}
      <div className="sticky-cta">
        <a
          href={MAPS}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-cyan btn-sm"
        >
          <MapPin size={14} /> Route
        </a>
        <a href={PHONE} className="btn-pink btn-sm pulse-pink">
          <Phone size={14} /> Anrufen
        </a>
        <a
          href={INSTAGRAM}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost-ink btn-sm"
        >
          IG
        </a>
      </div>
      <div className="h-20 md:h-0" aria-hidden="true"></div>
    </div>
  );
}
