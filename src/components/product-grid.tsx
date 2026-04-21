"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ProductCard } from "@/components/product-card"
import { QuickView } from "@/components/quick-view"
import type { Product } from "@/lib/products"

gsap.registerPlugin(ScrollTrigger)

export function ProductGrid({
  products,
  minimal = false,
}: {
  products: Product[]
  minimal?: boolean
}) {
  const gridRef = useRef<HTMLDivElement>(null)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  const handleQuickView = useCallback((product: Product) => {
    setQuickViewProduct(product)
  }, [])

  const handleCloseQuickView = useCallback(() => {
    setQuickViewProduct(null)
  }, [])

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const ctx = gsap.context(() => {
      const cards = grid.querySelectorAll<HTMLElement>(".product-card-item")
      if (!cards.length) return

      gsap.set(cards, { opacity: 0, y: 24 })

      ScrollTrigger.create({
        trigger: grid,
        start: "top 88%",
        once: true,
        onEnter: () => {
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.08,
            ease: "power2.out",
          })
        },
      })
    }, gridRef)

    return () => ctx.revert()
  }, [products])

  return (
    <>
      <div
        ref={gridRef}
        className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4"
      >
        {products.map((p, i) => (
          <div key={p.id} className="product-card-item">
            <ProductCard
              product={p}
              priority={i < 4}
              onQuickView={minimal ? undefined : handleQuickView}
              hideQuickAdd
              minimal={minimal}
            />
          </div>
        ))}
      </div>
      {!minimal && <QuickView product={quickViewProduct} onClose={handleCloseQuickView} />}
    </>
  )
}
