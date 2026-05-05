import { Phone, MapPin, Instagram, Menu as MenuIcon, X, ChevronRight, Star, Clock, Flame } from "lucide-react";
import { useState, useEffect } from "react";

/**
 * BURGER STATION LEER — Retro American Diner brand site
 * Bahnhofsring 30, 26789 Leer · @burgerstationleer · 0491 99 755 279
 */

type MenuItem = { name: string; price: string; desc?: string; tags?: string[] };

const PHONE = "tel:+4949199755279";
const PHONE_DISPLAY = "0491 99 755 279";
const MAPS = "https://www.google.com/maps/search/?api=1&query=Burger+Station+Bahnhofsring+30+26789+Leer";
const INSTAGRAM = "https://instagram.com/burgerstationleer";

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tab, setTab] = useState<keyof typeof menu>("beef");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const menu: Record<string, MenuItem[]> = {
    beef: [
      { name: "Single Smash", price: "6,90", desc: "Brioche Bun, Single Beef Patty, Cheddar, Onion, Lettuce, Pickles, Burger Sauce" },
      { name: "Double Smash", price: "9,40", desc: "Doppeltes Beef Patty, geschmolzener Cheddar, Pickles, Burger Sauce", tags: ["Top Seller"] },
      { name: "Long Chili Cheese", price: "11,90", desc: "Doppeltes Beef, Chili Cheese, Jalapeños, Burger Sauce", tags: ["Spicy"] },
      { name: "BBQ Smash", price: "9,90", desc: "Beef Patty, Bacon, Cheddar, Onion Rings, BBQ Sauce", tags: ["Smoky"] },
      { name: "Croissant Smash", price: "11,40", desc: "Croissant Bun, doppeltes Beef Patty, Cheddar, Burger Sauce", tags: ["Signature"] },
      { name: "Sucuk Burger", price: "8,90", desc: "Sucuk, Cheddar, Onion, Lettuce, Pickles, Garlic Sauce" },
    ],
    chicken: [
      { name: "Classic Chicken", price: "9,00", desc: "Knuspriges Chicken Patty, Buttermilk-Mariniert, Cheddar, Lettuce, Pickles, Burger Sauce" },
      { name: "Garlic Chicken", price: "9,00", desc: "Chicken Patty, Cheddar, Garlic Sauce" },
      { name: "Long Chicken", price: "11,50", desc: "Doppelt Chicken Patty, Cheddar, Lettuce, Onion, Pickles, Burger Sauce" },
    ],
    vegan: [
      { name: "Vegan Burger", price: "8,70", desc: "Vegan Patty, Lettuce, Onion, Pickles, Vegan Sauce" },
      { name: "Falafel Burger", price: "8,70", desc: "Hausgemachte Falafel, Lettuce, Onion, Pickles, Vegan Sauce" },
    ],
    sides: [
      { name: "Fries", price: "3,50" },
      { name: "Beef & Cheese Fries", price: "7,90", desc: "Fries mit Smash Beef und Cheese Sauce" },
      { name: "Sweet Potato Fries", price: "4,50" },
      { name: "8 Chicken Nuggets", price: "6,00" },
      { name: "Chicken Tenders", price: "6,60" },
      { name: "Onion Rings", price: "6,20" },
    ],
    sauces: [
      { name: "Burger Sauce", price: "1,50" },
      { name: "Cheese Sauce", price: "4,00" },
      { name: "Garlic Sauce", price: "1,50" },
      { name: "Sweet & Sour Sauce", price: "1,50" },
      { name: "Ketchup", price: "0,60" },
      { name: "Mayo", price: "0,60" },
    ],
    shakes: [
      { name: "Chocolate Shake", price: "4,00", desc: "Cremig, kalt, klassisch" },
      { name: "Vanilla Shake", price: "4,00", desc: "Vanille, dick, eiskalt" },
    ],
    drinks: [
      { name: "Water", price: "2,00" },
      { name: "Fritz Limo", price: "3,30", desc: "Cola · Orange · Zitrone" },
    ],
  };

  const tabLabels: Record<string, string> = {
    beef: "🥩 Beef",
    chicken: "🍗 Chicken",
    vegan: "🌱 Vegan",
    sides: "🍟 Sides",
    sauces: "🥫 Sauces",
    shakes: "🥤 Shakes",
    drinks: "🧊 Drinks",
  };

  const bestsellers = [
    {
      name: "Double Smash",
      price: "9,40",
      desc: "Zwei knackig gesmashte Beef Patties, Cheddar, Pickles, Burger Sauce.",
      badge: "Top Seller",
      img: "/burgers/double-smash.svg",
      bg: "from-pink-100",
    },
    {
      name: "Long Chili Cheese",
      price: "11,90",
      desc: "Doppelt Beef, Chili Cheese und Jalapeños — würzig, intensiv, lang.",
      badge: "Spicy",
      img: "/burgers/long-chili-cheese.svg",
      bg: "from-cyan-100",
    },
    {
      name: "BBQ Smash",
      price: "9,90",
      desc: "Bacon, Onion Rings, rauchige BBQ Sauce. Crunchy bis zum letzten Bissen.",
      badge: "Smoky",
      img: "/burgers/bbq-smash.svg",
      bg: "from-yellow-50",
    },
    {
      name: "Croissant Smash",
      price: "11,40",
      desc: "Buttriges Croissant trifft Double Beef. Unser Signature Move.",
      badge: "Signature",
      img: "/burgers/croissant-smash.svg",
      bg: "from-pink-50",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ============== HEADER ============== */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md border-b-2 border-bs-ink shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container flex items-center justify-between py-3 md:py-4">
          <a href="#top" className="flex items-center gap-3 group">
            <img src="/brand/mark.svg" alt="Burger Station Logo" className="w-11 h-11 md:w-12 md:h-12 transition-transform group-hover:rotate-6" />
            <div className="leading-none">
              <div className="text-subhead text-lg md:text-xl text-bs-ink">BURGER STATION</div>
              <div className="text-label-caps text-[10px] md:text-xs text-bs-pink mt-0.5">Leer · Est. 2025</div>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-8 font-body font-semibold text-sm tracking-wider text-bs-ink uppercase">
            <a href="#erlebnis" className="hover:text-bs-pink transition">Erlebnis</a>
            <a href="#bestseller" className="hover:text-bs-pink transition">Bestseller</a>
            <a href="#menu" className="hover:text-bs-pink transition">Menü</a>
            <a href="#standort" className="hover:text-bs-pink transition">Standort</a>
            <a href="#kontakt" className="hover:text-bs-pink transition">Kontakt</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a href={MAPS} target="_blank" rel="noopener noreferrer" className="btn-cyan btn-sm">
              <MapPin size={16} /> Route
            </a>
            <a href={PHONE} className="btn-pink btn-sm">
              <Phone size={16} /> Anrufen
            </a>
          </div>

          <button
            className="md:hidden bg-white border-2 border-bs-ink rounded-full p-2 shadow-[3px_3px_0_var(--bs-ink)]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menü öffnen"
          >
            {mobileOpen ? <X size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>

        {mobileOpen && (
          <nav className="md:hidden bg-white border-t-2 border-bs-ink p-4 space-y-1 font-body font-semibold text-base uppercase tracking-wider">
            {[
              ["Erlebnis", "#erlebnis"],
              ["Bestseller", "#bestseller"],
              ["Menü", "#menu"],
              ["Standort", "#standort"],
              ["Kontakt", "#kontakt"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-pink-50 transition"
                onClick={() => setMobileOpen(false)}
              >
                {label} <ChevronRight size={18} />
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* ============== HERO ============== */}
      <section id="top" className="relative hero-gradient overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24">
        {/* Decorative elements */}
        <div className="absolute inset-0 halftone pointer-events-none"></div>
        <div className="absolute top-12 left-8 w-20 h-20 rounded-full border-4 border-bs-pink opacity-50 hidden md:block float-anim"></div>
        <div className="absolute top-32 right-12 w-12 h-12 rounded-full bg-bs-yellow border-2 border-bs-ink hidden md:block float-anim" style={{animationDelay: "1s"}}></div>
        <div className="absolute bottom-32 left-16 w-8 h-8 rounded-full bg-bs-cyan hidden md:block float-anim" style={{animationDelay: "2s"}}></div>

        <div className="container relative z-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT — Copy */}
          <div className="lg:col-span-7 space-y-6 fade-in-up">
            {/* Pre-headline / status badge */}
            <div className="inline-flex items-center gap-2 bg-bs-ink text-white px-4 py-2 rounded-full text-label-caps border-2 border-bs-ink shadow-[3px_3px_0_var(--bs-pink)]">
              <span className="w-2 h-2 rounded-full bg-bs-cyan animate-pulse"></span>
              SEIT MAI 2025 GEÖFFNET · LEER
            </div>

            <h1 className="text-display leading-[0.95]">
              <span className="block text-5xl md:text-7xl lg:text-8xl text-bs-ink">SMASH BURGER</span>
              <span className="block text-3xl md:text-5xl lg:text-6xl mt-2">
                <span className="neon-text-pink neon-flicker">IN LEER</span>
              </span>
              <span className="block text-xl md:text-2xl lg:text-3xl text-bs-ink mt-4 font-body italic font-medium normal-case tracking-normal">
                Halal · Handmade · Hot.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-bs-ink/80 max-w-xl leading-relaxed">
              Saftige Smash Patties, knusprige Fries und cremige Shakes — direkt am Bahnhofsring 30. Pinke Wände, Neonlicht, echte Diner-Vibes.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <a href="#menu" className="btn-pink">Menü ansehen</a>
              <a href={MAPS} target="_blank" rel="noopener noreferrer" className="btn-cyan">
                <MapPin size={18} /> Route starten
              </a>
              <a href={PHONE} className="btn-ghost-ink">
                <Phone size={18} /> Anrufen
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2 pt-4">
              <span className="badge-neon badge-pink-fill">100% Halal</span>
              <span className="badge-neon badge-cyan-fill">Handmade Daily</span>
              <span className="badge-neon badge-yellow-fill">American Retro Diner</span>
              <span className="badge-neon bg-white">📍 Bahnhofsring 30, Leer</span>
            </div>
          </div>

          {/* RIGHT — Hero Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Backdrop neon glow */}
              <div className="absolute inset-8 rounded-full bg-bs-pink opacity-30 blur-3xl"></div>
              {/* Sunburst */}
              <div className="absolute inset-0 spin-slow opacity-40">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <g stroke="var(--bs-pink)" strokeWidth="2">
                    {Array.from({length: 24}).map((_, i) => (
                      <line key={i} x1="100" y1="100" x2="100" y2="0" transform={`rotate(${i * 15} 100 100)`} strokeDasharray="2 6"/>
                    ))}
                  </g>
                </svg>
              </div>
              {/* Burger */}
              <img
                src="/burgers/hero-burger.svg"
                alt="Burger Station Smash Burger mit Käse, Bacon und frischem Salat"
                className="relative w-full h-full object-contain drop-shadow-2xl float-anim"
              />
              {/* Sticker price */}
              <div className="absolute -bottom-2 -right-2 md:bottom-4 md:right-4 bg-bs-yellow border-3 border-bs-ink rounded-full w-28 h-28 md:w-32 md:h-32 flex flex-col items-center justify-center text-display rotate-12 shadow-[5px_5px_0_var(--bs-ink)]" style={{borderWidth: "3px"}}>
                <span className="text-xs tracking-widest">AB</span>
                <span className="text-3xl md:text-4xl text-bs-pink leading-none">6,90</span>
                <span className="text-xs tracking-widest mt-1">EURO</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom checkerboard strip */}
        <div className="checker-strip absolute bottom-0 inset-x-0"></div>
      </section>

      {/* ============== TICKER ============== */}
      <section className="bg-bs-ink border-y-2 border-bs-ink overflow-hidden py-3">
        <div className="ticker-track font-body font-black text-xl md:text-2xl tracking-[0.15em] text-bs-yellow whitespace-nowrap">
          {Array.from({length: 4}).map((_, i) => (
            <div key={i} className="flex items-center shrink-0">
              <span className="px-6">SMASH BURGERS</span>
              <span className="text-bs-pink px-2">★</span>
              <span className="px-6 neon-text-cyan">HALAL & HANDMADE</span>
              <span className="text-bs-pink px-2">★</span>
              <span className="px-6">FRIES · SHAKES · VIBES</span>
              <span className="text-bs-pink px-2">★</span>
              <span className="px-6 neon-text-pink">BAHNHOFSRING 30 · LEER</span>
              <span className="text-bs-pink px-2">★</span>
            </div>
          ))}
        </div>
      </section>

      {/* ============== ERLEBNIS ============== */}
      <section id="erlebnis" className="py-20 md:py-28 bg-white relative overflow-hidden">
        <div className="container relative">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center mb-16">
            <div className="space-y-5">
              <span className="badge-neon badge-pink-fill">DAS ERLEBNIS</span>
              <h2 className="text-headline text-5xl md:text-6xl lg:text-7xl text-bs-ink">
                Mehr als nur<br />
                <span className="neon-text-pink">ein Burger.</span>
              </h2>
              <p className="text-lg text-bs-ink/80 leading-relaxed max-w-lg">
                Pinke Wände. Neonlicht. US-Nummernschilder. Vinyl an den Wänden. Burger Station ist kein normaler Imbiss — es ist der Foodspot, an dem du isst, fotografierst und wiederkommst.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a href="#bestseller" className="btn-pink btn-sm">Bestseller ansehen</a>
                <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="btn-ghost-ink btn-sm">
                  <Instagram size={16} /> @burgerstationleer
                </a>
              </div>
            </div>

            {/* Interior collage */}
            <div className="grid grid-cols-2 gap-4">
              <img src="/patterns/interior-1.svg" alt="Pinke Wand mit Burger-Station-Neonschild" className="rounded-2xl border-2 border-bs-ink shadow-[4px_4px_0_var(--bs-ink)] aspect-square object-cover w-full"/>
              <img src="/patterns/interior-2.svg" alt="Türkise Wand mit Diner-Booth und Retro-Postern" className="rounded-2xl border-2 border-bs-ink shadow-[4px_4px_0_var(--bs-pink)] aspect-square object-cover w-full mt-8"/>
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Neon Vibes",
                desc: "Leuchtende Schilder, pinke Wände, Diner-Atmosphäre. Jede Ecke ist ein Foto wert.",
                color: "pink",
                icon: (
                  <svg viewBox="0 0 60 60" className="w-12 h-12"><circle cx="30" cy="30" r="22" fill="none" stroke="var(--bs-pink)" strokeWidth="3"/><path d="M22 28 L22 38 L38 38 L38 28 M30 38 L30 22" stroke="var(--bs-pink)" strokeWidth="3" fill="none" strokeLinecap="round"/></svg>
                ),
              },
              {
                title: "American Diner Style",
                desc: "Pastellfarben, Checkerboard, US-Nummernschilder, Vinyl-Schallplatten — wie aus den 50ern.",
                color: "cyan",
                icon: (
                  <svg viewBox="0 0 60 60" className="w-12 h-12"><circle cx="30" cy="30" r="22" fill="var(--bs-ink)"/><circle cx="30" cy="30" r="8" fill="var(--bs-cyan)"/><circle cx="30" cy="30" r="3" fill="var(--bs-ink)"/></svg>
                ),
              },
              {
                title: "Foodspot in Leer",
                desc: "Direkt am Bahnhofsring. Schnell zwischen Termin und Heimweg, oder als ganzer Abend.",
                color: "yellow",
                icon: (
                  <svg viewBox="0 0 60 60" className="w-12 h-12"><path d="M30 8 C18 8 12 18 12 26 C12 38 30 52 30 52 C30 52 48 38 48 26 C48 18 42 8 30 8 Z" fill="var(--bs-yellow)" stroke="var(--bs-ink)" strokeWidth="2.5"/><circle cx="30" cy="25" r="6" fill="var(--bs-pink)"/></svg>
                ),
              },
            ].map((f, i) => (
              <div key={i} className={`fade-in-up stagger-${i+1} retro-card p-7`}>
                <div className="mb-4">{f.icon}</div>
                <h3 className="text-subhead text-2xl text-bs-ink mb-2">{f.title}</h3>
                <p className="text-bs-ink/75 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Instagram tag prompt */}
          <div className="mt-12 retro-card-pink p-6 md:p-8 flex flex-col md:flex-row items-center gap-5">
            <div className="bg-white border-2 border-bs-ink rounded-full p-3">
              <Instagram size={28} className="text-bs-pink"/>
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-subhead text-lg md:text-xl text-bs-ink">
                Mach dein Foto. Tag <span className="neon-text-pink">@burgerstationleer</span>. Werde Teil der Wand.
              </p>
            </div>
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="btn-pink btn-sm shrink-0">Folgen</a>
          </div>
        </div>
      </section>

      {/* ============== BESTSELLER ============== */}
      <section id="bestseller" className="py-20 md:py-28 bg-bs-pink-cream relative overflow-hidden">
        <div className="absolute top-10 right-10 font-body italic font-black text-bs-pink text-3xl rotate-12 hidden md:block opacity-70">★ Top 4 ★</div>

        <div className="container relative">
          <div className="text-center mb-14">
            <span className="badge-neon badge-yellow-fill">DIE FAVORITEN</span>
            <h2 className="text-headline text-5xl md:text-6xl lg:text-7xl text-bs-ink mt-4">
              BELIEBT<br/>IN <span className="neon-text-pink">LEER</span>
            </h2>
            <p className="text-lg text-bs-ink/75 mt-4 max-w-2xl mx-auto">
              Die vier Burger, mit denen du nichts falsch machst.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.map((b, i) => (
              <div key={i} className={`fade-in-up stagger-${i+1} retro-card overflow-hidden flex flex-col`}>
                <div className={`relative bg-gradient-to-br ${b.bg} to-white aspect-square overflow-hidden`}>
                  <img src={b.img} alt={`${b.name} Smash Burger`} className="w-full h-full object-cover"/>
                  <div className="absolute top-3 left-3">
                    <span className="badge-neon badge-pink-fill">{b.badge}</span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-subhead text-2xl text-bs-ink mb-1">{b.name}</h3>
                  <p className="text-sm text-bs-ink/70 leading-relaxed flex-1">{b.desc}</p>
                  <div className="flex items-center justify-between pt-4 mt-3 border-t-2 border-dashed border-bs-ink/20">
                    <span className="text-display text-3xl neon-text-pink">{b.price}€</span>
                    <a href="#menu" className="text-label-caps text-xs text-bs-ink hover:text-bs-pink transition flex items-center gap-1">
                      INS MENÜ <ChevronRight size={14}/>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== BUNDLE / OFFER ============== */}
      <section className="relative py-16 md:py-20 bg-bs-ink overflow-hidden">
        <div className="stripes-yellow-black absolute top-0 inset-x-0 h-4"></div>
        <div className="stripes-yellow-black absolute bottom-0 inset-x-0 h-4"></div>

        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white border-3 border-bs-yellow rounded-2xl px-6 py-2 mb-6 -rotate-2 shadow-[5px_5px_0_var(--bs-pink)]" style={{borderWidth: "3px"}}>
              <span className="font-body italic font-extrabold text-bs-pink text-2xl">Menü-Deal</span>
            </div>

            <h2 className="text-display text-5xl md:text-7xl lg:text-8xl text-white">
              <span className="block">MACH DEIN</span>
              <span className="block neon-text-yellow">MENÜ KOMPLETT</span>
            </h2>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:gap-8 text-display text-3xl md:text-5xl text-white">
              <span className="bg-bs-pink px-5 py-3 rounded-2xl border-3 border-white shadow-[4px_4px_0_white]" style={{borderWidth: "3px"}}>BURGER</span>
              <span className="text-bs-yellow">+</span>
              <span className="bg-bs-cyan text-bs-ink px-5 py-3 rounded-2xl border-3 border-white shadow-[4px_4px_0_white]" style={{borderWidth: "3px"}}>FRIES</span>
              <span className="text-bs-yellow">+</span>
              <span className="bg-bs-yellow text-bs-ink px-5 py-3 rounded-2xl border-3 border-white shadow-[4px_4px_0_white]" style={{borderWidth: "3px"}}>DRINK</span>
            </div>

            <p className="text-headline text-3xl md:text-4xl text-bs-yellow mt-8 tracking-widest">
              AB <span className="neon-text-yellow">+3,00€</span>
            </p>
            <p className="text-white/70 mt-3 text-lg">Aufpreis auf jeden Burger. Frag bei der Bestellung.</p>

            <a href="#menu" className="btn-pink mt-8 inline-flex">Zum Menü</a>
          </div>
        </div>
      </section>

      {/* ============== USPs ============== */}
      <section className="py-20 md:py-24 bg-white">
        <div className="container">
          <div className="text-center mb-14">
            <span className="badge-neon badge-cyan-fill">WARUM BURGER STATION?</span>
            <h2 className="text-headline text-5xl md:text-6xl lg:text-7xl text-bs-ink mt-4">
              VIER GUTE GRÜNDE.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Handmade", subtitle: "Smash Burger", desc: "Frisch gesmasht, heiß serviert. Nichts liegt rum." },
              { title: "100%", subtitle: "Halal", desc: "Klar kommuniziert. Bewusst gewählt." },
              { title: "Fries", subtitle: "& Shakes", desc: "Klassisch, sweet potato, beef & cheese. Plus dicke Shakes." },
              { title: "Retro", subtitle: "Diner Vibes", desc: "Pinke Wände, Neonlicht, US-Plates. Ein Look, der auffällt." },
            ].map((u, i) => (
              <div key={i} className={`fade-in-up stagger-${i+1} text-center group`}>
                <div className="relative inline-block">
                  <div className="w-32 h-32 mx-auto mb-5 rounded-full bg-gradient-to-br from-bs-pink-cream to-bs-cyan-cream border-3 border-bs-ink flex flex-col items-center justify-center shadow-[5px_5px_0_var(--bs-ink)] group-hover:rotate-6 transition-transform" style={{borderWidth: "3px"}}>
                    <span className="text-display text-2xl text-bs-pink leading-none">{u.title}</span>
                    <span className="text-subhead text-base text-bs-ink leading-none mt-1">{u.subtitle}</span>
                  </div>
                </div>
                <p className="text-bs-ink/75 leading-relaxed max-w-xs mx-auto">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== MENU ============== */}
      <section id="menu" className="py-20 md:py-28 bg-bs-cream relative">
        <div className="container">
          <div className="text-center mb-10">
            <span className="badge-neon badge-pink-fill">UNSERE KARTE</span>
            <h2 className="text-headline text-5xl md:text-6xl lg:text-7xl text-bs-ink mt-4">
              DAS <span className="neon-text-pink">MENÜ</span>
            </h2>
            <p className="text-bs-ink/70 mt-4">Alle Preise in EUR. Allergene auf Anfrage.</p>
          </div>

          {/* Tabs */}
          <div className="menu-tabs justify-center md:justify-center mb-10 max-w-4xl mx-auto">
            {Object.keys(menu).map((k) => (
              <button
                key={k}
                onClick={() => setTab(k as keyof typeof menu)}
                className={`menu-tab ${tab === k ? "active" : ""}`}
              >
                {tabLabels[k]}
              </button>
            ))}
          </div>

          {/* Items */}
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-4">
            {menu[tab].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border-2 border-bs-ink p-5 shadow-[4px_4px_0_var(--bs-ink)] hover:shadow-[6px_6px_0_var(--bs-pink)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-subhead text-lg text-bs-ink">{item.name}</h4>
                      {item.tags?.map((t) => (
                        <span key={t} className="badge-neon badge-yellow-fill text-[10px]">{t}</span>
                      ))}
                    </div>
                  </div>
                  <span className="text-headline text-2xl neon-text-pink whitespace-nowrap">{item.price}€</span>
                </div>
                {item.desc && <p className="text-sm text-bs-ink/70 leading-relaxed">{item.desc}</p>}
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-sm text-bs-ink/60 mb-4">Vor Ort bestellen — keine Online-Bestellung verfügbar.</p>
            <div className="inline-flex flex-wrap justify-center gap-3">
              <a href={MAPS} target="_blank" rel="noopener noreferrer" className="btn-cyan btn-sm">
                <MapPin size={16}/> Vorbeikommen
              </a>
              <a href={PHONE} className="btn-pink btn-sm">
                <Phone size={16}/> Anrufen
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============== REVIEWS ============== */}
      <section className="py-20 md:py-24 bg-bs-cyan-cream">
        <div className="container">
          <div className="text-center mb-12">
            <span className="badge-neon badge-pink-fill">DAS SAGT LEER</span>
            <h2 className="text-headline text-4xl md:text-5xl lg:text-6xl text-bs-ink mt-4">
              FRISCH ERÖFFNET —<br/>ERSTE STIMMEN FOLGEN.
            </h2>
            <p className="text-bs-ink/75 mt-5 max-w-2xl mx-auto">
              Burger Station hat im Mai 2025 in Leer eröffnet. Echte Google-Bewertungen werden hier eingebunden, sobald sie eingehen — keine Fake-Reviews, keine erfundenen Stimmen.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: "Authentic Smash Burgers",
                text: "Doppeltes Beef, knackig gesmasht, geschmolzener Cheddar. Genau so, wie Smash Burger sein müssen.",
                tag: "Was wir machen",
              },
              {
                title: "Halal & Handmade",
                text: "Patties täglich frisch geformt, Fleisch transparent halal. Kein Marketing — nur Standard.",
                tag: "Was uns wichtig ist",
              },
              {
                title: "Mehr als Essen",
                text: "Pinke Wände, Neonlicht, Diner-Vibes. Gäste kommen für den Burger, bleiben für die Atmosphäre.",
                tag: "Was du erlebst",
              },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-2xl border-2 border-bs-ink p-6 shadow-[5px_5px_0_var(--bs-ink)]">
                <span className="badge-neon badge-cyan-fill">{card.tag}</span>
                <h3 className="text-subhead text-xl text-bs-ink mt-4 mb-3">{card.title}</h3>
                <p className="text-bs-ink/80 leading-relaxed">{card.text}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href="https://www.google.com/search?q=Burger+Station+Leer+Bahnhofsring+30"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost-ink btn-sm"
            >
              <Star size={16}/> Auf Google bewerten
            </a>
          </div>
        </div>
      </section>

      {/* ============== INSTAGRAM ============== */}
      <section className="py-20 md:py-24 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center mb-12">
            <div>
              <span className="badge-neon badge-yellow-fill">@BURGERSTATIONLEER</span>
              <h2 className="text-headline text-5xl md:text-6xl lg:text-7xl text-bs-ink mt-4">
                Dein nächster <span className="neon-text-pink">Foodspot</span> in Leer.
              </h2>
              <p className="text-lg text-bs-ink/75 mt-5 leading-relaxed">
                Burger, Neonlicht, Behind-the-Scenes. Folge uns für Aktionen, neue Menüs und den ehrlichsten Blick hinter die Theke.
              </p>
              <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="btn-pink mt-6 inline-flex">
                <Instagram size={18}/> Auf Instagram folgen
              </a>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { src: "/burgers/double-smash.svg", alt: "Double Smash Burger" },
                { src: "/patterns/interior-1.svg", alt: "Pinke Wand mit Neon" },
                { src: "/burgers/shake.svg", alt: "Chocolate Shake" },
                { src: "/patterns/interior-3.svg", alt: "Storefront bei Nacht" },
                { src: "/burgers/long-chili-cheese.svg", alt: "Long Chili Cheese" },
                { src: "/burgers/fries.svg", alt: "Fries im Karton" },
              ].map((p, i) => (
                <a
                  key={i}
                  href={INSTAGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square rounded-xl border-2 border-bs-ink overflow-hidden shadow-[3px_3px_0_var(--bs-ink)] hover:shadow-[5px_5px_0_var(--bs-pink)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all bg-pink-50"
                >
                  <img src={p.src} alt={p.alt} className="w-full h-full object-cover"/>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============== STANDORT ============== */}
      <section id="standort" className="py-20 md:py-28 bg-bs-pink-cream relative overflow-hidden">
        <div className="container">
          <div className="text-center mb-12">
            <span className="badge-neon badge-cyan-fill">UNSER STANDORT</span>
            <h2 className="text-headline text-5xl md:text-6xl lg:text-7xl text-bs-ink mt-4">
              FIND <span className="neon-text-pink">US</span>.
            </h2>
          </div>

          <div className="grid lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {/* Map */}
            <div className="lg:col-span-3 retro-card overflow-hidden aspect-[4/3] lg:aspect-auto">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=7.4505%2C53.2275%2C7.4665%2C53.2375&amp;layer=mapnik&amp;marker=53.2325%2C7.4585"
                className="w-full h-full min-h-[400px] border-0"
                loading="lazy"
                title="Burger Station Standort Leer Bahnhofsring 30"
              ></iframe>
            </div>

            {/* Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="retro-card-pink p-6">
                <div className="flex items-start gap-3 mb-2">
                  <MapPin size={22} className="text-bs-pink mt-1 shrink-0"/>
                  <div>
                    <h3 className="text-subhead text-xl text-bs-ink">Adresse</h3>
                    <p className="text-bs-ink/85 mt-1 leading-relaxed">
                      Bahnhofsring 30<br/>
                      26789 Leer<br/>
                      Niedersachsen
                    </p>
                  </div>
                </div>
                <a href={MAPS} target="_blank" rel="noopener noreferrer" className="btn-pink btn-sm w-full mt-3">
                  Route starten
                </a>
              </div>

              <div className="retro-card-cyan p-6">
                <div className="flex items-start gap-3">
                  <Clock size={22} className="text-bs-cyan mt-1 shrink-0" strokeWidth={2.5}/>
                  <div>
                    <h3 className="text-subhead text-xl text-bs-ink">Öffnungszeiten</h3>
                    <div className="mt-3 space-y-1.5 text-bs-ink/85 font-medium">
                      <div className="flex justify-between gap-4"><span>So – Do</span><span className="font-body font-bold tracking-wider">11:00 – 23:00</span></div>
                      <div className="flex justify-between gap-4"><span>Fr & Sa</span><span className="font-body font-bold tracking-wider">11:00 – 02:00</span></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border-2 border-bs-ink p-6 shadow-[4px_4px_0_var(--bs-ink)]">
                <div className="flex items-start gap-3">
                  <Phone size={22} className="text-bs-ink mt-1 shrink-0"/>
                  <div>
                    <h3 className="text-subhead text-xl text-bs-ink">Telefon</h3>
                    <a href={PHONE} className="text-lg font-medium text-bs-ink hover:text-bs-pink transition mt-1 block">
                      {PHONE_DISPLAY}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== KONTAKT ============== */}
      <section id="kontakt" className="py-20 md:py-28 bg-bs-ink text-white relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 stripes-yellow-black h-4"></div>
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-bs-pink opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-bs-cyan opacity-20 blur-3xl"></div>

        <div className="container relative text-center max-w-3xl mx-auto">
          <Flame size={48} className="text-bs-yellow mx-auto mb-4"/>
          <h2 className="text-display text-6xl md:text-8xl">
            LUST AUF <span className="neon-text-pink">BURGER</span>?
          </h2>
          <p className="text-xl text-white/80 mt-6 leading-relaxed">
            Ruf an. Komm vorbei. Folg uns. So einfach.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <a href={PHONE} className="btn-pink pulse-pink">
              <Phone size={18}/> {PHONE_DISPLAY}
            </a>
            <a href={MAPS} target="_blank" rel="noopener noreferrer" className="btn-cyan">
              <MapPin size={18}/> Route starten
            </a>
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="btn-ghost-ink" style={{color: "white", borderColor: "white"}}>
              <Instagram size={18}/> Instagram
            </a>
          </div>
        </div>
      </section>

      {/* ============== FOOTER ============== */}
      <footer className="bg-bs-pink-cream border-t-4 border-bs-ink">
        <div className="checker-strip-pink"></div>
        <div className="container py-14">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src="/brand/mark.svg" alt="Burger Station" className="w-14 h-14"/>
                <div>
                  <div className="text-subhead text-2xl text-bs-ink">BURGER STATION</div>
                  <div className="text-label-caps text-xs text-bs-pink">Est. 2025 · Leer</div>
                </div>
              </div>
              <p className="text-bs-ink/75 leading-relaxed max-w-md">
                Authentic Smash Burgers, Halal & Handmade. American Retro Diner direkt am Bahnhofsring in Leer.
              </p>
              <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 font-body font-semibold tracking-wide text-bs-ink hover:text-bs-pink transition">
                <Instagram size={18}/> @burgerstationleer
              </a>
            </div>

            <div>
              <h4 className="text-label-caps text-bs-ink mb-4">FINDEN</h4>
              <p className="text-bs-ink/80 text-sm leading-relaxed mb-3">
                Bahnhofsring 30<br/>
                26789 Leer
              </p>
              <a href={MAPS} target="_blank" rel="noopener noreferrer" className="text-sm text-bs-pink font-semibold hover:underline">
                Route starten →
              </a>
            </div>

            <div>
              <h4 className="text-label-caps text-bs-ink mb-4">KONTAKT</h4>
              <a href={PHONE} className="text-bs-ink/80 text-sm hover:text-bs-pink transition block mb-2">{PHONE_DISPLAY}</a>
              <p className="text-bs-ink/60 text-xs leading-relaxed">
                So–Do: 11–23 Uhr<br/>
                Fr&Sa: 11–02 Uhr
              </p>
            </div>
          </div>

          <div className="pt-6 border-t-2 border-dashed border-bs-ink/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-bs-ink/60">© 2026 Burger Station Leer. Alle Rechte vorbehalten.</p>
            <div className="flex gap-5 text-sm">
              <a href="/impressum" className="text-bs-ink/70 hover:text-bs-pink transition">Impressum</a>
              <a href="/datenschutz" className="text-bs-ink/70 hover:text-bs-pink transition">Datenschutz</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ============== STICKY MOBILE CTA ============== */}
      <div className="sticky-cta">
        <a href="#menu" className="btn-pink btn-sm">Menü</a>
        <a href={MAPS} target="_blank" rel="noopener noreferrer" className="btn-cyan btn-sm">
          <MapPin size={14}/> Route
        </a>
        <a href={PHONE} className="btn-pink btn-sm pulse-pink">
          <Phone size={14}/> Anruf
        </a>
      </div>
      <div className="h-20 md:h-0" aria-hidden="true"></div>
    </div>
  );
}
