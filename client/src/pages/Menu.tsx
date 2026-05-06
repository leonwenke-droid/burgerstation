import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Phone, MapPin } from "lucide-react";

const PHONE = "tel:+4949199755279";
const MAPS =
  "https://www.google.com/maps/search/?api=1&query=Burger+Station+Bahnhofsring+30+26789+Leer";

type MenuItem = { name: string; price: string; desc?: string; badge?: string };

const BEEF: MenuItem[] = [
  {
    name: "Single Smash",
    price: "6,90",
    desc: "Brioche Bun, Single Beef Patty, Cheddar, Onion, Lettuce, Pickles, Burger Sauce",
  },
  {
    name: "Double Smash",
    price: "9,40",
    desc: "Doppeltes Beef Patty, geschmolzener Cheddar, Pickles, Burger Sauce",
    badge: "Top Seller",
  },
  {
    name: "Long Chili Cheese",
    price: "11,90",
    desc: "Doppeltes Beef, Chili Cheese, Jalapeños, Burger Sauce",
    badge: "Spicy",
  },
  {
    name: "BBQ Smash",
    price: "9,90",
    desc: "Beef Patty, Bacon, Cheddar, Onion Rings, BBQ Sauce",
    badge: "Smoky",
  },
  {
    name: "Croissant Smash",
    price: "11,40",
    desc: "Croissant Bun, doppeltes Beef Patty, Cheddar, Burger Sauce",
    badge: "Signature",
  },
  {
    name: "Sucuk Burger",
    price: "8,90",
    desc: "Sucuk, Cheddar, Onion, Lettuce, Pickles, Garlic Sauce",
  },
];

const CHICKEN: MenuItem[] = [
  {
    name: "Classic Chicken",
    price: "9,00",
    desc: "Knuspriges Chicken Patty, Buttermilk-Mariniert, Cheddar, Lettuce, Pickles, Burger Sauce",
  },
  {
    name: "Garlic Chicken",
    price: "9,00",
    desc: "Chicken Patty, Cheddar, Garlic Sauce",
  },
  {
    name: "Long Chicken",
    price: "11,50",
    desc: "Doppelt Chicken Patty, Cheddar, Lettuce, Onion, Pickles, Burger Sauce",
  },
];

const VEGAN: MenuItem[] = [
  {
    name: "Vegan Burger",
    price: "8,70",
    desc: "Vegan Patty, Lettuce, Onion, Pickles, Vegan Sauce",
  },
  {
    name: "Falafel Burger",
    price: "8,70",
    desc: "Hausgemachte Falafel, Lettuce, Onion, Pickles, Vegan Sauce",
  },
];

const SIDES: MenuItem[] = [
  { name: "Fries", price: "3,50" },
  {
    name: "Beef & Cheese Fries",
    price: "7,90",
    desc: "Fries mit Smash Beef und Cheese Sauce",
  },
  { name: "Sweet Potato Fries", price: "4,50" },
  { name: "8 Chicken Nuggets", price: "6,00" },
  { name: "Chicken Tenders", price: "6,60" },
  { name: "Onion Rings", price: "6,20" },
];

const SHAKES: MenuItem[] = [
  {
    name: "Chocolate Shake",
    price: "4,00",
    desc: "Cremig, kalt, klassisch",
  },
  { name: "Vanilla Shake", price: "4,00", desc: "Vanille, dick, eiskalt" },
];

const DRINKS: MenuItem[] = [
  { name: "Water", price: "2,00" },
  { name: "Fritz Limo", price: "3,30", desc: "Cola · Orange · Zitrone" },
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
  return (
    <div className="bg-white border-[3px] border-bs-ink rounded-2xl overflow-visible relative flex flex-col shadow-[6px_6px_0_var(--bs-ink)] group hover:-translate-y-1 transition-transform duration-300">
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
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
      </div>
      {/* Price "license plate" footer */}
      <div className="flex justify-center pb-5 px-5">
        <div
          className="bg-bs-yellow text-bs-ink border-2 border-bs-ink px-5 py-2 shadow-[3px_3px_0_var(--bs-ink)] inline-block"
          style={{ borderRadius: "4px" }}
        >
          <span className="font-body font-bold text-lg tracking-wider">
            {item.price} €
          </span>
        </div>
      </div>
    </div>
  );
}

