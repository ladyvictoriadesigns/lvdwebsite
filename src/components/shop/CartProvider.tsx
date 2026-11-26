"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { getProductBySlug, type Product } from "@/data/products";

export interface CartLine {
  slug: string;
  quantity: number;
}

export interface ResolvedCartLine extends CartLine {
  product: Product;
}

interface CartContextValue {
  lines: ResolvedCartLine[];
  count: number;
  add: (slug: string, quantity?: number) => void;
  remove: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "lvd-shop-cart";
const EMPTY_CART: CartLine[] = [];

/**
 * The cart lives in localStorage, an external store, so it is read through
 * useSyncExternalStore: the server renders an empty cart, the browser swaps in
 * the saved cart on hydration, and every change is written straight back.
 */
let cachedCart: CartLine[] | null = null;
const listeners = new Set<() => void>();

function isValidStoredCart(value: unknown): value is CartLine[] {
  return (
    Array.isArray(value) &&
    value.every(
      (line) =>
        typeof line === "object" &&
        line !== null &&
        typeof (line as CartLine).slug === "string" &&
        typeof (line as CartLine).quantity === "number" &&
        getProductBySlug((line as CartLine).slug) !== undefined,
    )
  );
}

function readCart(): CartLine[] {
  if (cachedCart) return cachedCart;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (isValidStoredCart(parsed)) {
        cachedCart = parsed;
        return cachedCart;
      }
    }
  } catch {
    // A malformed saved cart should never break the storefront.
  }
  cachedCart = EMPTY_CART;
  return cachedCart;
}

function writeCart(next: CartLine[]) {
  cachedCart = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage may be unavailable (private browsing); the cart still works in memory.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      cachedCart = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getServerSnapshot(): CartLine[] {
  return EMPTY_CART;
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const lines = useSyncExternalStore(subscribe, readCart, getServerSnapshot);

  const add = useCallback((slug: string, quantity = 1) => {
    const current = readCart();
    const existing = current.find((line) => line.slug === slug);
    writeCart(
      existing
        ? current.map((line) =>
            line.slug === slug ? { ...line, quantity: line.quantity + quantity } : line,
          )
        : [...current, { slug, quantity }],
    );
  }, []);

  const remove = useCallback((slug: string) => {
    writeCart(readCart().filter((line) => line.slug !== slug));
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    const current = readCart();
    writeCart(
      quantity <= 0
        ? current.filter((line) => line.slug !== slug)
        : current.map((line) => (line.slug === slug ? { ...line, quantity } : line)),
    );
  }, []);

  const clear = useCallback(() => writeCart(EMPTY_CART), []);

  const value = useMemo<CartContextValue>(() => {
    const resolved = lines
      .map((line) => {
        const product = getProductBySlug(line.slug);
        return product ? { ...line, product } : null;
      })
      .filter((line): line is ResolvedCartLine => line !== null);

    return {
      lines: resolved,
      count: resolved.reduce((sum, line) => sum + line.quantity, 0),
      add,
      remove,
      setQuantity,
      clear,
    };
  }, [lines, add, remove, setQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
