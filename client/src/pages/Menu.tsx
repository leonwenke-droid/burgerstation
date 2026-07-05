import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Check, Egg, Fish, Milk, Nut, Phone, MapPin, Plus, Wheat } from "lucide-react";
import { cartItemFromProduct, useCart } from "@/contexts/CartContext";
import {
  formatProductPrice,
  getProductsByCategory,
  isSumUpLinked,
  requiresSumUpForDelivery,
  type Product,
  type ProductAllergen,
} from "@shared/products";

const ALLERGEN_ICONS: Record<
  ProductAllergen,
  { icon: React.ComponentType<{ size?: number; className?: string }>; label: string }
> = {
  gluten:  { icon: Wheat, label: "Gluten (Weizen)" },
  lactose: { icon: Milk,  label: "Laktose (Milch)" },
  egg:     { icon: Egg,   label: "Eier" },
  fish:    { icon: Fish,  label: "Fisch" },
  nuts:    { icon: Nut,   label: "Nüsse" },
};

const PHONE = "tel:+4949199755279";
const MAPS =
  "https://www.google.com/maps/search/?api=1&query=Burger+Station+Bahnhofsring+30+26789+Leer";

const BEEF = getProductsByCategory("Smash Burgers");
const CHICKEN = getProductsByCategory("Chicken Burgers");
const VEGAN = getProductsByCategory("Vegan");
const SIDES = getProductsByCategory("Sides & Snacks");
const SHAKES_AND_DRINKS = getProductsByCategory("Shakes & Drinks");
const SAUCES = getProductsByCategory("Sauces");

function CheckerDivider() {
  return (
    <div
      className="h-4 w-full my-10 border-y-4 border-bs-ink"
      style={{
        backgroundImage:
          "linear-gradient(45deg, #006a62 25%, transparent 25%, transparent 75%, #006a62 75%, #006a62), linear-gradient(45deg, #006a62 25%, #fefccf 25%, #fefccf 75%, #006a62 75%, #006a62)",
        backgroundSize: "16px 16px",
        backgroundPosition: "0 0, 8px 8px",
      }}
      aria-hidden="true"
    />
  );
}

function CategoryHeader({
  title,
  accent,
}: {
  title: string;
  accent: "primary" | "yellow" | "cyan";
}) {
  const bg =
    accent === "primary"
      ? "bg-bs-teal text-white"
      : accent === "yellow"
        ? "bg-bs-yellow text-bs-ink"
        : "bg-bs-primary-c text-bs-ink";

  return (
    <div className="flex items-center gap-3 mb-8">
      <h2
        className={`text-headline text-3xl md:text-4xl px-4 py-2 border-3 border-bs-ink shadow-[4px_4px_0_var(--bs-ink)] inline-block uppercase ${bg}`}
        style={{ borderWidth: "3px" }}
      >
        {title}
      </h2>
    </div>
  );
}

