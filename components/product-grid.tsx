"use client"

import * as React from "react"
import { ProductCard } from "@/components/product-card"
import { ProductGridSkeleton } from "@/components/product-grid-skeleton"
import type { Product } from "@/lib/products"

export function ProductGrid({
  products,
  simulateLoading = true,
}: {
  products: Product[]
  simulateLoading?: boolean
}) {
  const [loading, setLoading] = React.useState(simulateLoading)

  React.useEffect(() => {
    if (!simulateLoading) return
    const t = setTimeout(() => setLoading(false), 900)
    return () => clearTimeout(t)
  }, [simulateLoading])

  if (loading) {
    return <ProductGridSkeleton count={products.length} />
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < 4} />
      ))}
    </div>
  )
}
