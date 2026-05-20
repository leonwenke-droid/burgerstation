import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Check, Egg, Fish, Milk, Nut, Phone, MapPin, Plus, Wheat } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

type Allergen = "gluten" | "lactose" | "egg" | "fish" | "nuts";

const ALLERGEN_ICONS: Record<
  Allergen,
  { icon: React.ComponentType<{ size?: number; className?: string }>; label: string }
> = {
  gluten:  { icon: Wheat, label: "Gluten (Weizen)" },
  lactose: { icon: Milk,  label: "Laktose (Milch)" },
  egg:     { icon: Egg,   label: "Eier" },
  fish:    { icon: Fish,  label: "Fisch" },
  nuts:    { icon: Nut,   label: "Nüsse" },
};

const parsePrice = (s: string) => parseFloat(s.replace(",", "."));

const PHONE = "tel:+4949199755279";
const MAPS =
  "https://www.google.com/maps/search/?api=1&query=Burger+Station+Bahnhofsring+30+26789+Leer";

type MenuItem = {
  name: string;
  /** Exact name as entered in the SumUp item catalogue. Defaults to `name` when omitted. */
  sumup_name?: string;
  /** SumUp Artikelnummer (SKU) as shown in the dashboard, e.g. "DBL-SMSH-001". */
  sumup_sku?: string;
  /** SumUp Variant-ID from the official product CSV export. */
  variant_id?: string;
  price: string;
  desc?: string;
  badge?: string;
  allergens?: Allergen[];
};

const BEEF: MenuItem[] = [
  {
    name: "Single Smash",
    sumup_name: "Single Smash",
    price: "6,90",
    desc: "Brioche Bun, Single Beef Patty, Cheddar, Onion, Lettuce, Pickles, Burger Sauce",
    allergens: ["gluten", "lactose", "egg"],
  },
  {
    name: "Double Smash",
    sumup_name: "Double Smash",                              // ← SumUp Artikelname
    sumup_sku:  "DBL-SMSH-001",                              // ← Artikelnummer (SKU)
    variant_id: "7569a6cd-268f-4d16-b86f-09676f4dcfaa",     // ← Variant-ID aus CSV-Export
    price: "9,40",
    desc: "Doppeltes Beef Patty, geschmolzener Cheddar, Pickles, Burger Sauce",
    badge: "Top Seller",
    allergens: ["gluten", "lactose", "egg"],
  },
  {
    name: "Long Chili Cheese",
    sumup_name: "Long Chili Cheese",
    sumup_sku:  "LNG-CHI-002",
    variant_id: "42194cc3-fe98-4a6d-b5fa-04d333730d96",
    price: "11,90",
    desc: "Doppeltes Beef, Chili Cheese, Jalapeños, Burger Sauce",
    badge: "Spicy",
    allergens: ["gluten", "lactose", "egg"],
  },
  {
    name: "BBQ Smash",
    sumup_name: "BBQ Smash",
    price: "9,90",
    desc: "Beef Patty, Bacon, Cheddar, Onion Rings, BBQ Sauce",
    badge: "Smoky",
    allergens: ["gluten", "lactose", "egg"],
  },
  {
    name: "Croissant Smash",
    sumup_name: "Croissant Smash",
    price: "11,40",
    desc: "Croissant Bun, doppeltes Beef Patty, Cheddar, Burger Sauce",
    badge: "Signature",
    allergens: ["gluten", "lactose", "egg"],
  },
  {
    name: "Sucuk Burger",
    sumup_name: "Sucuk Burger",
    price: "8,90",
    desc: "Sucuk, Cheddar, Onion, Lettuce, Pickles, Garlic Sauce",
    allergens: ["gluten", "lactose"],
  },
];

const CHICKEN: MenuItem[] = [
  {
    name: "Classic Chicken",
    sumup_name: "Classic Chicken",
    price: "9,00",
    desc: "Knuspriges Chicken Patty, Buttermilk-Mariniert, Cheddar, Lettuce, Pickles, Burger Sauce",
    allergens: ["gluten", "egg"],
  },
  {
    name: "Garlic Chicken",
    sumup_name: "Garlic Chicken",
    price: "9,00",
    desc: "Chicken Patty, Cheddar, Garlic Sauce",
    allergens: ["gluten", "egg"],
  },
  {
    name: "Long Chicken",
    sumup_name: "Long Chicken",
    price: "11,50",
    desc: "Doppelt Chicken Patty, Cheddar, Lettuce, Onion, Pickles, Burger Sauce",
    allergens: ["gluten", "egg"],
  },
];

