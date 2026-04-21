import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RecentlyViewedItem {
  id: string;
  slug: string;
  name: string;
  collection: string;
  price: number;
  image: string;
}

interface UiState {
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  recentlyViewed: RecentlyViewedItem[];
  addRecentlyViewed: (item: RecentlyViewedItem) => void;
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
      recentlyViewed: [],
      addRecentlyViewed: (item: RecentlyViewedItem) =>
        set((state) => ({
          recentlyViewed: [
            item,
            ...state.recentlyViewed.filter((i) => i.id !== item.id),
          ].slice(0, 4),
        })),
    }),
    {
      name: "thazhuval-ui",
    },
  ),
);
