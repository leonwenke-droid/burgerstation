import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Phone, MapPin, Instagram, ChevronRight, Clock, Flame, Truck, ShoppingBag, Check, Plus, ClipboardList } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { cartItemFromProduct, useCart } from "@/contexts/CartContext";
import { formatProductPrice, isSumUpLinked, requireProduct, requiresSumUpForDelivery, type Product } from "@shared/products";

const PHONE = "tel:+4949199755279";
const PHONE_DISPLAY = "0491 99 755 279";
const MAPS = "https://www.google.com/maps/search/?api=1&query=Burger+Station+Bahnhofsring+30+26789+Leer";
const INSTAGRAM = "https://instagram.com/burgerstationleer";

// Product facts come from the shared catalog; this list contains presentation only.
const BESTSELLERS = [
  {
    ...requireProduct("DBL-SMSH-002"),
    tag: "Cheesy",
    plateLabel: "TOP SELLER",
    plateBg: "var(--bs-primary-f)",
  },
  {
    ...requireProduct("LCC-SMSH-003"),
    tag: "Jalapeños",
    plateLabel: "SPICY PICK",
    plateBg: "var(--bs-peach)",
  },
  {
    ...requireProduct("BBQ-SMSH-004"),
    tag: "Bacon",
    plateLabel: "SMOKY",
    plateBg: "var(--bs-yellow)",
  },
  {
    ...requireProduct("CRS-SMSH-005"),
    tag: "Handmade",
    plateLabel: "SIGNATURE",
    plateBg: "var(--bs-primary-f)",
  },
];

