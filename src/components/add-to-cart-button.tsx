"use client";

import type { ButtonHTMLAttributes } from "react";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { useCartStore } from "@/hooks/use-cart-store";
import { cn } from "@/lib/utils";
import type { ICartProductInput } from "@/types/cart";

interface AddToCartButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  product: ICartProductInput;
  outOfStock?: boolean;
  openCart?: boolean;
}

export function AddToCartButton({
  product,
  outOfStock = false,
  openCart = true,
  className,
  children,
  onClick,
  ...props
}: AddToCartButtonProps) {
  const add = useCartStore((state) => state.add);
  const setOpen = useCartStore((state) => state.setOpen);

  return (
    <button
      type="button"
      disabled={outOfStock}
      aria-disabled={outOfStock}
      className={cn(
        outOfStock && "cursor-not-allowed bg-muted text-muted-foreground hover:bg-muted",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (outOfStock) return;
        add(product);
        toast.success(`${product.title} added to your cart`);
        if (openCart) setOpen(true);
      }}
      {...props}
    >
      {outOfStock ? (
        <>
          <ShoppingBag className="mr-2 inline h-4 w-4" />
          Out of Stock
        </>
      ) : (
        children ?? (
          <>
            <ShoppingBag className="mr-2 inline h-4 w-4" />
            Add to Cart
          </>
        )
      )}
    </button>
  );
}
