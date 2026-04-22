"use client"

import Link from "next/link"
import { useDeferredValue, useEffect, useMemo, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, Search as SearchIcon } from "lucide-react"

import { ProductGrid } from "@/components/product-grid"
import type { Product } from "@/lib/products"
import { searchProducts } from "@/lib/products"

interface SearchPageClientProps {
  products: Product[]
  initialQuery?: string
}

const popularSearches = ["silk", "cotton", "festive", "banarasi", "bridal", "ajrakh"]

const suggestedCollections = [
  {
    title: "Silk Sarees",
    description: "Ceremonial weaves and luminous heirloom drapes.",
    href: "/collections/silk",
  },
  {
    title: "Festive Edit",
    description: "Pieces curated for weddings, gifting, and grand celebrations.",
    href: "/collections/festive",
  },
  {
    title: "Shop by Prints",
    description: "Ajrakh, Kalamkari, Bandhani, and more artisan print stories.",
    href: "/collections/prints",
  },
]

export function SearchPageClient({
  products,
  initialQuery = "",
}: SearchPageClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(initialQuery)
  const [isPending, startTransition] = useTransition()
  const deferredQuery = useDeferredValue(query)

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  useEffect(() => {
    const nextQuery = query.trim()
    const currentQuery = searchParams.get("q")?.trim() ?? ""

    if (nextQuery === currentQuery) return

    const timeoutId = window.setTimeout(() => {
      const nextParams = new URLSearchParams(searchParams.toString())

      if (nextQuery) {
        nextParams.set("q", nextQuery)
      } else {
        nextParams.delete("q")
      }

      const nextUrl = nextParams.toString() ? `${pathname}?${nextParams.toString()}` : pathname

      startTransition(() => {
        router.replace(nextUrl, { scroll: false })
      })
    }, 180)

    return () => window.clearTimeout(timeoutId)
  }, [pathname, query, router, searchParams])

  const results = useMemo(() => searchProducts(products, deferredQuery), [products, deferredQuery])
  const hasQuery = deferredQuery.trim().length > 0

  return (
    <>
      <div className="mx-auto mt-8 max-w-4xl">
        <div className="flex items-center gap-3 border-b border-foreground/20 pb-3 focus-within:border-foreground">
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
      </div>

      <div className="mt-8 min-h-[28px] text-center text-sm text-muted-foreground">
        {hasQuery ? (
          <p>
            {results.length} {results.length === 1 ? "result" : "results"} for{" "}
            <span className="font-medium text-foreground">{deferredQuery.trim()}</span>
            {isPending ? " ..." : null}
          </p>
        ) : (
          <p>Search by weave, fabric, color, occasion, or collection name.</p>
        )}
      </div>

      {!hasQuery ? (
        <div className="mt-14 space-y-14">
          <section className="text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              Popular Searches
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="rounded-full border border-border/60 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/75 transition-colors hover:border-foreground/30 hover:text-foreground"
                >
                  {term}
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                  Start With a Collection
                </p>
                <h2 className="mt-3 font-serif text-3xl tracking-tight md:text-4xl">
                  Browse from a curated starting point.
                </h2>
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {suggestedCollections.map((collection) => (
                <Link
                  key={collection.href}
                  href={collection.href}
                  className="group rounded-[24px] border border-border/50 bg-secondary/20 p-6 transition-colors hover:border-foreground/20 hover:bg-secondary/40"
                >
                  <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                    Collection
                  </p>
                  <h3 className="mt-4 font-serif text-2xl tracking-tight">{collection.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{collection.description}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-foreground">
                    Explore
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="mt-10">
          {results.length > 0 ? (
            <ProductGrid products={results} />
          ) : (
            <div className="rounded-[28px] border border-border/60 bg-secondary/20 px-6 py-14 text-center">
              <p className="font-serif text-2xl md:text-3xl">No sarees matched your search</p>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Try another weave, colour, or collection name, or jump into one of our curated browsing paths below.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                {popularSearches.slice(0, 4).map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="rounded-full border border-border/60 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/75 transition-colors hover:border-foreground/30 hover:text-foreground"
                  >
                    Try {term}
                  </button>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                {suggestedCollections.slice(0, 2).map((collection) => (
                  <Link
                    key={collection.href}
                    href={collection.href}
                    className="text-sm font-medium text-foreground underline underline-offset-4"
                  >
                    {collection.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
