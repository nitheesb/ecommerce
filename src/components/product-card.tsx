"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Plus, Eye } from "lucide-react"
import { absoluteUrl, cn, formatCurrency } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/products"
import { useUiStore } from "@/hooks/use-ui-store"

interface ProductCardProps {
  product: Product
  className?: string
  priority?: boolean
  onQuickView?: (product: Product) => void
  hideQuickAdd?: boolean
}

export function ProductCard({ product, className, priority, onQuickView, hideQuickAdd = false }: ProductCardProps) {
  const { isWishlisted, toggleWishlist } = useUiStore()
  const wishlisted = isWishlisted(product.id)
  const [imageLoaded, setImageLoaded] = React.useState(false)

  const productUrl = absoluteUrl(`/product/${product.slug}`)
  const productImage = absoluteUrl(product.image)
  const isOutOfStock = product.stockStatus === "outOfStock" || product.stockQuantity === 0

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
      <div className="relative overflow-hidden bg-muted [perspective:800px]">
        <div className="transition-transform duration-700 ease-out motion-safe:group-hover:[transform:rotateY(2deg)_rotateX(1deg)]">
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
              "object-cover object-top transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:opacity-0",
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
        </div>

        {/* Badge */}
        {product.badge && (
          <Badge
            variant={badgeVariant as any}
            className="absolute left-3 top-3"
          >
            {product.badge}
          </Badge>
        )}
        {isOutOfStock && (
          <Badge
            variant="outline"
            className={cn("absolute left-3 bg-background/90 text-foreground backdrop-blur", product.badge ? "top-12" : "top-3")}
          >
            Out of Stock
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
              className="hidden h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur transition-all duration-300 hover:bg-background lg:flex lg:translate-y-1 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
            >
              <Eye className="h-[14px] w-[14px]" />
            </button>
          )}
        </div>

        {/* Quick Add — Snipcart add-to-cart button */}
        {!hideQuickAdd && (
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            disabled={isOutOfStock}
            aria-disabled={isOutOfStock}
            className={cn(
              "absolute inset-x-3 bottom-3 hidden items-center justify-center gap-2 py-3 text-[11px] uppercase tracking-[0.22em] transition-all duration-500 lg:flex lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100",
              isOutOfStock
                ? "cursor-not-allowed bg-background/90 text-muted-foreground backdrop-blur hover:bg-background/90"
                : "snipcart-add-item bg-foreground text-background hover:bg-foreground/90",
            )}
            aria-label={isOutOfStock ? `${product.name} is out of stock` : `Quick add ${product.name}`}
            {...(isOutOfStock
              ? {}
              : {
                  "data-item-id": product.id,
                  "data-item-name": product.name,
                  "data-item-price": product.price,
                  "data-item-url": productUrl,
                  "data-item-image": productImage,
                  "data-item-description": product.description,
                })}
          >
            <Plus className="h-3.5 w-3.5" />
            {isOutOfStock ? "Out of Stock" : "Quick Add"}
          </button>
        )}
      </div>

      {/* Meta */}
      <div className="mt-4 px-0.5">
        <h3 className="font-serif text-[21px] leading-[1.15] tracking-tight text-foreground">
          {product.name}
        </h3>
        <p className="mt-2 overflow-hidden text-sm leading-relaxed text-muted-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
          {product.description}
        </p>

        <div className="mt-3">
          <p className="font-serif text-base leading-tight md:text-lg">
            {formatCurrency(product.price)}
          </p>
          {product.compareAt && (
            <p className="mt-1 text-[11px] text-muted-foreground line-through">
              {formatCurrency(product.compareAt)}
            </p>
          )}
          {isOutOfStock && (
            <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Currently out of stock
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
