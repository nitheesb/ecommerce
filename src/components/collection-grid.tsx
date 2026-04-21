"use client"

import { useState } from "react"
import Link from "next/link"

import { ProductGrid } from "@/components/product-grid"
import type { Product } from "@/lib/products"

type SortKey = "featured" | "price-asc" | "price-desc"

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price \u00b7 Low to High" },
  { value: "price-desc", label: "Price \u00b7 High to Low" },
]

export function CollectionGrid({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<SortKey>("featured")

  const sorted = [...products].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price
    if (sort === "price-desc") return b.price - a.price
    return 0
  })

  if (products.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-12 text-center">
        <p className="font-serif text-3xl">No pieces found in this collection</p>
        <p className="mt-4 text-sm text-muted-foreground">
          This collection is being curated. In the meantime, explore our other sarees.
        </p>
        <Link
          href="/collections/all-sarees"
          className="mt-8 inline-block bg-foreground px-8 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-background transition-colors hover:bg-foreground/90"
        >
          Browse All Sarees
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-12 lg:py-16">
      <div className="mb-8 flex items-center justify-between gap-4 border-y border-border/60 py-4">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
          {products.length} {products.length === 1 ? "piece" : "pieces"}
        </p>
        <label className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          <span className="hidden sm:inline">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="border-0 bg-transparent text-xs font-medium uppercase tracking-[0.2em] text-foreground focus:outline-none focus:ring-0"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ProductGrid products={sorted} />
    </section>
  )
}
