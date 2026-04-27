"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Bell, Layers3, Sparkles } from "lucide-react"

import { ProductGrid } from "@/components/product-grid"
import type { Product } from "@/lib/products"

type SortKey = "featured" | "price-asc" | "price-desc"

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price \u00b7 Low to High" },
  { value: "price-desc", label: "Price \u00b7 High to Low" },
]

const comingSoonCards = [
  {
    title: "Client curation pending",
    description: "This path is ready for the final assortment once the client approves the product structure.",
    image: "/images/saree-5-a.jpg",
    icon: Layers3,
  },
  {
    title: "Editorial story ready",
    description: "The page already has its mood, title, and browsing intent so it will not feel empty during approval.",
    image: "/images/saree-6-b.jpg",
    icon: Sparkles,
  },
  {
    title: "Drop alert friendly",
    description: "Use this space for an upcoming drop, waitlist, or WhatsApp enquiry before backend inventory is live.",
    image: "/images/saree-7-a.jpg",
    icon: Bell,
  },
]

const fallbackCollections = [
  { label: "All Sarees", href: "/collections/all-sarees" },
  { label: "Silk", href: "/collections/silk" },
  { label: "Festive", href: "/collections/festive" },
  { label: "Cotton", href: "/collections/cotton" },
]

export function CollectionGrid({
  products,
  collectionTitle = "This collection",
  collectionDescription,
}: {
  products: Product[]
  collectionTitle?: string
  collectionDescription?: string
}) {
  const [sort, setSort] = useState<SortKey>("featured")

  const sorted = [...products].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price
    if (sort === "price-desc") return b.price - a.price
    return 0
  })

  if (products.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-20">
        <div className="overflow-hidden rounded-[34px] border border-border/60 bg-[linear-gradient(135deg,#fbf8f1_0%,#f3eadb_52%,#fbf8f1_100%)] shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
          <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="relative min-h-[22rem] overflow-hidden bg-foreground text-background">
              <Image
                src="/images/hero-red-portrait.png"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-[70%_center] opacity-[0.78]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/86 via-foreground/36 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 md:p-9">
                <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-background/68">
                  Coming Into The House
                </p>
                <h2 className="mt-4 max-w-md font-serif text-4xl leading-[1.04] tracking-tight md:text-5xl">
                  {collectionTitle} is being shaped with intention.
                </h2>
                {collectionDescription && (
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-background/76">
                    {collectionDescription}
                  </p>
                )}
              </div>
            </div>

            <div className="p-6 md:p-8 lg:p-10">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                Not Empty, Just Not Released
              </p>
              <p className="mt-4 max-w-2xl text-pretty font-serif text-3xl leading-[1.12] tracking-tight md:text-4xl">
                This category is ready for client approval and future inventory.
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                Until the backend catalogue is connected, this page now behaves like a polished preview instead of a broken shelf.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {comingSoonCards.map((card) => {
                  const Icon = card.icon

                  return (
                    <article
                      key={card.title}
                      className="overflow-hidden rounded-[24px] border border-border/60 bg-background/72 shadow-[0_12px_38px_rgba(15,23,42,0.05)]"
                    >
                      <div className="relative h-32 overflow-hidden bg-muted">
                        <Image
                          src={card.image}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 100vw, 220px"
                          className="object-cover"
                        />
                        <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/88 text-foreground backdrop-blur">
                          <Icon className="h-4 w-4" strokeWidth={1.5} />
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-serif text-xl leading-tight">{card.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {card.description}
                        </p>
                      </div>
                    </article>
                  )
                })}
              </div>

              <div className="mt-8 flex flex-col gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  {fallbackCollections.map((collection) => (
                    <Link
                      key={collection.href}
                      href={collection.href}
                      className="rounded-full border border-border/70 bg-background/70 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/75 transition-colors hover:border-foreground/30 hover:text-foreground"
                    >
                      {collection.label}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/collections/all-sarees"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-background transition-colors hover:bg-foreground/90"
                >
                  Browse Live Pieces
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </Link>
              </div>
            </div>
          </div>
        </div>
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
