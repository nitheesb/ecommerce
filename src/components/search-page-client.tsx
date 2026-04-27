"use client"

import Image from "next/image"
import Link from "next/link"
import { useDeferredValue, useEffect, useMemo, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, Search as SearchIcon, X } from "lucide-react"

import { ProductGrid } from "@/components/product-grid"
import type { Product } from "@/lib/products"
import { searchProducts } from "@/lib/products"
import { formatCurrency } from "@/lib/utils"

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
    image: "/images/saree-1-a.jpg",
    keywords: ["silk", "kanjeevaram", "banarasi", "ceremony", "wedding"],
  },
  {
    title: "Festive Edit",
    description: "Pieces curated for weddings, gifting, and grand celebrations.",
    href: "/collections/festive",
    image: "/images/saree-4-a.jpg",
    keywords: ["festive", "bridal", "wedding", "occasion", "celebration"],
  },
  {
    title: "Shop by Prints",
    description: "Ajrakh, Kalamkari, Bandhani, and more artisan print stories.",
    href: "/collections/prints",
    image: "/images/saree-6-b.jpg",
    keywords: ["prints", "ajrakh", "kalamkari", "bandhani", "bagru"],
  },
  {
    title: "Cotton Comforts",
    description: "Breathable handloom sarees for everyday grace.",
    href: "/collections/cotton",
    image: "/images/saree-2-a.jpg",
    keywords: ["cotton", "dailywear", "handloom", "soft", "comfort"],
  },
  {
    title: "Colour Stories",
    description: "Browse by maroon, ivory, blue, green, yellow, and more.",
    href: "/collections/by-colour",
    image: "/images/saree-3-a.jpg",
    keywords: ["color", "colour", "maroon", "ivory", "blue", "green", "yellow", "red"],
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
  const normalizedQuery = deferredQuery.trim().toLowerCase()
  const collectionMatches = useMemo(() => {
    if (!normalizedQuery) return suggestedCollections.slice(0, 3)

    const terms = normalizedQuery.split(/\s+/).filter(Boolean)

    return suggestedCollections
      .filter((collection) => {
        const haystack = [
          collection.title,
          collection.description,
          collection.href,
          ...collection.keywords,
        ]
          .join(" ")
          .toLowerCase()

        return terms.every((term) => haystack.includes(term))
      })
      .slice(0, 4)
  }, [normalizedQuery])
  const previewProducts = (hasQuery ? results : products).slice(0, 4)

  return (
    <>
      <div className="mx-auto mt-8 max-w-5xl">
        <div className="overflow-hidden rounded-[34px] border border-border/70 bg-background shadow-[0_22px_80px_rgba(15,23,42,0.08)]">
          <div className="flex items-center gap-3 border-b border-border/60 px-5 py-4 focus-within:border-foreground/30 md:px-6">
            <SearchIcon className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for sarees, fabrics, colors..."
              className="w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            )}
          </div>

          <div className="grid gap-0 md:grid-cols-[1.25fr_0.75fr]">
            <div className="border-b border-border/60 p-5 md:border-b-0 md:border-r md:p-6">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-muted-foreground">
                  {hasQuery ? "Top Matches" : "Start Here"}
                </p>
                {hasQuery && (
                  <p className="text-xs text-muted-foreground">
                    {results.length} {results.length === 1 ? "piece" : "pieces"}
                  </p>
                )}
              </div>

              <div className="mt-4 grid gap-3">
                {previewProducts.length > 0 ? (
                  previewProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      className="group grid grid-cols-[72px_1fr] items-center gap-4 rounded-[22px] border border-border/50 bg-secondary/20 p-2.5 transition-colors hover:border-foreground/20 hover:bg-secondary/40 sm:grid-cols-[72px_1fr_auto]"
                    >
                      <div className="relative h-[86px] overflow-hidden rounded-[16px] bg-muted">
                        <Image
                          src={product.image}
                          alt={`${product.name} saree`}
                          fill
                          sizes="72px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                          {product.collection}
                        </p>
                        <h3 className="mt-1 truncate font-serif text-lg leading-tight sm:text-xl">
                          {product.name}
                        </h3>
                        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                          {product.category} weave
                        </p>
                      </div>
                      <p className="hidden shrink-0 font-serif text-base sm:block">
                        {formatCurrency(product.price)}
                      </p>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-[22px] border border-dashed border-border/70 bg-secondary/20 p-6 text-sm leading-relaxed text-muted-foreground">
                    No immediate product match. Try a fabric, colour, weave name, or use the collection paths beside this.
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 md:p-6">
              <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-muted-foreground">
                Collection Paths
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {collectionMatches.length > 0 ? (
                  collectionMatches.map((collection) => (
                    <Link
                      key={collection.href}
                      href={collection.href}
                      className="group inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-3 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/75 transition-colors hover:border-foreground/30 hover:text-foreground"
                    >
                      <span className="relative h-7 w-7 overflow-hidden rounded-full bg-muted">
                        <Image
                          src={collection.image}
                          alt=""
                          fill
                          sizes="28px"
                          className="object-cover"
                        />
                      </span>
                      {collection.title}
                    </Link>
                  ))
                ) : (
                  suggestedCollections.slice(0, 3).map((collection) => (
                    <Link
                      key={collection.href}
                      href={collection.href}
                      className="rounded-full border border-border/70 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/75 transition-colors hover:border-foreground/30 hover:text-foreground"
                    >
                      {collection.title}
                    </Link>
                  ))
                )}
              </div>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                Search understands names, fabrics, categories, badges, descriptions, and collection routes.
              </p>
            </div>
          </div>
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
