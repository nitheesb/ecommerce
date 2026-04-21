"use client"

import { useMemo, useState } from "react"
import { Search as SearchIcon } from "lucide-react"

import { ProductGrid } from "@/components/product-grid"
import type { Product } from "@/lib/products"
import { searchProducts } from "@/lib/products"

interface SearchPageClientProps {
  products: Product[]
  initialQuery?: string
}

export function SearchPageClient({
  products,
  initialQuery = "",
}: SearchPageClientProps) {
  const [query, setQuery] = useState(initialQuery)

  const results = useMemo(() => searchProducts(products, query), [products, query])
  const hasQuery = query.trim().length > 0

  return (
    <>
      <div className="mt-8 flex items-center gap-3 border-b border-foreground/20 pb-3 focus-within:border-foreground">
        <SearchIcon className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for sarees, fabrics, colors..."
          className="w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
          autoFocus
        />
      </div>

      <div className="mt-6">
        {hasQuery ? (
          <p className="text-center text-sm text-muted-foreground">
            {results.length} {results.length === 1 ? "result" : "results"} for{" "}
            <span className="font-medium text-foreground">{query.trim()}</span>
          </p>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            Try searching for <span className="font-medium text-foreground">silk</span>,{" "}
            <span className="font-medium text-foreground">cotton</span>, or{" "}
            <span className="font-medium text-foreground">festive</span>
          </p>
        )}
      </div>

      <div className="mt-10">
        {results.length > 0 ? (
          <ProductGrid products={results} />
        ) : (
          <div className="py-12 text-center">
            <p className="font-serif text-2xl">No sarees matched your search</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Try a fabric, weave, colour, or collection name.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