const VEGAN: MenuItem[] = [
  {
    name: "Vegan Burger",
    sumup_name: "Vegan Burger",
    price: "8,70",
    desc: "Vegan Patty, Lettuce, Onion, Pickles, Vegan Sauce",
    allergens: ["gluten"],
  },
  {
    name: "Falafel Burger",
    sumup_name: "Falafel Burger",
    price: "8,70",
    desc: "Hausgemachte Falafel, Lettuce, Onion, Pickles, Vegan Sauce",
    allergens: ["gluten"],
  },
];

const SIDES: MenuItem[] = [
  { name: "Fries", sumup_name: "Fries", price: "3,50", allergens: ["gluten"] },
  {
    name: "Beef & Cheese Fries",
    sumup_name: "Beef & Cheese Fries",
    price: "7,90",
    desc: "Fries mit Smash Beef und Cheese Sauce",
    allergens: ["gluten", "lactose"],
  },
  { name: "Sweet Potato Fries", sumup_name: "Sweet Potato Fries", price: "4,50" },
  { name: "8 Chicken Nuggets", sumup_name: "8 Chicken Nuggets", price: "6,00", allergens: ["gluten", "egg"] },
  { name: "Chicken Tenders", sumup_name: "Chicken Tenders", price: "6,60", allergens: ["gluten", "egg"] },
  { name: "Onion Rings", sumup_name: "Onion Rings", price: "6,20", allergens: ["gluten", "egg"] },
];

const SHAKES: MenuItem[] = [
  {
    name: "Chocolate Shake",
    sumup_name: "Chocolate Shake",
    price: "4,00",
    desc: "Cremig, kalt, klassisch",
    allergens: ["lactose", "egg"],
  },
  {
    name: "Vanilla Shake",
    sumup_name: "Vanilla Shake",
    price: "4,00",
    desc: "Vanille, dick, eiskalt",
    allergens: ["lactose", "egg"],
  },
];

const DRINKS: MenuItem[] = [
  { name: "Water", sumup_name: "Water", price: "2,00", desc: "Wasser" },
  { name: "Fritz Limo", sumup_name: "Fritz Limo", price: "3,30", desc: "Cola · Orange · Zitrone" },
];

const SAUCES: MenuItem[] = [
  { name: "Burger Sauce", price: "1,50" },
  { name: "Cheese Sauce", price: "4,00" },
  { name: "Garlic Sauce", price: "1,50" },
  { name: "Sweet & Sour Sauce", price: "1,50" },
  { name: "Ketchup", price: "0,60" },
  { name: "Mayo", price: "0,60" },
];

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