function HorizontalCard({ item }: { item: MenuItem }) {
  return (
    <div className="bg-white border-2 border-bs-ink rounded-xl overflow-visible relative flex flex-row items-center p-4 shadow-[4px_4px_0_var(--bs-ink)] gap-4 group hover:-translate-y-1 transition-transform duration-300">
      {item.badge && (
        <div className="absolute -top-3 -right-3 bg-bs-yellow text-bs-ink text-label-caps w-12 h-12 rounded-full flex items-center justify-center border-2 border-bs-ink rotate-12 z-10 shadow-[2px_2px_0_var(--bs-ink)] text-[10px] font-bold uppercase leading-none text-center">
          {item.badge}
        </div>
      )}
      <div className="flex-1">
        <h3 className="text-subhead text-lg text-bs-ink mb-0.5">
          {item.name}
        </h3>
        {item.desc && (
          <p className="text-sm text-bs-ink/70 leading-relaxed">{item.desc}</p>
        )}
      </div>
      <div
        className="bg-bs-yellow text-bs-ink border-2 border-bs-ink px-3 py-1.5 shadow-[2px_2px_0_var(--bs-ink)] shrink-0 whitespace-nowrap"
        style={{ borderRadius: "4px" }}
      >
        <span className="font-body font-bold tracking-wider">
          {item.price} €
        </span>
      </div>
    </div>
  );
}

function ShakeCard({ item }: { item: MenuItem }) {
  return (
    <div className="bg-white border-2 border-bs-ink rounded-full px-4 pt-4 pb-6 flex flex-col items-center shadow-[4px_4px_0_var(--bs-ink)] group hover:-translate-y-1 transition-transform duration-300 text-center">
      <h3 className="text-subhead text-lg text-bs-ink mt-2">{item.name}</h3>
      {item.desc && (
        <p className="text-xs text-bs-ink/60 mt-1">{item.desc}</p>
      )}
      <div className="mt-4 bg-bs-cyan text-bs-ink border-2 border-bs-ink px-4 py-1.5 rounded-full shadow-[2px_2px_0_var(--bs-ink)]">
        <span className="font-body font-bold tracking-wider">
          {item.price} €
        </span>
      </div>
    </div>
  );
}

export default function Menu() {
  return (
    <div className="min-h-screen bg-bs-cream text-bs-ink">
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
            <h1 className="text-display text-6xl md:text-8xl text-bs-ink uppercase relative">
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
                img="/burgers/hero-burger.svg"
              />
              <BurgerCard
                item={BEEF[1]}
                img="/burgers/double-smash.svg"
              />
              <BurgerCard
                item={BEEF[2]}
                img="/burgers/long-chili-cheese.svg"
              />
              <BurgerCard
                item={BEEF[3]}
                img="/burgers/bbq-smash.svg"
              />
              <BurgerCard
                item={BEEF[4]}
                img="/burgers/croissant-smash.svg"
              />
              <BurgerCard item={BEEF[5]} />
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
            <div className="relative overflow-hidden rounded-3xl border-[4px] border-bs-ink shadow-[12px_12px_0_var(--bs-ink)] max-w-3xl mx-auto checker-teal">
              <div className="absolute inset-0 bg-bs-cream/80 backdrop-blur-sm" aria-hidden="true"></div>
              <div className="relative z-10 bg-bs-peach border-[4px] border-bs-ink rounded-2xl m-4 p-8 md:p-12 shadow-[6px_6px_0_var(--bs-ink)]">
                <span className="badge-neon badge-yellow-fill">VOR ORT BESTELLEN</span>
                <h2 className="text-display text-4xl md:text-6xl text-bs-ink mt-4 mb-3 drop-shadow-[3px_3px_0px_#006a62]">
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
