import type { IProductVariant } from "./product";

export type CartVariant = Pick<
  IProductVariant,
  "_key" | "sku" | "color" | "colorHex" | "size" | "price"
>;

/** Normalized input shared by Sanity products and lightweight listing cards. */
export interface ICartProductInput {
  productId: string;
  title: string;
  slug: string;
  price: number;
  imageUrl: string;
  description?: string;
  stockQuantity?: number;
  variant?: CartVariant | null;
}

export interface ICartItem extends ICartProductInput {
  quantity: number;
}

export interface ICartActions {
  add: (product: ICartProductInput) => void;
  remove: (productId: string, variantKey?: string) => void;
  setQuantity: (productId: string, qty: number, variantKey?: string) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
}

export interface ICartState extends ICartActions {
  items: ICartItem[];
  open: boolean;
}

export interface ICartComputed {
  count: number;
  subtotal: number;
}