/** Thick, tactile retro "add to cart" button used on the homepage bestseller cards. */
function AddToCartButton({ item }: { item: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const orderBlocked = requiresSumUpForDelivery(item) && !isSumUpLinked(item);

  function handleAdd() {
    if (orderBlocked) return;
    addItem(cartItemFromProduct(item));
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={orderBlocked}
      aria-label={orderBlocked ? `${item.name} bald online bestellbar` : `${item.name} in den Warenkorb legen`}
      className={`press-scale w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl border-[3px] border-bs-ink font-body font-bold text-sm tracking-wide uppercase shadow-[3px_3px_0_var(--bs-ink)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all ${
        orderBlocked
          ? "bg-bs-cream text-bs-ink/40 cursor-not-allowed opacity-70 shadow-none translate-x-0 translate-y-0"
          : added
            ? "bg-bs-teal text-white"
            : "bg-bs-yellow text-bs-ink"
      }`}
    >
      {orderBlocked ? (
        <>Bald online</>
      ) : added ? (
        <><Check size={16} /> Im Warenkorb</>
      ) : (
        <><Plus size={16} /> In den Warenkorb</>
      )}
    </button>
  );
}

const REASONS = [
  {
    lines: ["Handmade", "Smash Burger"],
    description: "Frisch gesmasht, heiß serviert. Kein TK-Standard, kein liebloser Burger.",
  },
  {
    lines: ["100%", "Halal"],
    description: "Klar kommuniziert, bewusst gewählt — ohne versteckte Kompromisse.",
  },
  {
    lines: ["Fries", "& Shakes"],
    description: "Crispy Fries, Cheese Fries, Sweet Potato Fries und dicke Shakes.",
  },
  {
    lines: ["Retro", "Diner Vibes"],
    description: "Checkerboard, Diner-Look und ein Laden, der im Kopf bleibt.",
  },
] as const;

function ReasonItem({
  lines,
  description,
}: {
  lines: readonly [string, string];
  description: string;
}) {
  return (
    <article className="reason-item">
      <div className="reason-sticker" aria-label={lines.join(" ")}>
        <div className="reason-sticker-copy" aria-hidden="true">
          <span className="reason-sticker-lead">{lines[0]}</span>
          <span className="reason-sticker-detail">{lines[1]}</span>
        </div>
      </div>
      <p className="reason-description">{description}</p>
    </article>
  );
}

export default function Home() {
  const reduce = useReducedMotion();
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    const heroActions = document.querySelector("[data-hero-actions]");
    if (!heroActions || !("IntersectionObserver" in window)) {
      setShowStickyCta(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyCta(!entry.isIntersecting),
      { threshold: 0.15 },
    );

    observer.observe(heroActions);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-bs-cream text-bs-ink overflow-x-hidden">
      <Header />

      {/* ════════════════════ HERO ════════════════════ */}
      <section id="top" className="hero-shell">
        {/* Subtle halftone depth behind the whole hero */}
        <div className="halftone absolute inset-0 pointer-events-none" aria-hidden="true"></div>

        <div className="container relative z-10">
          <div className="hero-layout">

            {/* Left — Copy */}
            <div className="hero-copy">
              <div className="hero-label fade-in-up">
                <Truck size={15} className="text-bs-teal shrink-0" aria-hidden="true" />
                LIEFERUNG &amp; ABHOLUNG IN LEER
              </div>

              <h1 className="hero-title">
                <span className="hero-title-line hero-title-ink fade-in-up stagger-1">
                  SMASH BURGER
                </span>
                <span className="hero-title-line hero-title-teal fade-in-up stagger-2">
                  IN LEER
                </span>
                <span className="hero-subline fade-in-up stagger-3">
                  Geliefert oder direkt im Diner.
                </span>
              </h1>

              <p className="hero-description fade-in-up stagger-3">
                Smash Burger, Fries &amp; Shakes — halal, handmade und heiß. Zu dir nach Hause oder direkt am Bahnhofsring 30.
              </p>

              <div className="hero-actions fade-in-up stagger-4" data-hero-actions>
                <Link href="/menu" className="btn-pink hero-primary-action">
                  <ShoppingBag size={18} /> Jetzt bestellen
                </Link>
                <div className="hero-secondary-actions">
                  <a href={MAPS} target="_blank" rel="noopener noreferrer" className="btn-cyan">
                    <MapPin size={18} /> Route
                  </a>
                  <a href={PHONE} className="btn-ghost-ink">
                    <Phone size={18} /> Anrufen
                  </a>
                </div>
              </div>

              <div className="hero-trust fade-in-up stagger-5">
                <span className="badge-neon badge-cyan-fill inline-flex items-center gap-1">
                  <Truck size={12} /> Lieferung in Leer
                </span>
                <span className="badge-neon badge-pink-fill">100% Halal</span>
                <span className="badge-neon badge-yellow-fill">Handmade Daily</span>
                <span className="badge-neon bg-white text-bs-ink inline-flex items-center gap-1">
                  <MapPin size={12} className="text-bs-teal" /> Bahnhofsring 30
                </span>
              </div>
            </div>

            {/* Right — Hero image with layered diner depth */}
            <div className="hero-visual fade-in-up stagger-2">
              {/* Slow-spinning dashed diner-plate ring (depth, decorative) */}
              <div
                className="hero-plate-ring spin-slow"
                aria-hidden="true"
              ></div>
              {/* Offset solid disc — hard-shadow depth in brand style */}
              <div
                className="hero-plate-backdrop"
                aria-hidden="true"
              ></div>
              {/* Circular framed image — floats gently */}
              <div className="hero-burger-frame float-anim">
                <img
                  src="/images/menu/hero-burger.png"
                  alt="Saftiger Double Smash Burger mit geschmolzenem Cheddar, Bacon und frischem Salat"
                  width={440}
                  height={440}
                  fetchPriority="high"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Die-cut wobbling price sticker */}
              <div
                className="hero-price sticker-wobble"
                style={{ ["--wobble-base" as string]: "11deg" }}
              >
                {/* dashed die-cut inner ring */}
                <span className="absolute inset-1.5 rounded-full border-2 border-dashed border-bs-ink/50" aria-hidden="true"></span>
                <span className="text-[0.65rem] tracking-widest text-bs-ink font-bold uppercase leading-none">AB</span>
                <span className="hero-price-value">6,90</span>
                <span className="text-[0.65rem] tracking-widest mt-0.5 text-bs-ink font-bold uppercase leading-none">EURO</span>
              </div>

              {/* Mini "fresh smashed" sticker */}
              <div
                className="hero-fresh sticker-wobble"
                style={{ ["--wobble-base" as string]: "-6deg", animationDelay: "0.6s" }}
              >
                <Flame size={13} className="text-bs-yellow" aria-hidden="true" /> Fresh Smashed
              </div>
            </div>
          </div>
        </div>

        {/* Bottom teal checker strip */}
        <div className="checker-strip absolute bottom-0 inset-x-0" aria-hidden="true"></div>
      </section>

      {/* ════════════════════ TICKER ════════════════════ */}
      <section
        className="ticker-pausable border-y-4 border-bs-ink overflow-hidden relative"
        style={{
          backgroundImage: "linear-gradient(45deg,#006a62 25%,transparent 25%,transparent 75%,#006a62 75%,#006a62),linear-gradient(45deg,#006a62 25%,#eceabe 25%,#eceabe 75%,#006a62 75%,#006a62)",
          backgroundSize: "16px 16px",
        }}
        aria-hidden="true"
      >
        <div className="bg-bs-surface-hi py-2.5 border-y-2 border-bs-ink">
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
                key={b.sku}
                className="card-tilt bg-white border-[3px] border-bs-ink rounded-xl flex flex-col shadow-[4px_4px_0_var(--bs-ink)] md:shadow-[8px_8px_0_var(--bs-ink)] relative group"
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
                    src={b.image}
                    alt={`${b.name} Smash Burger`}
                    width={400}
                    height={300}
                    loading="lazy"
                    className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.07] group-hover:-rotate-1"
                  />
                  <div className="absolute top-3 left-3 -rotate-3">
                    <span className="badge-neon badge-yellow-fill shadow-[2px_2px_0_var(--bs-ink)]">{b.badge}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col gap-2 bg-white">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-subhead text-xl text-bs-ink">{b.name}</h3>
                    <span className="text-[0.65rem] font-body font-bold uppercase tracking-wider text-bs-teal border-2 border-bs-teal/40 rounded-full px-2 py-0.5">
                      {b.tag}
                    </span>
                  </div>
                  <p className="text-sm text-bs-ink-v leading-relaxed flex-1">{b.description}</p>
                  <div className="flex items-center gap-3 pt-3 mt-1">
                    {/* Price sticker */}
                    <div className="shrink-0 bg-bs-yellow text-bs-ink border-2 border-bs-ink rounded-md px-3 py-1.5 shadow-[2px_2px_0_var(--bs-ink)] -rotate-1">
                      <span className="font-body font-black text-lg tracking-wide tabular-nums">{formatProductPrice(b.price)} €</span>
                    </div>
                    <AddToCartButton item={b} />
                  </div>
                </div>

                {/* License plate footer */}
                <div
                  className="w-full text-bs-ink text-label-caps text-[11px] border-t-[3px] border-bs-ink py-2 flex justify-center items-center tracking-[0.2em] font-bold uppercase rounded-b-xl shadow-[inset_0_2px_0_rgba(255,255,255,0.3)]"
                  style={{ background: b.plateBg }}
                >
                  {b.plateLabel}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/menu" className="btn-pink">
              <ShoppingBag size={18} /> Ganze Karte ansehen &amp; bestellen
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════ SO FUNKTIONIERT'S ════════════════════ */}
      <section className="py-20 md:py-24 bg-bs-surface-hi border-y-[3px] border-bs-ink relative overflow-hidden">
        <div className="halftone absolute inset-0 pointer-events-none" aria-hidden="true"></div>
        <div className="container relative">
          <RevealOnScroll>
            <div className="text-center mb-14">
              <span className="badge-neon badge-cyan-fill">SO EINFACH GEHT'S</span>
              <h2 className="text-headline text-4xl sm:text-5xl md:text-6xl text-bs-ink mt-4 uppercase">
                In 3 Schritten zum Burger.
              </h2>
              <p className="text-lg text-bs-ink-v mt-3 max-w-xl mx-auto leading-relaxed">
                Online bestellen und liefern lassen, abholen — oder direkt im Diner genießen.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {[
              { n: "1", icon: <ClipboardList size={34} strokeWidth={2} aria-hidden="true" />, title: "Burger auswählen", desc: "Stöber durch die Karte und leg deine Favoriten in den Warenkorb." },
              { n: "2", icon: <ShoppingBag size={34} strokeWidth={2} aria-hidden="true" />, title: "Bestellung abschicken", desc: "Adresse rein, Zahlart wählen, fertig — schnell und ohne Schnickschnack." },
              { n: "3", icon: <Truck size={34} strokeWidth={2} aria-hidden="true" />, title: "Liefern lassen oder abholen", desc: "Wir liefern nach Leer & Umgebung — oder du holst frisch am Bahnhofsring ab." },
            ].map((s, i) => (
              <div key={i} className="card-tilt retro-card p-7 pt-9 text-center relative">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-bs-teal text-white border-[3px] border-bs-ink flex items-center justify-center font-display font-black text-xl shadow-[3px_3px_0_var(--bs-ink)]">
                  {s.n}
                </div>
                <div className="mb-3 flex justify-center text-bs-teal">{s.icon}</div>
                <h3 className="text-subhead text-xl text-bs-ink mb-2">{s.title}</h3>
                <p className="text-bs-ink-v leading-relaxed text-sm">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/menu" className="btn-pink">
              <ShoppingBag size={18} /> Jetzt bestellen
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
      <section className="reason-section bg-bs-surface-hi">
        <div className="container">
          <RevealOnScroll>
            <div className="reason-heading text-center">
              <span className="badge-neon badge-cyan-fill">WARUM BURGER STATION?</span>
              <h2 className="text-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-bs-ink mt-4 uppercase">
                VIER GUTE GRÜNDE.
              </h2>
            </div>
          </RevealOnScroll>

          <div className="reason-grid">
            {REASONS.map((reason) => (
              <ReasonItem
                key={reason.lines.join("-")}
                lines={reason.lines}
                description={reason.description}
              />
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
                src="/images/foodspot/foodspot-2.png"
                alt="Cremiger Milkshake der Burger Station im Retro-Diner-Stil"
                width={400}
                height={400}
                loading="lazy"
                className="card-tilt rounded-2xl border-2 border-bs-ink shadow-[4px_4px_0_var(--bs-ink)] aspect-square object-contain w-full bg-transparent"
              />
              <img
                src="/images/foodspot/foodspot-3.png"
                alt="Burger Station Neon-Schild und Diner-Elemente"
                width={400}
                height={400}
                loading="lazy"
                className="card-tilt rounded-2xl border-2 border-bs-ink shadow-[4px_4px_0_var(--bs-teal)] aspect-square object-contain w-full mt-8 bg-transparent"
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
              <div key={i} className="card-tilt retro-card p-6">
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
                { src: "/images/menu/double-smash.png", alt: "Double Smash Burger" },
                { src: "/images/foodspot/foodspot-2.png", alt: "Burger Station Neon-Schild im Retro-Stil" },
                { src: "/images/foodspot/foodspot-1.png", alt: "Burger Station Milkshake im Retro-Stil" },
                { src: "/images/foodspot/foodspot-3.png", alt: "Burger Station Leuchtschild mit Diner-Elementen" },
                { src: "/images/menu/long-chili-cheese.png", alt: "Long Chili Cheese Burger" },
                { src: "/images/foodspot/foodspot-4.png", alt: "Burger Station Fries im Retro-Stil" },
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
                    width={300}
                    height={300}
                    loading="lazy"
                    className="w-full h-full object-contain transition-transform duration-500 ease-out hover:scale-105"
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
            <h2 className="text-display text-4xl sm:text-6xl md:text-7xl text-bs-ink uppercase drop-shadow-[2px_2px_0px_#006a62] md:drop-shadow-[4px_4px_0px_#006a62]">
              Bock auf Smash?
            </h2>
            <p className="text-xl text-bs-ink-v mt-6 leading-relaxed">
              Bestell online und lass dir liefern — oder schau im Diner am Bahnhofsring 30 vorbei.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-8">
              <Link href="/menu" className="btn-pink">
                <ShoppingBag size={18} /> Jetzt bestellen
              </Link>
              <a href={MAPS} target="_blank" rel="noopener noreferrer" className="btn-cyan">
                <MapPin size={18} /> Route starten
              </a>
              <a href={PHONE} className="btn-ghost-ink">
                <Phone size={18} /> {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      <Footer />

      {/* ════════════════════ STICKY MOBILE CTA — order-first ════════════════════ */}
      <div className={`sticky-cta ${showStickyCta ? "is-visible" : ""}`} aria-hidden={!showStickyCta}>
        <Link href="/menu" className="btn-pink btn-sm">
          <ShoppingBag size={14} /> Bestellen
        </Link>
        <a href={MAPS} target="_blank" rel="noopener noreferrer" className="btn-cyan btn-sm">
          <MapPin size={14} /> Route
        </a>
        <a href={PHONE} className="btn-ghost-ink btn-sm">
          <Phone size={14} /> Anruf
        </a>
      </div>
      <div className="h-20 md:h-0" aria-hidden="true"></div>
    </div>
  );
}
