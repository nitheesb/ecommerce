import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UiState {
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      wishlist: [],
      toggleWishlist: (productId: string) =>
        set((state) => ({
          wishlist: state.wishlist.includes(productId)
            ? state.wishlist.filter((id) => id !== productId)
            : [...state.wishlist, productId],
        })),
      isWishlisted: (productId: string) =>
        get().wishlist.includes(productId),
    }),
    {
      name: "thazhuval-ui",
    },
  ),
);
