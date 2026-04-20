"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

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

  const toggleFilter = useCallback(
    (value: string, selected: string[], setSelected: (v: string[]) => void) => {
      setSelected(
        selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]
      )
    },
    []
  )

  const hasFilters =
    selectedFabrics.length > 0 || selectedOccasions.length > 0

  const clearAll = useCallback(() => {
    setSelectedFabrics([])
    setSelectedOccasions([])
    setPriceRange([0, 130000])
  }, [])

  return (
    <section className="mx-auto max-w-7xl px-6 pt-16 pb-20 lg:px-12 lg:pt-20 lg:pb-24">
      {/* Shop All Sarees heading */}
      <div className="mb-10 flex items-center justify-between border-b border-border/40 pb-6">
        <h2 className="font-serif text-3xl tracking-tight md:text-4xl">Shop All Sarees</h2>
        <Link
          href="/collections"
          className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-foreground underline-offset-8 hover:underline"
        >
          Shop All
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
        {/* Filters sidebar */}
        <aside className="w-full shrink-0 lg:w-[220px]">
          <div className="flex items-center justify-between mb-2">
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
                <div className="space-y-3">
                  <input
                    type="range"
                    min={0}
                    max={130000}
                    step={500}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full accent-foreground"
                  />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="rounded border border-border px-2 py-1 text-xs">
                      &#x20B9; {priceRange[0].toLocaleString("en-IN")}
                    </span>
                    <span>to</span>
                    <span className="rounded border border-border px-2 py-1 text-xs">
                      &#x20B9; {priceRange[1].toLocaleString("en-IN")}
                    </span>
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
          <ProductGrid products={products} />
        </div>
      </div>
    </section>
  )
}