function BurgerCard({ item, img }: { item: MenuItem; img?: string }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({ id: item.name, name: item.name, sumup_name: item.sumup_name ?? item.name, sumup_sku: item.sumup_sku, variant_id: item.variant_id, price: parsePrice(item.price) });
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
      {img && (
        <div className="h-44 w-full border-b-[3px] border-bs-ink overflow-hidden bg-bs-peach rounded-t-2xl">
          <img
            src={img}
            alt={item.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-5 flex-1 flex flex-col gap-2">
        <h3 className="text-subhead text-xl text-bs-ink">{item.name}</h3>
        {item.desc && (
          <p className="text-sm text-bs-ink/70 leading-relaxed flex-1">
            {item.desc}
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
              {item.price} €
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className={`w-full py-2.5 rounded-xl border-[3px] border-bs-ink font-body font-bold text-sm tracking-wide transition-all shadow-[3px_3px_0_var(--bs-ink)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 ${
            added ? "bg-bs-teal text-white" : "bg-bs-yellow text-bs-ink"
          }`}
        >
          {added ? "✓ Hinzugefügt!" : "In den Warenkorb"}
        </button>
      </div>
    </div>
  );
}

function HorizontalCard({ item }: { item: MenuItem }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({ id: item.name, name: item.name, sumup_name: item.sumup_name ?? item.name, sumup_sku: item.sumup_sku, variant_id: item.variant_id, price: parsePrice(item.price) });
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
        {item.desc && (
          <p className="text-sm text-bs-ink/70 leading-relaxed">{item.desc}</p>
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
            {item.price} €
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

function ShakeCard({ item }: { item: MenuItem }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({ id: item.name, name: item.name, sumup_name: item.sumup_name ?? item.name, sumup_sku: item.sumup_sku, variant_id: item.variant_id, price: parsePrice(item.price) });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className="bg-white border-2 border-bs-ink rounded-full px-4 pt-4 pb-5 flex flex-col items-center shadow-[4px_4px_0_var(--bs-ink)] group hover:-translate-y-1 transition-transform duration-300 text-center">
      <h3 className="text-subhead text-lg text-bs-ink mt-2">{item.name}</h3>
      {item.desc && (
        <p className="text-xs text-bs-ink/60 mt-1">{item.desc}</p>
      )}
      <div className="mt-3 bg-bs-cyan text-bs-ink border-2 border-bs-ink px-4 py-1.5 rounded-full shadow-[2px_2px_0_var(--bs-ink)]">
        <span className="font-body font-bold tracking-wider">
          {item.price} €
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
              Smash Burgers, Fries &amp; Shakes — direkt am Bahnhofsring in
              Leer. Alle Preise in EUR. Allergene auf Anfrage.
            </p>
          </div>
        </section>

        <CheckerDivider />

        <div className="max-w-7xl mx-auto px-4 flex flex-col gap-0">
          {/* BEEF BURGERS */}
          <section>
            <CategoryHeader title="Beef Burgers" accent="primary" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-2">
              <BurgerCard
                item={BEEF[0]}
                img="/images/menu/single-smash.png"
              />
              <BurgerCard
                item={BEEF[1]}
                img="/images/menu/double-smash.png"
              />
              <BurgerCard
                item={BEEF[2]}
                img="/images/menu/long-chili-cheese.png"
              />
              <BurgerCard
                item={BEEF[3]}
                img="/images/menu/bbq-smash.png"
              />
              <BurgerCard
                item={BEEF[4]}
                img="/images/menu/croissant-smash.png"
              />
              <BurgerCard item={BEEF[5]} img="/images/menu/sucuk-burger.png" />
            </div>
          </section>

          <CheckerDivider />

          {/* CHICKEN */}
          <section>
            <CategoryHeader title="Chicken Burgers" accent="yellow" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CHICKEN.map((item) => (
                <BurgerCard key={item.name} item={item} />
              ))}
            </div>
          </section>

          <CheckerDivider />

          {/* VEGAN */}
          <section>
            <CategoryHeader title="Vegan" accent="cyan" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              {VEGAN.map((item) => (
                <BurgerCard key={item.name} item={item} />
              ))}
            </div>
          </section>

          <CheckerDivider />

          {/* SIDES */}
          <section>
            <CategoryHeader title="Sides & Snacks" accent="yellow" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SIDES.map((item) => (
                <HorizontalCard key={item.name} item={item} />
              ))}
            </div>
          </section>

          <CheckerDivider />

          {/* SHAKES & DRINKS */}
          <section>
            <CategoryHeader title="Shakes & Drinks" accent="cyan" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              {SHAKES.map((item) => (
                <ShakeCard key={item.name} item={item} />
              ))}
              {DRINKS.map((item) => (
                <ShakeCard key={item.name} item={item} />
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
                  key={item.name}
                  className="bg-white border-2 border-bs-ink rounded-xl p-4 shadow-[3px_3px_0_var(--bs-ink)] text-center group hover:-translate-y-0.5 transition-transform"
                >
                  <h3 className="text-subhead text-base text-bs-ink mb-2">
                    {item.name}
                  </h3>
                  <span className="font-body font-bold text-sm text-bs-teal">
                    {item.price} €
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
                <span className="badge-neon badge-yellow-fill">VOR ORT BESTELLEN</span>
                <h2 className="text-display text-3xl sm:text-4xl md:text-6xl text-bs-ink mt-4 mb-3 drop-shadow-[2px_2px_0px_#006a62] md:drop-shadow-[3px_3px_0px_#006a62]">
                  KOMM VORBEI.
                </h2>
                <p className="text-bs-ink-v text-lg leading-relaxed mb-8">
                  Keine Online-Bestellung. Komm einfach vorbei — Bahnhofsring
                  30, Leer. Frisch gesmasht, heiß serviert.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <a href={MAPS} target="_blank" rel="noopener noreferrer" className="btn-cyan">
                    <MapPin size={18} /> Route starten
                  </a>
                  <a href={PHONE} className="btn-pink pulse-pink">
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
        <a href="/" className="btn-ghost-ink btn-sm">
          Home
        </a>
      </div>
      <div className="h-20 md:h-0" aria-hidden="true"></div>
    </div>
  );
}
