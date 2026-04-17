// ---------------------------------------------------------------------------
// Cart Domain Entities — Zustand store shape for client-side cart persistence
// ---------------------------------------------------------------------------

import type { IProduct, IProductVariant } from "./product";

/** A single item in the shopping cart */
export interface ICartItem {
  /** Sanity document _id of the product */
  productId: string;
  /** Resolved product title for display */
  title: string;
  slug: string;
  /** Selected variant (null for single-variant products) */
  variant: Pick<IProductVariant, "_key" | "sku" | "color" | "colorHex" | "size" | "price"> | null;
  /** Effective unit price (variant price or product base price) */
  price: number;
  /** Image URL for the cart line item */
  imageUrl: string;
  quantity: number;
}

/** Actions exposed by the Zustand cart store */
export interface ICartActions {
  add: (product: IProduct, variant?: IProductVariant) => void;
  remove: (productId: string, variantKey?: string) => void;
  setQuantity: (productId: string, qty: number, variantKey?: string) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
}

/** Full Zustand store shape — state + computed + actions */
export interface ICartState extends ICartActions {
  items: ICartItem[];
  /** Drawer open/close state */
  open: boolean;
}

/** Computed values derived from cart state (not stored, calculated in selectors) */
export interface ICartComputed {
  count: number;
  subtotal: number;
}