function BurgerCard({ item }: { item: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const orderBlocked = requiresSumUpForDelivery(item) && !isSumUpLinked(item);

  function handleAdd() {
    if (orderBlocked) return;
    addItem(cartItemFromProduct(item));
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className="bg-white border-[3px] border-bs-ink rounded-2xl overflow-visible relative flex flex-col shadow-[3px_3px_0_var(--bs-ink)] md:shadow-[6px_6px_0_var(--bs-ink)] group hover:-translate-y-1 transition-transform duration-300">
      {item.badge && (
        <div className="absolute -top-4 -right-4 bg-bs-yellow text-bs-ink text-label-caps w-16 h-16 rounded-full flex items-center justify-center border-[3px] border-bs-ink rotate-12 z-10 shadow-[3px_3px_0_var(--bs-ink)] text-[11px] font-bold uppercase leading-none text-center">
          {item.badge}
        </div>
      )}
      {item.image && (
        <div className="h-44 w-full border-b-[3px] border-bs-ink overflow-hidden bg-bs-peach rounded-t-2xl">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-5 flex-1 flex flex-col gap-2">
        <h3 className="text-subhead text-xl text-bs-ink">{item.name}</h3>
        {item.description && (
          <p className="text-sm text-bs-ink/70 leading-relaxed flex-1">
            {item.description}
          </p>
        )}
        {item.allergens && item.allergens.length > 0 && (
          <div className="flex items-center gap-2 pt-1">
            {item.allergens.map((a) => {
              const al = ALLERGEN_ICONS[a];
              const Icon = al.icon;
              return (
                <span
                  key={a}
                  title={al.label}
                  aria-label={al.label}
                  className="text-bs-ink/35 hover:text-bs-ink-v transition-colors cursor-help"
                >
                  <Icon size={13} />
                </span>
              );
            })}
          </div>
        )}
      </div>
      {/* Price + cart */}
      <div className="px-5 pb-5 flex flex-col gap-2">
        <div className="flex justify-center">
          <div
            className="bg-bs-yellow text-bs-ink border-2 border-bs-ink px-5 py-2 shadow-[3px_3px_0_var(--bs-ink)] inline-block"
            style={{ borderRadius: "4px" }}
          >
            <span className="font-body font-bold text-lg tracking-wider">
              {formatProductPrice(item.price)} €
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={orderBlocked}
          className={`w-full py-2.5 rounded-xl border-[3px] border-bs-ink font-body font-bold text-sm tracking-wide transition-all shadow-[3px_3px_0_var(--bs-ink)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 ${
            orderBlocked
              ? "bg-bs-cream text-bs-ink/40 cursor-not-allowed opacity-70 shadow-none translate-x-0 translate-y-0"
              : added
                ? "bg-bs-teal text-white"
                : "bg-bs-yellow text-bs-ink"
          }`}
        >
          {orderBlocked ? "Bald online bestellbar" : added ? "✓ Hinzugefügt!" : "In den Warenkorb"}
        </button>
      </div>
    </div>
  );
}

function HorizontalCard({ item }: { item: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(cartItemFromProduct(item));
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className="bg-white border-2 border-bs-ink rounded-xl overflow-visible relative flex flex-row items-center p-4 shadow-[4px_4px_0_var(--bs-ink)] gap-4 group hover:-translate-y-1 transition-transform duration-300">
      {item.badge && (
        <div className="absolute -top-3 -right-3 bg-bs-yellow text-bs-ink text-label-caps w-12 h-12 rounded-full flex items-center justify-center border-2 border-bs-ink rotate-12 z-10 shadow-[2px_2px_0_var(--bs-ink)] text-[10px] font-bold uppercase leading-none text-center">
          {item.badge}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="text-subhead text-lg text-bs-ink mb-0.5">
          {item.name}
        </h3>
        {item.description && (
          <p className="text-sm text-bs-ink/70 leading-relaxed">{item.description}</p>
        )}
        {item.allergens && item.allergens.length > 0 && (
          <div className="flex items-center gap-1.5 mt-1">
            {item.allergens.map((a) => {
              const al = ALLERGEN_ICONS[a];
              const Icon = al.icon;
              return (
                <span
                  key={a}
                  title={al.label}
                  aria-label={al.label}
                  className="text-bs-ink/35 hover:text-bs-ink-v transition-colors cursor-help"
                >
                  <Icon size={12} />
                </span>
              );
            })}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div
          className="bg-bs-yellow text-bs-ink border-2 border-bs-ink px-3 py-1.5 shadow-[2px_2px_0_var(--bs-ink)] whitespace-nowrap"
          style={{ borderRadius: "4px" }}
        >
          <span className="font-body font-bold tracking-wider">
            {formatProductPrice(item.price)} €
          </span>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          aria-label={`${item.name} in den Warenkorb`}
          className={`w-9 h-9 rounded-full border-2 border-bs-ink flex items-center justify-center shadow-[2px_2px_0_var(--bs-ink)] transition-all hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 ${
            added ? "bg-bs-teal text-white" : "bg-bs-primary-c text-bs-ink"
          }`}
        >
          {added ? <Check size={14} /> : <Plus size={14} />}
        </button>
      </div>
    </div>
  );
}

function ShakeCard({ item }: { item: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(cartItemFromProduct(item));
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className="bg-white border-2 border-bs-ink rounded-full px-4 pt-4 pb-5 flex flex-col items-center shadow-[4px_4px_0_var(--bs-ink)] group hover:-translate-y-1 transition-transform duration-300 text-center">
      <h3 className="text-subhead text-lg text-bs-ink mt-2">{item.name}</h3>
      {item.description && (
        <p className="text-xs text-bs-ink/60 mt-1">{item.description}</p>
      )}
      <div className="mt-3 bg-bs-cyan text-bs-ink border-2 border-bs-ink px-4 py-1.5 rounded-full shadow-[2px_2px_0_var(--bs-ink)]">
        <span className="font-body font-bold tracking-wider">
          {formatProductPrice(item.price)} €
        </span>
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className={`mt-2.5 w-[calc(100%-2rem)] py-2 rounded-full border-2 border-bs-ink font-body font-bold text-xs tracking-wide transition-all shadow-[2px_2px_0_var(--bs-ink)] hover:shadow-none ${
          added ? "bg-bs-teal text-white" : "bg-bs-yellow text-bs-ink"
        }`}
      >
        {added ? "✓" : "+ Warenkorb"}
      </button>
      {item.allergens && item.allergens.length > 0 && (
        <div className="flex items-center gap-1.5 mt-2 justify-center">
          {item.allergens.map((a) => {
            const al = ALLERGEN_ICONS[a];
            const Icon = al.icon;
            return (
              <span
                key={a}
                title={al.label}
                aria-label={al.label}
                className="text-bs-ink/30 hover:text-bs-ink-v transition-colors cursor-help"
              >
                <Icon size={12} />
              </span>
            );
          })}
        </div>
      )}
      {/* Reserve space so cards without allergens stay the same height */}
      {(!item.allergens || item.allergens.length === 0) && (
        <div className="mt-2 h-[20px]" aria-hidden="true" />
      )}
    </div>
  );
}

export default function Menu() {
  return (
    <div className="min-h-screen bg-bs-cream text-bs-ink overflow-x-hidden">
      <Header />

      <main className="w-full pb-20">
        {/* Page header */}
        <section className="w-full pt-16 pb-8 px-4 max-w-7xl mx-auto flex justify-center">
          <div className="text-center relative">
            <div className="inline-block px-3 py-1 bg-bs-yellow border-2 border-bs-ink rounded-full shadow-[2px_2px_0_var(--bs-ink)] -rotate-2 mb-4">
              <span className="text-label-caps text-bs-ink uppercase">
                100% Halal · Handmade Daily
              </span>
            </div>
            <h1 className="text-display text-5xl sm:text-6xl md:text-8xl text-bs-ink uppercase relative">
              DIE KARTE
              <div className="absolute -top-3 -right-8 md:-right-12 bg-bs-yellow text-bs-ink text-label-caps px-3 py-1 rounded-full border-2 border-bs-ink rotate-12 shadow-[2px_2px_0_var(--bs-ink)] text-xs font-bold uppercase hidden md:block">
                FRISCH!
              </div>
            </h1>
            <p className="text-lg text-bs-ink/70 mt-3 max-w-xl mx-auto leading-relaxed">
              Smash Burgers, Fries &amp; Shakes — <strong className="text-bs-ink">online bestellen, liefern lassen oder abholen.</strong> Direkt am Bahnhofsring in Leer. Alle Preise in EUR.
            </p>
          </div>
        </section>

        <CheckerDivider />

        <div className="max-w-7xl mx-auto px-4 flex flex-col gap-0">
          {/* BEEF BURGERS */}
          <section>
            <CategoryHeader title="Beef Burgers" accent="primary" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-2">
              {BEEF.map((item) => (
                <BurgerCard key={item.sku} item={item} />
              ))}
            </div>
          </section>

          <CheckerDivider />

          {/* CHICKEN */}
          <section>
            <CategoryHeader title="Chicken Burgers" accent="yellow" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CHICKEN.map((item) => (
                <BurgerCard key={item.sku} item={item} />
              ))}
            </div>
          </section>

          <CheckerDivider />

          {/* VEGAN */}
          <section>
            <CategoryHeader title="Vegan" accent="cyan" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              {VEGAN.map((item) => (
                <BurgerCard key={item.sku} item={item} />
              ))}
            </div>
          </section>

          <CheckerDivider />

          {/* SIDES */}
          <section>
            <CategoryHeader title="Sides & Snacks" accent="yellow" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SIDES.map((item) => (
                <HorizontalCard key={item.sku} item={item} />
              ))}
            </div>
          </section>

          <CheckerDivider />

          {/* SHAKES & DRINKS */}
          <section>
            <CategoryHeader title="Shakes & Drinks" accent="cyan" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              {SHAKES_AND_DRINKS.map((item) => (
                <ShakeCard key={item.sku} item={item} />
              ))}
            </div>
          </section>

          <CheckerDivider />

          {/* SAUCES */}
          <section>
            <CategoryHeader title="Sauces" accent="primary" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {SAUCES.map((item) => (
                <div
                  key={item.sku}
                  className="bg-white border-2 border-bs-ink rounded-xl p-4 shadow-[3px_3px_0_var(--bs-ink)] text-center group hover:-translate-y-0.5 transition-transform"
                >
                  <h3 className="text-subhead text-base text-bs-ink mb-2">
                    {item.name}
                  </h3>
                  <span className="font-body font-bold text-sm text-bs-teal">
                    {formatProductPrice(item.price)} €
                  </span>
                </div>
              ))}
            </div>
          </section>

          <CheckerDivider />

          {/* Bottom CTA */}
          <section className="text-center py-4">
            <div className="relative overflow-hidden rounded-3xl border-[4px] border-bs-ink shadow-[6px_6px_0_var(--bs-ink)] md:shadow-[12px_12px_0_var(--bs-ink)] max-w-3xl mx-auto checker-teal">
              <div className="absolute inset-0 bg-bs-cream/80 backdrop-blur-sm" aria-hidden="true"></div>
              <div className="relative z-10 bg-bs-peach border-[4px] border-bs-ink rounded-2xl m-4 p-8 md:p-12 shadow-[3px_3px_0_var(--bs-ink)] md:shadow-[6px_6px_0_var(--bs-ink)]">
                <span className="badge-neon badge-yellow-fill">LIEFERUNG · ABHOLUNG · VOR ORT</span>
                <h2 className="text-display text-3xl sm:text-4xl md:text-6xl text-bs-ink mt-4 mb-3 drop-shadow-[2px_2px_0px_#006a62] md:drop-shadow-[3px_3px_0px_#006a62]">
                  BESTELL DIR WAS.
                </h2>
                <p className="text-bs-ink-v text-lg leading-relaxed mb-8">
                  Leg deine Favoriten in den Warenkorb — wir liefern nach Leer &amp; Umgebung
                  oder du holst am Bahnhofsring 30 ab. Lieber vor Ort essen? Komm im Diner vorbei.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <a href={MAPS} target="_blank" rel="noopener noreferrer" className="btn-cyan">
                    <MapPin size={18} /> Route starten
                  </a>
                  <a href={PHONE} className="btn-ghost-ink">
                    <Phone size={18} /> Anrufen
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />

      {/* Sticky mobile CTA */}
      <div className="sticky-cta is-visible">
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
        <a href="/" className="btn-ghost-ink btn-sm">
          Home
        </a>
      </div>
      <div className="h-20 md:h-0" aria-hidden="true"></div>
    </div>
  );
}
