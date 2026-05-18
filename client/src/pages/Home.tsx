import { motion, useReducedMotion } from "framer-motion";
import { Phone, MapPin, Instagram, ChevronRight, Star, Clock, Flame } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import { RevealOnScroll } from "@/components/RevealOnScroll";

const PHONE = "tel:+4949199755279";
const PHONE_DISPLAY = "0491 99 755 279";
const MAPS = "https://www.google.com/maps/search/?api=1&query=Burger+Station+Bahnhofsring+30+26789+Leer";
const INSTAGRAM = "https://instagram.com/burgerstationleer";

const BESTSELLERS = [
  {
    name: "Double Smash",
    price: "9,40",
    desc: "Zwei knackig gesmashte Beef Patties, Cheddar, Pickles, Burger Sauce.",
    badge: "Top Seller",
    img: "/images/menu/real-double-smash.png",
    plate: "DBL-SMSH-001",
    plateBg: "var(--bs-primary-f)",
  },
  {
    name: "Long Chili Cheese",
    price: "11,90",
    desc: "Doppelt Beef, Chili Cheese und Jalapeños — würzig, intensiv, lang.",
    badge: "Spicy",
    img: "/images/menu/real-long-chili-cheese.png",
    plate: "LNG-CHI-002",
    plateBg: "var(--bs-peach)",
  },
  {
    name: "BBQ Smash",
    price: "9,90",
    desc: "Bacon, Onion Rings, rauchige BBQ Sauce. Crunchy bis zum letzten Bissen.",
    badge: "Smoky",
    img: "/images/menu/real-bbq-smash.png",
    plate: "BBQ-SMS-003",
    plateBg: "var(--bs-yellow)",
  },
  {
    name: "Croissant Smash",
    price: "11,40",
    desc: "Buttriges Croissant trifft Double Beef. Unser Signature Move.",
    badge: "Signature",
    img: "/images/menu/real-croissant-smash.png",
    plate: "CRS-SMS-004",
    plateBg: "var(--bs-primary-f)",
  },
];

