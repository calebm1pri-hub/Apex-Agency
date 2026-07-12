"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine, Product } from "@/types";

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  add: (product: Product, quantity?: number, variant?: string) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  setOpen: (open: boolean) => void;
  // derived
  count: () => number;
  subtotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      add: (product, quantity = 1, variant) =>
        set((state) => {
          const existing = state.lines.find((l) => l.productId === product.id);
          if (existing) {
            return {
              isOpen: true,
              lines: state.lines.map((l) =>
                l.productId === product.id
                  ? { ...l, quantity: l.quantity + quantity }
                  : l
              ),
            };
          }
          const line: CartLine = {
            productId: product.id,
            handle: product.handle,
            name: product.name,
            price: product.price,
            image: product.images[0]?.url ?? "",
            quantity,
            variant,
          };
          return { isOpen: true, lines: [...state.lines, line] };
        }),
      remove: (productId) =>
        set((state) => ({
          lines: state.lines.filter((l) => l.productId !== productId),
        })),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((l) => l.productId !== productId)
              : state.lines.map((l) =>
                  l.productId === productId ? { ...l, quantity } : l
                ),
        })),
      clear: () => set({ lines: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      setOpen: (isOpen) => set({ isOpen }),
      count: () => get().lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: () => get().lines.reduce((s, l) => s + l.price * l.quantity, 0),
    }),
    { name: "marnie-cart" }
  )
);
