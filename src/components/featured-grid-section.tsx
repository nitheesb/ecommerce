"use client"

import { useState, useCallback, useMemo } from "react"
import Link from "next/link"
import { ArrowRight, SlidersHorizontal, X } from "lucide-react"

import { ProductGrid } from "@/components/product-grid"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { Product } from "@/lib/products"

const fabricOptions = [
  "Cotton", "Linen", "Modal", "Silk", "Soft Silks", "Tussar",
  "Silk Cotton", "Crepe", "Chiffon", "Organza", "Georgette",
]

const occasionOptions = ["Dailywear", "Festive"]

interface FeaturedGridSectionProps {
  products: Product[]
}

export function FeaturedGridSection({ products }: FeaturedGridSectionProps) {
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([])
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 130000])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const toggleFilter = useCallback(
    (value: string, selected: string[], setSelected: (v: string[]) => void) => {
      setSelected(
        selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]
      )
    },
    []
  )

  const hasFilters =
    selectedFabrics.length > 0 || selectedOccasions.length > 0 || priceRange[0] > 0 || priceRange[1] < 130000

  const clearAll = useCallback(() => {
    setSelectedFabrics([])
    setSelectedOccasions([])
    setPriceRange([0, 130000])
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false

      // Fabric filter — match against category or collection
      if (selectedFabrics.length > 0) {
        const matchesFabric = selectedFabrics.some(
          (fabric) =>
            product.category.toLowerCase() === fabric.toLowerCase() ||
            product.collection.toLowerCase().includes(fabric.toLowerCase())
        )
        if (!matchesFabric) return false
      }

      // Occasion filter — match against badge or collection keywords
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
  }, [products, selectedFabrics, selectedOccasions, priceRange])

  const activeFilterCount =
    selectedFabrics.length + selectedOccasions.length + (priceRange[0] > 0 || priceRange[1] < 130000 ? 1 : 0)

  return (
    <section className="mx-auto max-w-7xl px-6 pt-16 pb-20 lg:px-12 lg:pt-20 lg:pb-24">
      {/* Shop All Sarees heading */}
      <div className="mb-10 flex items-center justify-between border-b border-border/40 pb-6">
        <h2 className="font-serif text-3xl tracking-tight md:text-4xl">Shop All Sarees</h2>
        <Link
          href="/collections/all-sarees"
          className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-foreground underline-offset-8 hover:underline"
        >
          Shop All
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Mobile filter toggle */}
      <div className="mb-6 flex items-center gap-3 lg:hidden">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="inline-flex items-center gap-2 border border-border px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors hover:bg-secondary/50"
        >
          {mobileFiltersOpen ? (
            <X className="h-3.5 w-3.5" />
          ) : (
            <SlidersHorizontal className="h-3.5 w-3.5" />
          )}
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-foreground px-1 text-[9px] text-background">
              {activeFilterCount}
            </span>
          )}
        </button>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
        {/* Filters sidebar — hidden on mobile unless toggled */}
        <aside className={`w-full shrink-0 lg:block lg:w-[220px] ${mobileFiltersOpen ? "block" : "hidden lg:block"}`}>
          <div className="hidden items-center justify-between mb-2 lg:flex">
            <h3 className="text-base font-medium">Filters</h3>
            {hasFilters && (
              <button
                onClick={clearAll}
                className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Clear all
              </button>
            )}
          </div>

          <Accordion type="multiple" defaultValue={["fabric"]}>
            {/* Price */}
            <AccordionItem value="price">
              <AccordionTrigger className="text-sm normal-case tracking-normal">
                Price
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Min</span>
                      <span>&#x20B9; {priceRange[0].toLocaleString("en-IN")}</span>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={130000}
                      step={500}
                      value={priceRange[0]}
                      onChange={(e) => {
                        const min = Number(e.target.value)
                        setPriceRange([Math.min(min, priceRange[1]), priceRange[1]])
                      }}
                      className="w-full accent-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Max</span>
                      <span>&#x20B9; {priceRange[1].toLocaleString("en-IN")}</span>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={130000}
                      step={500}
                      value={priceRange[1]}
                      onChange={(e) => {
                        const max = Number(e.target.value)
                        setPriceRange([priceRange[0], Math.max(max, priceRange[0])])
                      }}
                      className="w-full accent-foreground"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Fabric */}
            <AccordionItem value="fabric">
              <AccordionTrigger className="text-sm normal-case tracking-normal">
                Fabric
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2.5">
                  {fabricOptions.map((fabric) => (
                    <label key={fabric} className="flex items-center gap-2.5 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={selectedFabrics.includes(fabric)}
                        onChange={() => toggleFilter(fabric, selectedFabrics, setSelectedFabrics)}
                        className="h-3.5 w-3.5 rounded-sm border border-border accent-foreground"
                      />
                      <span className="text-foreground/80">{fabric}</span>
                    </label>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Occasion */}
            <AccordionItem value="occasion">
              <AccordionTrigger className="text-sm normal-case tracking-normal">
                Occasion
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2.5">
                  {occasionOptions.map((occasion) => (
                    <label key={occasion} className="flex items-center gap-2.5 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={selectedOccasions.includes(occasion)}
                        onChange={() => toggleFilter(occasion, selectedOccasions, setSelectedOccasions)}
                        className="h-3.5 w-3.5 rounded-sm border border-border accent-foreground"
                      />
                      <span className="text-foreground/80">{occasion}</span>
                    </label>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="font-serif text-2xl">No sarees match your filters</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Try adjusting your filters or{" "}
                <button onClick={clearAll} className="underline underline-offset-4 hover:text-foreground">
                  clear all filters
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
