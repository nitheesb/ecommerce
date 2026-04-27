"use client"

import * as React from "react"
import { MessageCircle, ShoppingBag } from "lucide-react"

import { absoluteUrl, cn, formatCurrency } from "@/lib/utils"
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
  const effectivePrice = selectedVariant?.price ?? product.price
  const productUrl = absoluteUrl(`/product/${product.slug.current}`)
  const whatsappHref = `https://wa.me/919585628565?text=${encodeURIComponent(
    `Hi, I'm interested in the ${product.title} saree (${formatCurrency(effectivePrice)}). ${productUrl}`,
  )}`

  return (
    <>
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

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] md:hidden">
        <div className="pointer-events-auto mx-auto max-w-md rounded-[26px] border border-border/60 bg-background/94 p-3 shadow-[0_-14px_45px_rgba(15,23,42,0.16)] backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-between gap-3 px-1">
            <div className="min-w-0">
              <p className="truncate text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                {product.title}
              </p>
              {selectedVariant?.color && (
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {selectedVariant.color}
                </p>
              )}
            </div>
            <p className="shrink-0 font-serif text-lg leading-none">
              {formatCurrency(effectivePrice)}
            </p>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <BuyButton
              product={product}
              variant={selectedVariant}
              className="h-12 rounded-full text-[10px] uppercase tracking-[0.18em]"
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
              Add to Cart
            </BuyButton>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ask about this saree on WhatsApp"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border/70 bg-background text-foreground shadow-sm transition-colors hover:bg-secondary/60"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
