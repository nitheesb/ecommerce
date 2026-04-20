"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Plus, Eye } from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/products"
import { useUiStore } from "@/hooks/use-ui-store"

interface ProductCardProps {
  product: Product
  className?: string
  priority?: boolean
  onQuickView?: (product: Product) => void
}

export function ProductCard({ product, className, priority, onQuickView }: ProductCardProps) {
  const { isWishlisted, toggleWishlist } = useUiStore()
  const wishlisted = isWishlisted(product.id)
  const [imageLoaded, setImageLoaded] = React.useState(false)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ""

  const badgeVariant =
    product.badge === "Limited Edition"
      ? "heritage"
      : product.badge === "Heritage"
      ? "gold"
      : product.badge === "Bestseller"
      ? "sand"
      : "outline"

  return (
    <Link
      href={`/product/${product.slug}`}
      className={cn("group relative block", className)}
    >
      <div className="relative overflow-hidden bg-muted">
        <AspectRatio ratio={4 / 5}>
          {/* Skeleton shimmer */}
          {!imageLoaded && (
            <div className="absolute inset-0 z-10 animate-pulse bg-gradient-to-r from-muted via-muted-foreground/5 to-muted" />
          )}
          {/* Primary image */}
          <Image
            src={product.image}
            alt={`${product.name} — ${product.collection} saree`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            onLoad={() => setImageLoaded(true)}
            className={cn(
              "object-cover transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:opacity-0",
              !imageLoaded && "opacity-0"
            )}
          />
          {/* Hover image */}
          <Image
            src={product.hoverImage}
            alt=""
            aria-hidden
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:opacity-100"
          />
        </AspectRatio>

        {/* Badge */}
        {product.badge && (
          <Badge
            variant={badgeVariant as any}
            className="absolute left-3 top-3"
          >
            {product.badge}
          </Badge>
        )}

        {/* Wishlist */}
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              toggleWishlist(product.id)
            }}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur transition-all hover:bg-background"
          >
            <Heart
              className={cn(
                "h-[14px] w-[14px] transition-all",
                wishlisted && "fill-foreground"
              )}
            />
          </button>
          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                onQuickView(product)
              }}
              aria-label={`Quick view ${product.name}`}
              className="flex h-9 w-9 translate-y-1 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur opacity-0 transition-all duration-300 hover:bg-background group-hover:translate-y-0 group-hover:opacity-100"
            >
              <Eye className="h-[14px] w-[14px]" />
            </button>
          )}
        </div>

        {/* Quick Add — Snipcart add-to-cart button */}
        <button
          type="button"
          onClick={(e) => e.preventDefault()}
          className="snipcart-add-item absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-center gap-2 bg-foreground py-3 text-[11px] uppercase tracking-[0.22em] text-background opacity-0 transition-all duration-500 hover:bg-foreground/90 group-hover:translate-y-0 group-hover:opacity-100"
          aria-label={`Quick add ${product.name}`}
          data-item-id={product.id}
          data-item-name={product.name}
          data-item-price={product.price}
          data-item-url={`${siteUrl}/product/${product.slug}`}
          data-item-image={product.image}
          data-item-description={product.description}
        >
          <Plus className="h-3.5 w-3.5" />
          Quick Add
        </button>
      </div>

      {/* Meta */}
      <div className="mt-4 flex items-start justify-between gap-3 px-0.5">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {product.collection}
          </p>
          <h3 className="mt-1 truncate font-serif text-lg leading-tight">
            {product.name}
          </h3>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-serif text-lg leading-tight">
            {formatCurrency(product.price)}
          </p>
          {product.compareAt && (
            <p className="text-[11px] text-muted-foreground line-through">
              {formatCurrency(product.compareAt)}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
