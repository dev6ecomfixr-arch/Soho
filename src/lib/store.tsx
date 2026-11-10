import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { getProduct } from "@/lib/catalog";
import type { CartItem, Order } from "@/lib/types";

const KEY = "soho-store-v1";

interface Persisted {
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
}

interface StoreValue extends Persisted {
  hydrated: boolean;
  cartOpen: boolean;
  setCartOpen: (o: boolean) => void;
  addToCart: (handle: string, size: string, qty?: number) => void;
  updateQty: (handle: string, size: string, qty: number) => void;
  removeFromCart: (handle: string, size: string) => void;
  clearCart: () => void;
  toggleWishlist: (handle: string) => void;
  isWished: (handle: string) => boolean;
  placeOrder: (o: Order) => void;
  cartCount: number;
}

const StoreCtx = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>({ cart: [], wishlist: [], orders: [] });
  const [hydrated, setHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw) as Partial<Persisted>;
        setState({
          cart: (p.cart ?? []).filter((c) => getProduct(c.handle)),
          wishlist: (p.wishlist ?? []).filter((h) => getProduct(h)),
          orders: p.orders ?? [],
        });
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const addToCart = useCallback((handle: string, size: string, qty = 1) => {
    const p = getProduct(handle);
    setState((s) => {
      const ex = s.cart.find((c) => c.handle === handle && c.size === size);
      const cart = ex
        ? s.cart.map((c) => (c === ex ? { ...c, qty: Math.min(c.qty + qty, 10) } : c))
        : [...s.cart, { handle, size, qty }];
      return { ...s, cart };
    });
    toast.success(`Added to bag`, { description: `${p?.name ?? "Item"} · Size ${size}` });
    setCartOpen(true);
  }, []);

  const updateQty = useCallback((handle: string, size: string, qty: number) => {
    setState((s) => ({
      ...s,
      cart: s.cart
        .map((c) => (c.handle === handle && c.size === size ? { ...c, qty: Math.min(qty, 10) } : c))
        .filter((c) => c.qty > 0),
    }));
  }, []);

  const removeFromCart = useCallback((handle: string, size: string) => {
    setState((s) => ({ ...s, cart: s.cart.filter((c) => !(c.handle === handle && c.size === size)) }));
  }, []);

  const clearCart = useCallback(() => setState((s) => ({ ...s, cart: [] })), []);

  const toggleWishlist = useCallback((handle: string) => {
    setState((s) => {
      const has = s.wishlist.includes(handle);
      toast(has ? "Removed from wishlist" : "Saved to wishlist", {
        description: getProduct(handle)?.name,
      });
      return { ...s, wishlist: has ? s.wishlist.filter((h) => h !== handle) : [...s.wishlist, handle] };
    });
  }, []);

  const placeOrder = useCallback((o: Order) => {
    setState((s) => ({ ...s, cart: [], orders: [o, ...s.orders].slice(0, 10) }));
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      ...state,
      hydrated,
      cartOpen,
      setCartOpen,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isWished: (h) => state.wishlist.includes(h),
      placeOrder,
      cartCount: state.cart.reduce((n, c) => n + c.qty, 0),
    }),
    [state, hydrated, cartOpen, addToCart, updateQty, removeFromCart, clearCart, toggleWishlist, placeOrder],
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore(): StoreValue {
  const v = useContext(StoreCtx);
  if (!v) throw new Error("useStore must be used inside StoreProvider");
  return v;
}