export default function Home() {
  const reduce = useReducedMotion();
  return (
    <div className="min-h-screen bg-bs-cream text-bs-ink overflow-x-hidden">
      <Header />

      {/* ════════════════════ HERO ════════════════════ */}
      <section id="top" className="relative overflow-hidden bg-bs-cream pt-10 pb-16 md:pt-16 md:pb-24">
        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-12">

            {/* Left — Copy */}
            <div className="flex-1 flex flex-col gap-6 z-20">
              <div className="inline-flex items-center gap-2 bg-bs-primary-c border-2 border-bs-ink rounded-full px-4 py-2 text-label-caps shadow-[2px_2px_0_var(--bs-ink)] self-start -rotate-1">
                SEIT MAI 2026 GEÖFFNET · LEER
              </div>

              <h1 className="text-display leading-[0.95]">
                <span className="block text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-bs-ink uppercase drop-shadow-[2px_2px_0px_#006a62] md:drop-shadow-[4px_4px_0px_#006a62]">
                  SMASH BURGER
                </span>
                <span className="block text-3xl md:text-5xl lg:text-6xl mt-2 uppercase">
                  <span className="text-bs-peach drop-shadow-[4px_4px_0px_var(--bs-ink)] relative inline-block">
                    <span className="absolute inset-0 blur-[24px] bg-bs-peach opacity-60 rounded-full" aria-hidden="true"></span>
                    <span className="relative">IN LEER</span>
                  </span>
                </span>
                <span className="block text-xl md:text-2xl lg:text-3xl text-bs-ink-v mt-4 font-body italic font-medium normal-case tracking-normal">
                  Halal · Handmade · Hot.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-bs-ink-v max-w-xl leading-relaxed">
                Saftige Smash Patties, knusprige Fries und cremige Shakes — direkt am Bahnhofsring 30. Diner-Vibes, die sich abheben.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/menu" className="btn-pink">Menü ansehen</Link>
                <a href={MAPS} target="_blank" rel="noopener noreferrer" className="btn-cyan">
                  <MapPin size={18} /> Route starten
                </a>
                <a href={PHONE} className="btn-ghost-ink">
                  <Phone size={18} /> Anrufen
                </a>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <span className="badge-neon badge-pink-fill">100% Halal</span>
                <span className="badge-neon badge-cyan-fill">Handmade Daily</span>
                <span className="badge-neon badge-yellow-fill">American Retro Diner</span>
              </div>
            </div>

            {/* Right — Hero image */}
            <div className="flex-1 relative flex justify-center items-center h-[320px] sm:h-[380px] md:h-[480px] lg:h-[520px] w-full">
              {/* Peach glow backdrop */}
              <div className="absolute inset-0 bg-bs-peach rounded-full blur-[100px] opacity-30 z-0" aria-hidden="true"></div>
              {/* Circular framed image */}
              <div className="relative z-10 w-64 h-64 md:w-[360px] md:h-[360px] lg:w-[440px] lg:h-[440px] rounded-full overflow-hidden border-4 border-bs-ink shadow-[0_0_40px_rgba(254,212,200,0.8)] hover:scale-105 transition-transform duration-500">
                <img
                  src="/images/menu/hero-burger.png"
                  alt="Burger Station Smash Burger mit Käse, Bacon und frischem Salat"
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Rotating price sticker */}
              <div
                className="absolute top-8 right-2 sm:right-4 md:right-8 z-20 w-24 h-24 md:w-28 md:h-28 bg-bs-yellow rounded-full border-[3px] border-bs-ink shadow-[4px_4px_0_var(--bs-ink)] flex flex-col items-center justify-center rotate-12"
              >
                <span className="text-xs tracking-widest text-bs-ink font-bold uppercase">AB</span>
                <span className="text-3xl md:text-4xl text-bs-ink font-display font-black leading-none">6,90</span>
                <span className="text-xs tracking-widest mt-0.5 text-bs-ink font-bold uppercase">EURO</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom teal checker strip */}
        <div className="checker-strip absolute bottom-0 inset-x-0" aria-hidden="true"></div>
      </section>

      {/* ════════════════════ TICKER ════════════════════ */}
      <section
        className="border-y-4 border-bs-ink overflow-hidden relative"
        style={{
          backgroundImage: "linear-gradient(45deg,#006a62 25%,transparent 25%,transparent 75%,#006a62 75%,#006a62),linear-gradient(45deg,#006a62 25%,#eceabe 25%,#eceabe 75%,#006a62 75%,#006a62)",
          backgroundSize: "16px 16px",
        }}
        aria-label="Ticker"
      >
        <div className="bg-bs-surface-hi py-2.5 border-y-2 border-bs-ink shadow-[0_0_15px_rgba(64,224,208,0.4)]">
          <div className="ticker-track font-body font-black text-xl md:text-2xl tracking-[0.15em] text-bs-ink whitespace-nowrap">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center shrink-0">
                <span className="px-6">SMASH BURGERS</span>
                <span className="text-bs-teal px-2">★</span>
                <span className="px-6">HALAL &amp; HANDMADE</span>
                <span className="text-bs-teal px-2">★</span>
                <span className="px-6">FRIES · SHAKES · VIBES</span>
                <span className="text-bs-teal px-2">★</span>
                <span className="px-6">BAHNHOFSRING 30 · LEER</span>
                <span className="text-bs-teal px-2">★</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ BESTSELLERS ════════════════════ */}
      <section id="bestseller" className="py-20 md:py-28 bg-bs-cream relative overflow-hidden">
        <div className="absolute top-10 right-10 font-body italic font-black text-bs-primary-c text-3xl rotate-12 hidden md:block opacity-60" aria-hidden="true">★ Top 4 ★</div>

        <div className="container relative">
          <div className="flex justify-between items-end mb-12">
            <RevealOnScroll>
              <div>
                <span className="badge-neon badge-yellow-fill">DIE FAVORITEN</span>
                <h2 className="text-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-bs-ink mt-3 uppercase drop-shadow-[2px_2px_0px_#40e0d0] md:drop-shadow-[3px_3px_0px_#40e0d0]">
                  DINER<br />FAVORITES
                </h2>
              </div>
            </RevealOnScroll>
            <Link href="/menu" className="text-label-caps text-bs-teal border-b-2 border-bs-teal hover:text-bs-ink hover:border-bs-ink transition-colors uppercase hidden md:inline-flex items-center gap-1">
              Alle ansehen <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BESTSELLERS.map((b, i) => (
              <motion.div
                key={i}
                className="bg-white border-[3px] border-bs-ink rounded-xl flex flex-col shadow-[4px_4px_0_var(--bs-ink)] md:shadow-[8px_8px_0_var(--bs-ink)] relative group hover:-translate-y-1 transition-transform"
                {...(!reduce ? {
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, margin: "-60px" },
                  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 },
                } : {})}
              >
                {/* Image area */}
                <div className="h-56 border-b-[3px] border-bs-ink rounded-t-xl overflow-hidden relative bg-bs-pink-cream">
                  <img
                    src={b.img}
                    alt={`${b.name} Smash Burger`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 -rotate-2">
                    <span className="badge-neon badge-yellow-fill">{b.badge}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col gap-2 bg-white">
                  <h3 className="text-subhead text-xl text-bs-ink">{b.name}</h3>
                  <p className="text-sm text-bs-ink-v leading-relaxed flex-1">{b.desc}</p>
                  <div className="flex items-center justify-between pt-3 mt-2">
                    <span className="text-headline text-2xl text-bs-teal">{b.price}€</span>
                    <Link
                      href="/menu"
                      className="w-11 h-11 rounded-full border-2 border-bs-ink bg-bs-primary-c flex items-center justify-center shadow-[2px_2px_0_var(--bs-ink)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-bs-ink"
                      aria-label={`${b.name} im Menü ansehen`}
                    >
                      <ChevronRight size={18} />
                    </Link>
                  </div>
                </div>

                {/* License plate footer */}
                <div
                  className="w-full text-bs-ink text-label-caps text-[11px] border-t-[3px] border-bs-ink py-2 flex justify-center items-center tracking-[0.2em] font-bold uppercase rounded-b-xl shadow-[inset_0_2px_0_rgba(255,255,255,0.3)]"
                  style={{ background: b.plateBg }}
                >
                  {b.plate}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/menu" className="btn-pink">
              Alle Menü-Optionen ansehen <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════ BUNDLE / DEAL ════════════════════ */}
      <section className="relative overflow-hidden border-y-[8px] border-bs-ink checker-teal py-20 md:py-24">
        {/* Semi-transparent cream overlay so text remains readable */}
        <div className="absolute inset-0 bg-bs-cream/80 backdrop-blur-sm" aria-hidden="true"></div>

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto bg-bs-peach border-[4px] border-bs-ink rounded-2xl p-8 md:p-12 shadow-[6px_6px_0_var(--bs-ink)] md:shadow-[12px_12px_0_var(--bs-ink)] text-center">
            <div className="inline-block bg-white border-[3px] border-bs-yellow rounded-2xl px-6 py-2 mb-6 -rotate-2 shadow-[5px_5px_0_var(--bs-ink)]">
              <span className="font-body italic font-extrabold text-bs-ink text-2xl">Menü-Deal</span>
            </div>

            <h2 className="text-display text-4xl sm:text-5xl md:text-7xl text-bs-ink uppercase">
              <span className="block">MACH DEIN</span>
              <span className="block drop-shadow-[2px_2px_0px_#006a62] md:drop-shadow-[3px_3px_0px_#006a62]">MENÜ KOMPLETT</span>
            </h2>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:gap-8 text-display text-2xl sm:text-3xl md:text-5xl">
              <span className="bg-bs-teal text-white px-5 py-3 rounded-2xl border-[3px] border-bs-ink shadow-[4px_4px_0_var(--bs-ink)]">BURGER</span>
              <span className="text-bs-ink text-4xl font-display font-black">+</span>
              <span className="bg-bs-primary-c text-bs-ink px-5 py-3 rounded-2xl border-[3px] border-bs-ink shadow-[4px_4px_0_var(--bs-ink)]">FRIES</span>
              <span className="text-bs-ink text-4xl font-display font-black">+</span>
              <span className="bg-bs-yellow text-bs-ink px-5 py-3 rounded-2xl border-[3px] border-bs-ink shadow-[4px_4px_0_var(--bs-ink)]">DRINK</span>
            </div>

            <p className="text-headline text-3xl md:text-4xl text-bs-ink mt-8 tracking-widest uppercase">
              AB <span className="text-bs-teal">+3,00€</span>
            </p>
            <p className="text-bs-ink-v mt-3 text-lg">Aufpreis auf jeden Burger. Frag bei der Bestellung.</p>

            <Link href="/menu" className="btn-pink mt-8 inline-flex">Zur Karte</Link>
          </div>
        </div>
      </section>

      {/* ════════════════════ USPs ════════════════════ */}
      <section className="py-20 md:py-24 bg-bs-surface-hi">
        <div className="container">
          <RevealOnScroll>
            <div className="text-center mb-14">
              <span className="badge-neon badge-cyan-fill">WARUM BURGER STATION?</span>
              <h2 className="text-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-bs-ink mt-4 uppercase">
                VIER GUTE GRÜNDE.
              </h2>
            </div>
          </RevealOnScroll>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Handmade", subtitle: "Smash Burger", desc: "Frisch gesmasht, heiß serviert. Nichts liegt rum." },
              { title: "100%", subtitle: "Halal", desc: "Klar kommuniziert. Bewusst gewählt." },
              { title: "Fries", subtitle: "& Shakes", desc: "Klassisch, sweet potato, beef & cheese. Plus dicke Shakes." },
              { title: "Retro", subtitle: "Diner Vibes", desc: "US-Nummernschilder, Checkerboard, Vinyl. Ein Look, der auffällt." },
            ].map((u, i) => (
              <div key={i} className="text-center group">
                <div
                  className="w-32 h-32 mx-auto mb-5 rounded-full bg-white flex flex-col items-center justify-center shadow-[5px_5px_0_var(--bs-ink)] group-hover:rotate-6 transition-transform border-[3px] border-bs-ink"
                >
                  <span className="text-display text-2xl text-bs-teal leading-none">{u.title}</span>
                  <span className="text-subhead text-base text-bs-ink leading-none mt-1">{u.subtitle}</span>
                </div>
                <p className="text-bs-ink-v leading-relaxed max-w-xs mx-auto">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ ERLEBNIS ════════════════════ */}
      <section id="erlebnis" className="py-20 md:py-28 bg-bs-cream relative overflow-hidden">
        <div className="container relative">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center mb-16">
            <RevealOnScroll>
              <div className="space-y-5">
                <span className="badge-neon badge-pink-fill">DAS ERLEBNIS</span>
                <h2 className="text-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-bs-ink uppercase">
                  Mehr als nur<br />
                  <span className="text-bs-teal drop-shadow-[2px_2px_0px_#40e0d0] md:drop-shadow-[3px_3px_0px_#40e0d0]">ein Burger.</span>
                </h2>
                <p className="text-lg text-bs-ink-v leading-relaxed max-w-lg">
                  Pinke Wände. Neonlicht. US-Nummernschilder. Vinyl an den Wänden. Burger Station ist kein normaler Imbiss — es ist der Foodspot, an dem du isst, fotografierst und wiederkommst.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link href="/about" className="btn-pink btn-sm">Unsere Story</Link>
                  <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="btn-ghost-ink btn-sm">
                    <Instagram size={16} /> @burgerstationleer
                  </a>
                </div>
              </div>
            </RevealOnScroll>

            <div className="grid grid-cols-2 gap-4">
              <img
                src="/images/foodspot/real-shake.png"
                alt="Burger Station Chocolate Shake mit Sahne und Kirsche"
                className="rounded-2xl border-2 border-bs-ink shadow-[4px_4px_0_var(--bs-ink)] aspect-square object-cover w-full bg-white"
              />
              <img
                src="/images/foodspot/real-neon-sign.png"
                alt="Burger Station Neon-Schild — Smash Burgers · Leer"
                className="rounded-2xl border-2 border-bs-ink shadow-[4px_4px_0_var(--bs-teal)] aspect-square object-cover w-full mt-8 bg-white"
              />
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Neon Vibes",
                desc: "Leuchtende Schilder, pinke Wände, Diner-Atmosphäre. Jede Ecke ist ein Foto wert.",
                icon: <svg viewBox="0 0 60 60" className="w-12 h-12" aria-hidden="true"><circle cx="30" cy="30" r="22" fill="none" stroke="var(--bs-teal)" strokeWidth="3" /><path d="M22 28 L22 38 L38 38 L38 28 M30 38 L30 22" stroke="var(--bs-teal)" strokeWidth="3" fill="none" strokeLinecap="round" /></svg>,
              },
              {
                title: "American Diner Style",
                desc: "Pastellfarben, Checkerboard, US-Nummernschilder, Vinyl-Schallplatten — wie aus den 50ern.",
                icon: <svg viewBox="0 0 60 60" className="w-12 h-12" aria-hidden="true"><circle cx="30" cy="30" r="22" fill="var(--bs-ink)" /><circle cx="30" cy="30" r="8" fill="var(--bs-primary-c)" /><circle cx="30" cy="30" r="3" fill="var(--bs-ink)" /></svg>,
              },
              {
                title: "Foodspot in Leer",
                desc: "Direkt am Bahnhofsring. Schnell zwischen Termin und Heimweg, oder als ganzer Abend.",
                icon: <svg viewBox="0 0 60 60" className="w-12 h-12" aria-hidden="true"><path d="M30 8 C18 8 12 18 12 26 C12 38 30 52 30 52 C30 52 48 38 48 26 C48 18 42 8 30 8 Z" fill="var(--bs-yellow)" stroke="var(--bs-ink)" strokeWidth="2.5" /><circle cx="30" cy="25" r="6" fill="var(--bs-teal)" /></svg>,
              },
            ].map((f, i) => (
              <div key={i} className="retro-card p-6">
                <div className="mb-4">{f.icon}</div>
                <h3 className="text-subhead text-2xl text-bs-ink mb-2">{f.title}</h3>
                <p className="text-bs-ink-v leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Instagram tag prompt */}
          <div className="mt-12 retro-card-pink p-6 md:p-8 flex flex-col md:flex-row items-center gap-5">
            <div className="bg-white border-2 border-bs-ink rounded-full p-3 shrink-0">
              <Instagram size={28} className="text-bs-teal" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-subhead text-lg md:text-xl text-bs-ink">
                Mach dein Foto. Tag <span className="text-bs-teal font-bold">@burgerstationleer</span>. Werde Teil der Wand.
              </p>
            </div>
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="btn-pink btn-sm shrink-0">Folgen</a>
          </div>
        </div>
      </section>

      <GoogleReviewsSection />

      {/* ════════════════════ INSTAGRAM ════════════════════ */}
      <section className="py-20 md:py-24 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center mb-12">
            <RevealOnScroll>
              <div>
                <span className="badge-neon badge-yellow-fill">@BURGERSTATIONLEER</span>
                <h2 className="text-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-bs-ink mt-4 uppercase">
                  Dein nächster <span className="text-bs-teal drop-shadow-[2px_2px_0px_#40e0d0] md:drop-shadow-[3px_3px_0px_#40e0d0]">Foodspot</span> in Leer.
                </h2>
                <p className="text-lg text-bs-ink-v mt-5 leading-relaxed">
                  Burger, Neonlicht, Behind-the-Scenes. Folge uns für Aktionen, neue Menüs und den ehrlichsten Blick hinter die Theke.
                </p>
                <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="btn-pink mt-6 inline-flex">
                  <Instagram size={18} /> Auf Instagram folgen
                </a>
              </div>
            </RevealOnScroll>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { src: "/images/menu/real-double-smash.png", alt: "Double Smash Burger" },
                { src: "/images/foodspot/foodspot-2.png", alt: "Burger Station Neon-Schild im Retro-Stil" },
                { src: "/images/foodspot/foodspot-1.png", alt: "Burger Station Milkshake im Retro-Stil" },
                { src: "/images/foodspot/foodspot-3.png", alt: "Burger Station Leuchtschild mit Diner-Elementen" },
                { src: "/images/menu/real-long-chili-cheese.png", alt: "Long Chili Cheese Burger" },
                { src: "/images/foodspot/real-fries.png", alt: "Burger Station Fries im BS-Box" },
              ].map((p, i) => (
                <a
                  key={i}
                  href={INSTAGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square rounded-xl border-2 border-bs-ink overflow-hidden shadow-[3px_3px_0_var(--bs-ink)] hover:shadow-[5px_5px_0_var(--bs-teal)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all bg-bs-pink-cream"
                >
                  <img
                    src={p.src}
                    alt={p.alt}
                    className="w-full h-full object-contain"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ STANDORT ════════════════════ */}
      <section id="standort" className="py-20 md:py-28 bg-bs-surface-hi relative overflow-hidden">
        <div className="container">
          <RevealOnScroll>
            <div className="text-center mb-12">
              <span className="badge-neon badge-cyan-fill">UNSER STANDORT</span>
              <h2 className="text-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-bs-ink mt-4 uppercase drop-shadow-[2px_2px_0px_#40e0d0] md:drop-shadow-[3px_3px_0px_#40e0d0]">
                FIND US.
              </h2>
            </div>
          </RevealOnScroll>

          <div className="grid lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {/* Map */}
            <div className="lg:col-span-3 retro-card overflow-hidden aspect-[4/3] lg:aspect-auto">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=7.4505%2C53.2275%2C7.4665%2C53.2375&layer=mapnik&marker=53.2325%2C7.4585"
                className="w-full h-full min-h-[300px] md:min-h-[400px] border-0"
                loading="lazy"
                title="Burger Station Standort Leer Bahnhofsring 30"
              />
            </div>

            {/* Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="retro-card p-6">
                <div className="flex items-start gap-3 mb-2">
                  <MapPin size={22} className="text-bs-teal mt-1 shrink-0" />
                  <div>
                    <h3 className="text-subhead text-xl text-bs-ink">Adresse</h3>
                    <p className="text-bs-ink-v mt-1 leading-relaxed">
                      Bahnhofsring 30<br />26789 Leer<br />Niedersachsen
                    </p>
                  </div>
                </div>
                <a href={MAPS} target="_blank" rel="noopener noreferrer" className="btn-pink btn-sm w-full mt-3">
                  Route starten
                </a>
              </div>

              <div className="retro-card-cyan p-6">
                <div className="flex items-start gap-3">
                  <Clock size={22} className="text-bs-teal mt-1 shrink-0" strokeWidth={2.5} />
                  <div>
                    <h3 className="text-subhead text-xl text-bs-ink">Öffnungszeiten</h3>
                    <div className="mt-3 space-y-1.5 text-bs-ink font-medium">
                      <div className="flex justify-between gap-4"><span>So – Do</span><span className="font-body font-bold tracking-wider">11:00 – 23:00</span></div>
                      <div className="flex justify-between gap-4"><span>Fr &amp; Sa</span><span className="font-body font-bold tracking-wider">11:00 – 02:00</span></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border-2 border-bs-ink p-6 shadow-[4px_4px_0_var(--bs-ink)]">
                <div className="flex items-start gap-3">
                  <Phone size={22} className="text-bs-ink mt-1 shrink-0" />
                  <div>
                    <h3 className="text-subhead text-xl text-bs-ink">Telefon</h3>
                    <a href={PHONE} className="text-lg font-medium text-bs-ink hover:text-bs-teal transition mt-1 block">
                      {PHONE_DISPLAY}
                    </a>
                  </div>
                </div>
              </div>

              <Link href="/locations" className="btn-cyan w-full text-center block">
                Standort-Seite öffnen
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ KONTAKT ════════════════════ */}
      <section id="kontakt" className="relative overflow-hidden pt-12 pb-20 md:pb-28" style={{ background: "var(--bs-surface-top)" }}>
        {/* Teal checker strip at very top */}
        <div className="checker-strip absolute top-0 inset-x-0" aria-hidden="true"></div>

        <RevealOnScroll>
          <div className="container relative text-center max-w-3xl mx-auto">
            <Flame size={48} className="text-bs-teal mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-display text-5xl sm:text-6xl md:text-8xl text-bs-ink uppercase drop-shadow-[2px_2px_0px_#006a62] md:drop-shadow-[4px_4px_0px_#006a62]">
              LUST AUF BURGER?
            </h2>
            <p className="text-xl text-bs-ink-v mt-6 leading-relaxed">
              Ruf an. Komm vorbei. Folg uns. So einfach.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-8">
              <a href={PHONE} className="btn-pink pulse-pink">
                <Phone size={18} /> {PHONE_DISPLAY}
              </a>
              <a href={MAPS} target="_blank" rel="noopener noreferrer" className="btn-cyan">
                <MapPin size={18} /> Route starten
              </a>
              <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="btn-ghost-ink">
                <Instagram size={18} /> Instagram
              </a>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      <Footer />

      {/* ════════════════════ STICKY MOBILE CTA ════════════════════ */}
      <div className="sticky-cta">
        <Link href="/menu" className="btn-pink btn-sm">Menü</Link>
        <a href={MAPS} target="_blank" rel="noopener noreferrer" className="btn-cyan btn-sm">
          <MapPin size={14} /> Route
        </a>
        <a href={PHONE} className="btn-pink btn-sm pulse-pink">
          <Phone size={14} /> Anruf
        </a>
      </div>
      <div className="h-20 md:h-0" aria-hidden="true"></div>
    </div>
  );
}
