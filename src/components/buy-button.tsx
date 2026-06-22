"use client";

import type { IProduct, IProductVariant } from "@/types";
import { AddToCartButton } from "@/components/add-to-cart-button";

interface BuyButtonProps {
  product: IProduct;
  variant?: IProductVariant;
  className?: string;
  children?: React.ReactNode;
}

export function BuyButton({ product, variant, className, children }: BuyButtonProps) {
  const stockQuantity = variant?.stockQuantity ?? product.stockQuantity;
  const productOutOfStock = product.stockStatus === "outOfStock" || product.stockQuantity === 0;
  const isOutOfStock = variant
    ? productOutOfStock || variant.stockQuantity <= 0
    : productOutOfStock || stockQuantity === 0;

  return (
    <AddToCartButton
      product={{
        productId: product._id,
        title: product.title,
        slug: product.slug.current,
        price: variant?.price ?? product.price,
        imageUrl: variant?.image?.url ?? product.mainImage.url ?? "",
        description: product.description,
        stockQuantity,
        variant: variant
          ? {
              _key: variant._key,
              sku: variant.sku,
              color: variant.color,
              colorHex: variant.colorHex,
              size: variant.size,
              price: variant.price,
            }
          : null,
      }}
      outOfStock={isOutOfStock}
      className={className}
    >
      {children}
    </AddToCartButton>
  );
}
