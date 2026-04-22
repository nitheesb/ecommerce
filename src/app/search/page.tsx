import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { InnerPageShell } from "@/components/inner-page-shell"
import { SearchPageClient } from "@/components/search-page-client"
import { sanityFetch } from "@/lib/sanity/client"
import { allProductsQuery } from "@/lib/sanity/queries"
import { products as staticProducts, type Product } from "@/lib/products"

export const metadata: Metadata = {
  title: "Search",
  description: "Search House of Thazhuval for sarees, collections, and more.",
  robots: {
    index: false,
    follow: true,
  },
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { q?: string }
}) {
  const sanityProducts = await sanityFetch<Product[]>(allProductsQuery)
  const products = sanityProducts && sanityProducts.length > 0 ? sanityProducts : staticProducts
  const initialQuery = searchParams?.q?.trim() ?? ""

  return (
    <InnerPageShell>
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-24">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Search" },
            ]}
            className="mb-8"
          />
          <h1 className="text-center font-serif text-4xl leading-[1.1] tracking-tight md:text-5xl">
            Search
          </h1>
          <SearchPageClient products={products} initialQuery={initialQuery} />
        </section>
    </InnerPageShell>
  )
}
