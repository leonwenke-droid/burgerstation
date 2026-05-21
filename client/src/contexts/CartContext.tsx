import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

// Stable session ID for analytics (not tied to auth — just identifies this browser tab)
function getSessionId(): string {
  const key = "bs_session_id";
  let id = sessionStorage.getItem(key);
  if (!id) { id = Math.random().toString(36).slice(2, 10); sessionStorage.setItem(key, id); }
  return id;
}

export interface CartItem {
  id: string;
  name: string;
  /** Exact name as registered in the SumUp item catalogue (dashboard). Falls back to `name` if omitted. */
  sumup_name?: string;
  /** SumUp Artikelnummer (SKU) as shown in the dashboard, e.g. "DBL-SMSH-001". */
  sumup_sku?: string;
  /** SumUp Variant-ID from the official product CSV export. When present, price is resolved server-side from SUMUP_CATALOG. */
  variant_id?: string;
  /** Tax category for VAT calculation (delivery, Germany): food → 7% | drink → 19%. */
  category?: "food" | "drink";
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const sessionId = useRef(getSessionId());

  function addItem(item: Omit<CartItem, "quantity">) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateQuantity(id: string, qty: number) {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
    );
  }

  function clearCart() {
    setItems([]);
  }

  // Sync cart item count to analytics backend (fire-and-forget)
  useEffect(() => {
    const count = items.reduce((s, i) => s + i.quantity, 0);
    fetch("/api/analytics/cart-sync", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ sessionId: sessionId.current, count }),
    }).catch(() => {});
  }, [items]);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items],
  );
  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        itemCount,
        drawerOpen,
        openDrawer: () => setDrawerOpen(true),
        closeDrawer: () => setDrawerOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
