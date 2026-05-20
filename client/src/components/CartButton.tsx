import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function CartButton() {
  const { itemCount, openDrawer } = useCart();

  if (itemCount === 0) return null;

  return (
    <button
      onClick={openDrawer}
      aria-label={`Warenkorb öffnen – ${itemCount} ${itemCount === 1 ? "Artikel" : "Artikel"}`}
      className="fixed bottom-20 right-3 z-50 md:bottom-8 md:right-8 w-14 h-14 bg-bs-teal border-[3px] border-bs-ink rounded-full shadow-[4px_4px_0_var(--bs-ink)] flex items-center justify-center text-white hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--bs-ink)] transition-all"
    >
      <ShoppingCart size={22} strokeWidth={2.5} />
      <span className="absolute -top-2 -right-2 min-w-[1.5rem] h-6 px-1 bg-bs-yellow text-bs-ink text-xs font-bold rounded-full border-2 border-bs-ink flex items-center justify-center shadow-[2px_2px_0_var(--bs-ink)] tabular-nums">
        {itemCount > 9 ? "9+" : itemCount}
      </span>
    </button>
  );
}
