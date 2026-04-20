"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ProductCard } from "@/components/product-card"
import { QuickView } from "@/components/quick-view"
import type { Product } from "@/lib/products"

gsap.registerPlugin(ScrollTrigger)

export function ProductGrid({ products }: { products: Product[] }) {
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

    const cards = grid.querySelectorAll<HTMLElement>(".product-card-item")
    gsap.set(cards, { opacity: 0, y: 30, clipPath: "inset(100% 0 0 0)" })

    const trigger = ScrollTrigger.create({
      trigger: grid,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          clipPath: "inset(0% 0 0 0)",
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "clipPath",
        })
      },
    })

    return () => trigger.kill()
  }, [])

  return (
    <>
      <div
        ref={gridRef}
        className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4"
      >
        {products.map((p, i) => (
          <div key={p.id} className="product-card-item">
            <ProductCard product={p} priority={i < 4} onQuickView={handleQuickView} hideQuickAdd />
          </div>
        ))}
      </div>
      <QuickView product={quickViewProduct} onClose={handleCloseQuickView} />
    </>
  )
}
