import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { ICartState } from "@/types/cart";

function isSameLine(productId: string, variantKey: string | undefined) {
  return (item: ICartState["items"][number]) =>
    item.productId === productId && item.variant?._key === variantKey;
}

export const useCartStore = create<ICartState>()(
  persist(
    (set) => ({
      items: [],
      open: false,
      add: (product) =>
        set((state) => {
          const lineIndex = state.items.findIndex(
            isSameLine(product.productId, product.variant?._key),
          );
          if (lineIndex < 0) return { items: [...state.items, { ...product, quantity: 1 }] };

          const items = [...state.items];
          const line = items[lineIndex];
          const max = Math.min(10, product.stockQuantity ?? 10);
          items[lineIndex] = { ...line, quantity: Math.min(line.quantity + 1, max) };
          return { items };
        }),
      remove: (productId, variantKey) =>
        set((state) => ({
          items: state.items.filter((item) => !isSameLine(productId, variantKey)(item)),
        })),
      setQuantity: (productId, quantity, variantKey) =>
        set((state) => ({
          items: state.items.map((item) => {
            if (!isSameLine(productId, variantKey)(item)) return item;
            const max = Math.min(10, item.stockQuantity ?? 10);
            return { ...item, quantity: Math.max(1, Math.min(Math.floor(quantity), max)) };
          }),
        })),
      clear: () => set({ items: [] }),
      setOpen: (open) => set({ open }),
    }),
    {
      name: "thazhuval-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
