import { Phone, MapPin, Menu as MenuIcon, X, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

const PHONE = "tel:+4949199755279";
const MAPS =
  "https://www.google.com/maps/search/?api=1&query=Burger+Station+Bahnhofsring+30+26789+Leer";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Menü", href: "/menu" },
  { label: "Über uns", href: "/about" },
  { label: "Standort", href: "/locations" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header
      className="sticky top-0 z-50 border-b-4 border-bs-ink shadow-[4px_4px_0px_0px_var(--bs-ink)]"
      style={{ background: "var(--bs-cream)" }}
    >
      <div className="container flex items-center justify-between py-2 md:py-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 md:gap-3 group">
          <img
            src="/images/brand/burger-station-logo-transparent.png"
            alt="Burger Station Logo"
            className="w-10 h-10 md:w-12 md:h-12 object-contain transition-transform group-hover:rotate-6"
          />
          <div className="leading-none">
            <div className="font-display text-subhead text-base sm:text-lg md:text-xl text-bs-ink uppercase tracking-tight">
              BURGER STATION
            </div>
            <div className="text-label-caps text-[9px] sm:text-[10px] md:text-xs text-bs-teal mt-0.5">
              Leer · Est. 2026
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8 font-body font-semibold text-sm tracking-wider text-bs-ink uppercase">
          {NAV_LINKS.map(({ label, href }) => {
            const active =
              href === "/" ? location === "/" : location.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`relative pb-1 transition-colors ${
                  active
                    ? "text-bs-teal border-b-4 border-bs-teal"
                    : "hover:text-bs-teal"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTAs — order-first, phone secondary */}
        <div className="hidden md:flex items-center gap-3">
          <a href={PHONE} className="btn-ghost-ink btn-sm">
            <Phone size={16} /> Anrufen
          </a>
          <Link href="/menu" className="btn-pink btn-sm">
            <ShoppingBag size={16} /> Online bestellen
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden bg-white border-2 border-bs-ink rounded-full p-2 min-w-[44px] min-h-[44px] shadow-[3px_3px_0_var(--bs-ink)]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
        >
          {mobileOpen ? <X size={22} /> : <MenuIcon size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <nav
          className="lg:hidden border-t-2 border-bs-ink p-4 space-y-1 font-body font-semibold text-base uppercase tracking-wider"
          style={{ background: "var(--bs-cream)" }}
        >
          {NAV_LINKS.map(({ label, href }) => {
            const active =
              href === "/" ? location === "/" : location.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center justify-between py-3 px-3 rounded-xl border-2 transition-all ${
                  active
                    ? "border-bs-teal bg-bs-primary-c/30 text-bs-teal"
                    : "border-transparent hover:border-bs-ink hover:bg-white"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/menu"
            className="btn-pink w-full text-center mt-2"
            onClick={() => setMobileOpen(false)}
          >
            <ShoppingBag size={16} /> Online bestellen
          </Link>
          <div className="pt-3 grid grid-cols-2 gap-3">
            <a
              href={MAPS}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cyan btn-sm text-center"
              onClick={() => setMobileOpen(false)}
            >
              <MapPin size={14} /> Route
            </a>
            <a
              href={PHONE}
              className="btn-ghost-ink btn-sm text-center"
              onClick={() => setMobileOpen(false)}
            >
              <Phone size={14} /> Anrufen
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
