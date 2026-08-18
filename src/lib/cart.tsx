"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { createPersistentStore, useHydrated, useStore } from "@/lib/store";
import type { Cart, CartLine, MenuItem, Naira } from "@/lib/types";

const STORAGE_KEY = "grubbox.cart.v1";

const EMPTY_CART: Cart = { restaurantSlug: null, lines: [] };

function isCart(value: unknown): value is Cart {
  return (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as Cart).lines)
  );
}

const cartStore = createPersistentStore(STORAGE_KEY, EMPTY_CART, isCart);

interface CartContextValue {
  cart: Cart;
  lines: CartLine[];
  count: number;
  subtotal: Naira;
  /** False until the persisted cart is available, so screens can hold their
   *  layout rather than flashing an empty state. */
  hydrated: boolean;
  quantityOf(itemId: string): number;
  add(restaurantSlug: string, item: MenuItem): void;
  remove(itemId: string): void;
  setQuantity(itemId: string, quantity: number): void;
  /** Swaps the whole cart for a given set of lines — used by "Reorder". */
  replaceWith(restaurantSlug: string, lines: CartLine[]): void;
  clear(): void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cart = useStore(cartStore);
  const hydrated = useHydrated();

  const add = useCallback((restaurantSlug: string, item: MenuItem) => {
    cartStore.update((current) => {
      // A cart belongs to one restaurant. Ordering from a different one starts
      // fresh rather than silently mixing kitchens.
      const lines =
        current.restaurantSlug && current.restaurantSlug !== restaurantSlug
          ? []
          : current.lines;

      const existing = lines.find((line) => line.itemId === item.id);

      return {
        restaurantSlug,
        lines: existing
          ? lines.map((line) =>
              line.itemId === item.id
                ? { ...line, quantity: line.quantity + 1 }
                : line,
            )
          : [
              ...lines,
              {
                itemId: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: 1,
              },
            ],
      };
    });
  }, []);

  const setQuantity = useCallback((itemId: string, quantity: number) => {
    cartStore.update((current) => {
      const lines =
        quantity <= 0
          ? current.lines.filter((line) => line.itemId !== itemId)
          : current.lines.map((line) =>
              line.itemId === itemId ? { ...line, quantity } : line,
            );

      return {
        restaurantSlug: lines.length ? current.restaurantSlug : null,
        lines,
      };
    });
  }, []);

  const remove = useCallback(
    (itemId: string) => setQuantity(itemId, 0),
    [setQuantity],
  );

  const replaceWith = useCallback((restaurantSlug: string, lines: CartLine[]) => {
    // Copy the lines so a caller holding a stored order can't mutate the cart
    // through a shared reference.
    cartStore.set({ restaurantSlug, lines: lines.map((line) => ({ ...line })) });
  }, []);

  const clear = useCallback(() => cartStore.set(EMPTY_CART), []);

  const value = useMemo<CartContextValue>(() => {
    const count = cart.lines.reduce((sum, line) => sum + line.quantity, 0);
    const subtotal = cart.lines.reduce(
      (sum, line) => sum + line.price * line.quantity,
      0,
    );

    return {
      cart,
      lines: cart.lines,
      count,
      subtotal,
      hydrated,
      quantityOf: (itemId) =>
        cart.lines.find((line) => line.itemId === itemId)?.quantity ?? 0,
      add,
      remove,
      setQuantity,
      replaceWith,
      clear,
    };
  }, [cart, hydrated, add, remove, setQuantity, replaceWith, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return context;
}
