"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { useLenisStore } from "@/hooks/use-lenis"
import type { Product } from "@/lib/products"

interface QuickViewProps {
  product: Product | null
  onClose: () => void
}

export function QuickView({ product, onClose }: QuickViewProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ""

  React.useEffect(() => {
    if (!product) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)

    // Stop Lenis smooth scroll + fallback body lock
    const lenis = useLenisStore.getState().lenis
    lenis?.stop()
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", onKey)
      lenis?.start()
      document.body.style.overflow = ""
    }
  }, [product, onClose])

  if (!product) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-sm bg-background shadow-2xl md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur transition-colors hover:bg-background"
          aria-label="Close quick view"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Image with hover zoom */}
        <div className="group/zoom relative aspect-[4/5] overflow-hidden bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 384px, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover/zoom:scale-[1.06]"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center p-6 md:p-8">
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {product.collection}
          </p>
          <h3 className="mt-2 font-serif text-3xl tracking-tight">{product.name}</h3>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="font-serif text-2xl">{formatCurrency(product.price)}</span>
            {product.compareAt && (
              <span className="text-sm text-muted-foreground line-through">
                {formatCurrency(product.compareAt)}
              </span>
            )}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          {/* Palette */}
          <div className="mt-4 flex items-center gap-2">
            {product.palette.map((c) => (
              <span
                key={c}
                className="h-4 w-4 rounded-full ring-1 ring-foreground/10"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              className="snipcart-add-item flex items-center justify-center gap-2 bg-foreground py-3.5 text-[11px] uppercase tracking-[0.22em] text-background transition-colors hover:bg-foreground/90"
              data-item-id={product.id}
              data-item-name={product.name}
              data-item-price={product.price}
              data-item-url={`${siteUrl}/product/${product.slug}`}
              data-item-image={product.image}
              data-item-description={product.description}
            >
              <Plus className="h-3.5 w-3.5" />
              Add to Cart
            </button>
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href={`/product/${product.slug}`} onClick={onClose}>
                View Full Details
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
