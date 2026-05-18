import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Instagram } from "lucide-react";
import { Link } from "wouter";

const INSTAGRAM = "https://instagram.com/burgerstationleer";

export default function About() {
  return (
    <div className="min-h-screen bg-bs-cream text-bs-ink overflow-x-hidden">
      <Header />

      <main>
        {/* ── Scrapbook Hero ── */}
        <section className="max-w-7xl mx-auto px-4 pt-16 pb-12 relative overflow-hidden">
          {/* Floating sticker */}
          <div className="absolute top-8 right-1/4 rotate-12 bg-bs-yellow text-bs-ink text-subhead px-6 py-2 border-3 border-bs-ink shadow-[4px_4px_0_var(--bs-ink)] rounded-full z-20 hidden md:block" style={{ borderWidth: "3px" }}>
            Est. 2026
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div className="relative z-10 flex flex-col gap-6">
              <div>
                <span className="badge-neon badge-pink-fill">UNSERE STORY</span>
              </div>
              <h1 className="text-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-bs-ink leading-tight">
                Leer bekommt seinen{" "}
                <span className="bg-bs-pink text-white px-2 relative inline-block border-b-4 border-bs-ink">
                  Diner.
                </span>
              </h1>
              <p className="text-lg text-bs-ink/80 leading-relaxed max-w-lg">
                Wir haben uns gefragt: Warum gibt es in Leer noch keinen echten
                American Smash Burger? Also haben wir ihn selbst gebaut. Mit
                neonpinken Wänden, US-Nummernschildern, Diner-Booths — und
                Burgern, die sich niemand in Leer vorstellen konnte.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/menu" className="btn-pink">
                  Zur Karte
                </Link>
                <a
                  href={INSTAGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost-ink"
                >
                  <Instagram size={18} /> @burgerstationleer
                </a>
              </div>
            </div>

            {/* Scrapbook photo collage */}
            <div className="relative w-full aspect-[4/3] flex justify-center items-center mt-8 lg:mt-0">
              {/* Photo frame 1 — background */}
              <div className="absolute w-[58%] aspect-square bg-white p-1.5 pb-8 border-4 border-bs-ink shadow-[4px_4px_0_var(--bs-ink)] md:shadow-[8px_8px_0_var(--bs-ink)] -rotate-6 z-0 left-0 top-8">
                <img
                  src="/patterns/interior-1.svg"
                  alt="Burger Station Neon-Wand und Innenraum"
                  className="w-full h-full object-cover border-2 border-bs-ink"
                />
              </div>
              {/* Photo frame 2 — foreground */}
              <div className="absolute w-[63%] aspect-square bg-white p-1.5 pb-8 border-4 border-bs-ink shadow-[4px_4px_0_var(--bs-ink)] md:shadow-[8px_8px_0_var(--bs-ink)] rotate-3 z-10 right-0 bottom-0">
                <img
                  src="/patterns/interior-2.svg"
                  alt="Burger Station Diner Booth und Retro-Ambiente"
                  className="w-full h-full object-cover border-2 border-bs-ink"
                />
                {/* License plate detail */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-bs-pink text-white text-label-caps px-4 py-1 border-2 border-bs-ink text-xs font-bold uppercase tracking-widest">
                  LEER · 2026
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Teal checker divider */}
        <div
          className="w-full h-4 border-y-4 border-bs-ink"
          style={{
            backgroundImage:
              "linear-gradient(45deg, #006a62 25%, transparent 25%, transparent 75%, #006a62 75%, #006a62), linear-gradient(45deg, #006a62 25%, #fefccf 25%, #fefccf 75%, #006a62 75%, #006a62)",
            backgroundSize: "16px 16px",
            backgroundPosition: "0 0, 8px 8px",
          }}
          aria-hidden="true"
        />

        {/* ── The Story ── */}
        <section className="max-w-5xl mx-auto px-4 py-20 relative">
          <div className="bg-bs-pink-cream border-4 border-bs-ink shadow-[4px_4px_0_var(--bs-ink)] md:shadow-[8px_8px_0_var(--bs-ink)] p-8 md:p-14 relative">
            {/* Rotated sticker */}
            <div className="absolute -top-5 -left-5 -rotate-12 bg-bs-cyan text-bs-ink text-label-caps px-5 py-2 border-3 border-bs-ink shadow-[4px_4px_0_var(--bs-ink)] rounded-full z-20" style={{ borderWidth: "3px" }}>
              Halal &amp; Handmade
            </div>

            <div className="flex flex-col md:flex-row gap-10">
              <div className="md:w-1/3">
                <h2 className="text-headline text-4xl md:text-5xl text-bs-ink mb-4">
                  Der Plan.
                </h2>
                <div className="w-16 h-2 bg-bs-pink border-2 border-bs-ink"></div>
              </div>
              <div className="md:w-2/3 text-bs-ink/80 leading-relaxed flex flex-col gap-4 text-base md:text-lg">
                <p>
                  Burger Station Leer ist kein Franchise, kein Konzept von der
                  Stange. Wir sind lokal, unabhängig — und wir haben einen klaren
                  Anspruch: den besten Smash Burger zwischen Emden und Oldenburg.
                </p>
                <p>
                  Jeder Patty wird täglich frisch geformt und auf heißem Stahl
                  gesmasht. Das Fleisch ist 100 % halal — nicht weil wir es müssen,
                  sondern weil es unser Standard ist. Kein Marketing. Einfach
                  Qualität.
                </p>
                <p>
                  Der Look? Bewusst übertrieben. Pinke Wände, Neon, Vinyl,
                  US-Plates. Wir glauben, dass gutes Essen eine Bühne verdient —
                  und dass Leer diese Energie gebraucht hat.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Values / USPs ── */}
        <section className="py-16 md:py-20 bg-bs-surface-hi relative overflow-hidden">
          <div className="checker-strip absolute top-0 inset-x-0" aria-hidden="true"></div>
          <div className="checker-strip absolute bottom-0 inset-x-0" aria-hidden="true"></div>

          <div className="container pt-6 pb-6">
            <div className="text-center mb-12">
              <h2 className="text-headline text-4xl sm:text-5xl md:text-6xl text-bs-ink uppercase drop-shadow-[2px_2px_0px_#40e0d0] md:drop-shadow-[3px_3px_0px_#40e0d0]">
                WAS UNS AUSMACHT.
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "100% Halal",
                  desc: "Transparente Herkunft. Klare Standards. Kein Kompromiss.",
                  accent: "pink",
                },
                {
                  title: "Handmade",
                  desc: "Täglich frisch geformte Patties. Direkt auf dem Grill gesmasht.",
                  accent: "cyan",
                },
                {
                  title: "Authentisch",
                  desc: "American Retro Diner in Leer. Echt, laut, konsequent.",
                  accent: "yellow",
                },
                {
                  title: "Lokal",
                  desc: "Bahnhofsring 30. Unabhängig. Familienbetrieb.",
                  accent: "pink",
                },
              ].map((v, i) => (
                <div
                  key={i}
                  className="bg-white border-[3px] border-bs-ink rounded-2xl p-6 shadow-[5px_5px_0_var(--bs-ink)] text-center group hover:-translate-y-1 transition-transform"
                >
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full border-[3px] border-bs-ink flex items-center justify-center text-display text-3xl ${
                      v.accent === "pink"
                        ? "bg-bs-teal text-white"
                        : v.accent === "cyan"
                          ? "bg-bs-primary-c text-bs-ink"
                          : "bg-bs-yellow text-bs-ink"
                    }`}
                  >
                    {i === 0 ? "✓" : i === 1 ? "✦" : i === 2 ? "★" : "📍"}
                  </div>
                  <h3 className="text-subhead text-xl text-bs-ink mb-2">
                    {v.title}
                  </h3>
                  <p className="text-bs-ink-v text-sm leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Grand Opening note ── */}
        <section className="max-w-5xl mx-auto px-4 py-16">
          <div className="retro-card-cyan p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <span className="badge-neon badge-pink-fill mb-4 inline-block">
                GRAND OPENING
              </span>
              <h2 className="text-headline text-4xl md:text-5xl text-bs-ink mb-3">
                Wir sind da.
              </h2>
              <p className="text-bs-ink/80 leading-relaxed">
                Burger Station Leer hat am 02.05.2026 eröffnet. Seitdem gibt
                es täglich frische Smash Patties, dicke Shakes und die beste
                Atmosphäre am Bahnhofsring.
              </p>
            </div>
            <div className="shrink-0 flex flex-col gap-3">
              <Link href="/menu" className="btn-pink">
                Zur Karte
              </Link>
              <Link href="/locations" className="btn-cyan">
                Standort finden
              </Link>
            </div>
          </div>
        </section>

        {/* Instagram teaser */}
        <section className="pb-16 px-4 max-w-5xl mx-auto">
          <div className="retro-card-pink p-6 md:p-8 flex flex-col md:flex-row items-center gap-5">
            <div className="bg-white border-2 border-bs-ink rounded-full p-3 shrink-0">
              <Instagram size={28} className="text-bs-pink" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-subhead text-lg md:text-xl text-bs-ink">
                Behind the scenes, neue Menüs, Aktionen.{" "}
                <span className="neon-text-pink">@burgerstationleer</span> auf
                Instagram.
              </p>
            </div>
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pink btn-sm shrink-0"
            >
              Folgen
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
