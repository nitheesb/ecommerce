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

  return (
    <div className="mt-8 space-y-6">
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
          {selectedVariant && selectedVariant.stockQuantity <= 3 && selectedVariant.stockQuantity > 0 && (
            <p className="mt-2 text-xs text-amber-700">
              Only {selectedVariant.stockQuantity} left in stock
            </p>
          )}
          {selectedVariant && selectedVariant.stockQuantity === 0 && (
            <p className="mt-2 text-xs text-red-600">Out of stock</p>
          )}
        </div>
      )}

      {/* Buy Button */}
      <BuyButton
        product={product}
        variant={selectedVariant}
        className="w-full py-6 text-[11px] uppercase tracking-[0.22em]"
      />
    </div>
  )
}
