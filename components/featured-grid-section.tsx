"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { ProductGrid } from "@/components/product-grid"
import { ProductGridSkeleton } from "@/components/product-grid-skeleton"
import { products } from "@/lib/products"

export function FeaturedGridSection() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-24">
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "The Atelier", href: "/collections" },
            { label: "New Arrivals" },
          ]}
        />
      </div>

      <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
            New Arrivals &mdash; Vol. III
          </p>
          <h2 className="mt-4 max-w-2xl text-balance font-serif text-4xl leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
            The Monsoon Edit.
          </h2>
          <p className="mt-5 max-w-lg text-pretty leading-relaxed text-muted-foreground">
            Eight new weaves, in tones of rain-washed ivory and earth. Limited pieces, each
            individually numbered.
          </p>
        </div>
        <Link
          href="/collections"
          className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-foreground underline-offset-8 hover:underline"
        >
          Shop All
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {isLoading ? <ProductGridSkeleton /> : <ProductGrid products={products} />}
    </section>
  )
}
