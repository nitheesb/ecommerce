"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { BuyButton } from "@/components/buy-button"
import type { IProduct, IProductVariant } from "@/types"

interface ProductActionsProps {
  product: IProduct
}

export function ProductActions({ product }: ProductActionsProps) {
  const [selectedVariant, setSelectedVariant] = React.useState<IProductVariant | undefined>(
    product.variants?.[0],
  )

  const hasVariants = product.variants && product.variants.length > 0
  const stockQuantity = selectedVariant?.stockQuantity ?? product.stockQuantity
  const isOutOfStock = selectedVariant
    ? selectedVariant.stockQuantity <= 0
    : product.stockStatus === "outOfStock" || stockQuantity === 0
  const isLowStock =
    !isOutOfStock &&
    (product.stockStatus === "lowStock" ||
      (typeof stockQuantity === "number" && stockQuantity > 0 && stockQuantity <= 3))
  return (
    <div className="space-y-6">
      {/* Variant Selector */}
      {hasVariants && (
        <div>
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Color — {selectedVariant?.color}
          </p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant) => (
              <button
                key={variant._key}
                onClick={() => setSelectedVariant(variant)}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-offset-2 transition-all",
                  selectedVariant?._key === variant._key
                    ? "ring-foreground"
                    : "ring-foreground/20 hover:ring-foreground/50",
                )}
                style={{ backgroundColor: variant.colorHex }}
                aria-label={variant.color}
                aria-pressed={selectedVariant?._key === variant._key}
              />
            ))}
          </div>
          {selectedVariant?.size && (
            <p className="mt-2 text-xs text-muted-foreground">
              Size: {selectedVariant.size}
            </p>
          )}
        </div>
      )}

      {isLowStock && (
        <p className="rounded-full bg-amber-100 px-4 py-2 text-xs font-medium text-amber-800">
          {typeof stockQuantity === "number"
            ? `Only ${stockQuantity} left in stock`
            : "Low stock"}
        </p>
      )}
      {isOutOfStock && (
        <p className="rounded-full bg-red-50 px-4 py-2 text-xs font-medium text-red-700">
          This saree is currently out of stock, but you can still save it or ask us about restock timing.
        </p>
      )}

      <BuyButton
        product={product}
        variant={selectedVariant}
        className="h-14 w-full rounded-full text-[11px] uppercase tracking-[0.22em]"
      />
    </div>
  )
}
