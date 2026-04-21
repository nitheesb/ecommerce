"use client"

import { useCallback, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { ProductGrid } from "@/components/product-grid"
import type { Product } from "@/lib/products"

const fabricOptions = [
  "Cotton",
  "Linen",
  "Modal",
  "Silk",
  "Soft Silks",
  "Tussar",
  "Silk Cotton",
  "Crepe",
  "Chiffon",
  "Organza",
  "Georgette",
]

const occasionOptions = ["Dailywear", "Festive"]

interface FeaturedGridSectionProps {
  products: Product[]
}

export function FeaturedGridSection({ products }: FeaturedGridSectionProps) {
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([])
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([])

  const toggleFilter = useCallback(
    (value: string, selected: string[], setSelected: (v: string[]) => void) => {
      setSelected(
        selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]
      )
    },
    []
  )

  const hasFilters = selectedFabrics.length > 0 || selectedOccasions.length > 0

  const clearAll = useCallback(() => {
    setSelectedFabrics([])
    setSelectedOccasions([])
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (selectedFabrics.length > 0) {
        const matchesFabric = selectedFabrics.some(
          (fabric) =>
            product.category.toLowerCase() === fabric.toLowerCase() ||
            product.collection.toLowerCase().includes(fabric.toLowerCase())
        )
        if (!matchesFabric) return false
      }

      if (selectedOccasions.length > 0) {
        const matchesOccasion = selectedOccasions.some((occasion) => {
          if (occasion === "Dailywear") {
            return product.category === "Cotton" || product.price < 15000
          }
          if (occasion === "Festive") {
            return product.category === "Silk" || product.category === "Heritage" || product.price >= 15000
          }
          return false
        })
        if (!matchesOccasion) return false
      }

      return true
    })
  }, [products, selectedFabrics, selectedOccasions])

  const activeFilterCount = selectedFabrics.length + selectedOccasions.length

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-20">
      <div className="mb-10 grid gap-6 border-b border-border/40 pb-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
            Shop the collection
          </p>
          <h2 className="mt-3 font-serif text-3xl tracking-tight md:text-4xl lg:text-5xl">
            A few signature drapes to begin with
          </h2>
        </div>
        <div className="flex flex-col gap-4 lg:items-end">
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-base lg:text-right">
            Start with a curated edit, then narrow by fabric or occasion only if you want to.
          </p>
          <Link
            href="/collections/all-sarees"
            className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-foreground underline-offset-8 hover:underline"
          >
            View all sarees
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <div className="mb-8 rounded-[28px] border border-border/50 bg-secondary/20 p-5 md:p-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Filter by fabric
              </p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {fabricOptions.map((fabric) => {
                  const active = selectedFabrics.includes(fabric)
                  return (
                    <button
                      key={fabric}
                      type="button"
                      onClick={() => toggleFilter(fabric, selectedFabrics, setSelectedFabrics)}
                      className={`rounded-full border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] transition-colors ${
                        active
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-background text-foreground hover:border-foreground/30"
                      }`}
                    >
                      {fabric}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Occasion
              </p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {occasionOptions.map((occasion) => {
                  const active = selectedOccasions.includes(occasion)
                  return (
                    <button
                      key={occasion}
                      type="button"
                      onClick={() => toggleFilter(occasion, selectedOccasions, setSelectedOccasions)}
                      className={`rounded-full border px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] transition-colors ${
                        active
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-background text-foreground hover:border-foreground/30"
                      }`}
                    >
                      {occasion}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-border/50 pt-4">
            <p className="text-sm text-muted-foreground">
              {filteredProducts.length} {filteredProducts.length === 1 ? "piece" : "pieces"} shown
            </p>
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-foreground px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-background">
                {activeFilterCount} active
              </span>
            )}
            {hasFilters && (
              <button
                onClick={clearAll}
                className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} minimal />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="font-serif text-2xl">No sarees match your filters</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Try a broader fabric or{" "}
            <button onClick={clearAll} className="underline underline-offset-4 hover:text-foreground">
              clear all filters
            </button>
            .
          </p>
        </div>
      )}
    </section>
  )
}
