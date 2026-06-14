/**
 * Burger Station Leer — Portfolio-Mockups
 *
 * Rendert die echten Seitenkomponenten (Home, Menu, Checkout) 1:1 —
 * gleiche Fonts, Tailwind-Klassen, Header, Footer und Assets wie live.
 *
 * Verwendung:
 *   import PortfolioMockups from "@/portfolio/BurgerStationPortfolioMockups";
 *   <PortfolioMockups />
 *
 * Vorschau im Projekt: /portfolio
 */

import type { ReactNode } from "react";
import { useMemo } from "react";
import { Router } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CartProvider, type CartItem } from "@/contexts/CartContext";
import Home from "@/pages/Home";
import Menu from "@/pages/Menu";
import Checkout, { type CheckoutPreviewConfig } from "@/pages/Checkout";

/** Verhindert Navigation — jeder Frame bleibt auf seiner Route. */
function FixedRoute({ path, children }: { path: string; children: ReactNode }) {
  const hook = useMemo(
    () => (): [string, (to: string) => void] => [path, () => {}],
    [path],
  );
  return <Router hook={hook}>{children}</Router>;
}

function BrowserFrame({
  title,
  url,
  children,
}: {
  title: string;
  url: string;
  children: ReactNode;
}) {
  return (
    <figure className="flex flex-col gap-3">
      <figcaption className="font-body font-bold text-sm uppercase tracking-widest text-bs-ink/70">
        {title}
      </figcaption>
      <div className="rounded-2xl border-[3px] border-bs-ink shadow-[8px_8px_0_var(--bs-ink)] overflow-hidden bg-bs-cream">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b-[3px] border-bs-ink bg-white">
          <span className="w-3 h-3 rounded-full bg-red-400 border border-bs-ink" />
          <span className="w-3 h-3 rounded-full bg-bs-yellow border border-bs-ink" />
          <span className="w-3 h-3 rounded-full bg-bs-teal border border-bs-ink" />
          <span className="ml-3 text-xs font-mono text-bs-ink/50 truncate">{url}</span>
        </div>
        <div className="relative max-h-[820px] overflow-y-auto overflow-x-hidden">{children}</div>
      </div>
    </figure>
  );
}

function SiteShell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  );
}

const PORTFOLIO_CART_ITEM: CartItem = {
  id:         "7569a6cd-268f-4d16-b86f-09676f4dcfaa",
  name:       "Double Smash",
  sumup_name: "Double Smash",
  sumup_sku:  "DBL-SMSH-001",
  variant_id: "7569a6cd-268f-4d16-b86f-09676f4dcfaa",
  category:   "food",
  price:      9.4,
  quantity:   1,
};

const PORTFOLIO_CHECKOUT_PREVIEW: CheckoutPreviewConfig = {
  form: {
    vorname:    "Max",
    nachname:   "Mustermann",
    email:      "max.mustermann@web.de",
    telefon:    "+49 491 1234567",
    strasse:    "Heisfelder Straße",
    hausnummer: "12",
    plz:        "26789",
    ort:        "Leer",
    anmerkungen: "Bitte an der Haustür klingeln — 2. OG links.",
  },
  payment: "bar",
  agb:     true,
};

export function PortfolioHomeFrame() {
  return (
    <BrowserFrame title="Startseite" url="burgerstation-leer.de">
      <SiteShell>
        <FixedRoute path="/">
          <Home />
        </FixedRoute>
      </SiteShell>
    </BrowserFrame>
  );
}

export function PortfolioMenuFrame() {
  return (
    <BrowserFrame title="Speisekarte" url="burgerstation-leer.de/menu">
      <SiteShell>
        <FixedRoute path="/menu">
          <Menu />
        </FixedRoute>
      </SiteShell>
    </BrowserFrame>
  );
}

export function PortfolioCheckoutFrame() {
  return (
    <BrowserFrame title="Checkout & Zahlung" url="burgerstation-leer.de/bestellen/checkout">
      <SiteShell>
        <CartProvider initialItems={[PORTFOLIO_CART_ITEM]}>
          <FixedRoute path="/bestellen/checkout">
            <Checkout preview={PORTFOLIO_CHECKOUT_PREVIEW} />
          </FixedRoute>
        </CartProvider>
      </SiteShell>
    </BrowserFrame>
  );
}

/** Alle drei Screens — für Portfolio-Case-Studies */
export default function BurgerStationPortfolioMockups() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-bs-teal mb-2">
          Case Study · Webdesign &amp; Entwicklung
        </p>
        <h1 className="text-display text-2xl md:text-3xl text-white uppercase tracking-tight">
          Burger Station Leer
        </h1>
        <p className="text-sm text-white/60 mt-2 max-w-lg mx-auto font-body">
          Original-Komponenten — identische Typografie, Farben und Layout wie auf der Live-Website.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid gap-12">
        <PortfolioHomeFrame />
        <PortfolioMenuFrame />
        <PortfolioCheckoutFrame />
      </div>
    </div>
  );
}
