"use client";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { cn, formatCurrency } from "@/lib/utils";
import type { Product } from "@/lib/products";

export function StaticProductActions({ product }: { product: Product }) {
  const isOutOfStock = product.stockStatus === "outOfStock" || product.stockQuantity === 0;

  return (
    <div>
      <AddToCartButton
        product={{
          productId: product.id,
          title: product.name,
          slug: product.slug,
          price: product.price,
          imageUrl: product.image,
          description: product.description,
          stockQuantity: product.stockQuantity,
        }}
        outOfStock={isOutOfStock}
        className={cn(
          "w-full rounded-full py-4 text-[11px] font-medium uppercase tracking-[0.22em] transition-colors",
          isOutOfStock
            ? "cursor-not-allowed bg-muted text-muted-foreground hover:bg-muted"
            : "bg-foreground text-background hover:bg-foreground/90",
        )}
      >
        {isOutOfStock ? "Out of Stock" : `Add to Cart · ${formatCurrency(product.price)}`}
      </AddToCartButton>
      {isOutOfStock && (
        <p className="mt-3 rounded-full bg-red-50 px-4 py-2 text-center text-xs font-medium text-red-700">
          This saree is currently out of stock, but it stays visible for wishlists and restock enquiries.
        </p>
      )}
    </div>
  );
}
