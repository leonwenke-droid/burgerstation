import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { useEffect, useRef } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import CartButton from "./components/CartButton";
import CartDrawer from "./components/CartDrawer";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Locations from "./pages/Locations";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import AGB from "./pages/AGB";
import Widerruf from "./pages/Widerruf";
import Checkout from "./pages/Checkout";
import ThankYou from "./pages/ThankYou";
import OrderSuccess from "./pages/OrderSuccess";
import AdminSettings from "./pages/AdminSettings";
import BurgerStationPortfolioMockups from "./portfolio/BurgerStationPortfolioMockups";

const CheckoutRoute = () => <Checkout />;

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

/** Returns the stable session ID for this browser tab (created once, stored in sessionStorage). */
function getSessionId(): string {
  const KEY = "bs_session_id";
  let id = sessionStorage.getItem(KEY);
  if (!id) { id = Math.random().toString(36).slice(2, 12); sessionStorage.setItem(KEY, id); }
  return id;
}

/**
 * Sends a heartbeat to the analytics API every 30 s so the active-visitor counter
 * stays accurate. On tab/window close, fires a synchronous disconnect via sendBeacon
 * so the counter drops to 0 immediately without waiting for the 45 s TTL.
 */
function useAnalyticsSession() {
  const sessionId = useRef(getSessionId());

  useEffect(() => {
    const sid = sessionId.current;

    // Initial ping
    fetch("/api/analytics/heartbeat", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-session-id": sid },
      body: JSON.stringify({ sessionId: sid }),
    }).catch(() => {});

    // Heartbeat every 30 s (TTL is 45 s so this keeps the session alive)
    const timer = setInterval(() => {
      fetch("/api/analytics/heartbeat", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-session-id": sid },
        body: JSON.stringify({ sessionId: sid }),
      }).catch(() => {});
    }, 30_000);

    // Instant disconnect on tab/window close
    function onUnload() {
      navigator.sendBeacon(
        "/api/analytics/disconnect",
        new Blob([JSON.stringify({ sessionId: sid })], { type: "application/json" }),
      );
    }
    window.addEventListener("beforeunload", onUnload);

    return () => {
      clearInterval(timer);
      window.removeEventListener("beforeunload", onUnload);
    };
  }, []);
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/menu" component={Menu} />
        <Route path="/about" component={About} />
        <Route path="/locations" component={Locations} />
        <Route path="/impressum" component={Impressum} />
        <Route path="/datenschutz" component={Datenschutz} />
        <Route path="/agb" component={AGB} />
        <Route path="/widerrufsbelehrung" component={Widerruf} />
        <Route path="/bestellen/checkout" component={CheckoutRoute} />
        <Route path="/bestellen/danke" component={ThankYou} />
        <Route path="/order-success" component={OrderSuccess} />
        <Route path="/admin" component={AdminSettings} />
        <Route path="/portfolio" component={BurgerStationPortfolioMockups} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  useAnalyticsSession();
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <CartProvider>
            <Toaster />
            <Router />
            <CartButton />
            <CartDrawer />
          </CartProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
