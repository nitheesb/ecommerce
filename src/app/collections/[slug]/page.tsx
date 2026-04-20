import { notFound } from "next/navigation"

import { AnnouncementBar } from "@/components/announcement-bar"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { ProductCare } from "@/components/product-care"
import { CollectionGrid } from "@/components/collection-grid"
import { products as staticProducts, type Product, type ProductCategory } from "@/lib/products"
import { sanityFetch } from "@/lib/sanity/client"
import { productsByCategoryQuery } from "@/lib/sanity/queries"

const categoryMeta: Record<
  ProductCategory,
  { title: string; kicker: string; description: string }
> = {
  Silk: {
    title: "Silk Sarees",
    kicker: "Kanchipuram · Banaras · Chanderi",
    description:
      "Pure mulberry silk, woven with threads of gold and silver. Every Thazhuval silk is a quiet heirloom — heavy with memory, luminous with light.",
  },
  Cotton: {
    title: "Cotton Sarees",
    kicker: "Handloom · Jamdani · Khadi",
    description:
      "Airy, living weaves for the everyday. Breathable cottons from our master handlooms, finished with whispers of color and restraint.",
  },
  Heritage: {
    title: "Heritage Sarees",
    kicker: "Patola · Paithani · Baluchari",
    description:
      "Protected weaves from India's most storied ateliers. Rare techniques, small editions, and six yards that carry centuries.",
  },
}

const slugToCategory: Record<string, ProductCategory> = {
  silk: "Silk",
  cotton: "Cotton",
  heritage: "Heritage",
}

export function generateStaticParams() {
  return Object.keys(slugToCategory).map((slug) => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const category = slugToCategory[params.slug]
  if (!category) return { title: "Collection" }
  const meta = categoryMeta[category]
  return {
    title: meta.title,
    description: meta.description,
  }
}

export default async function CollectionPage({ params }: { params: { slug: string } }) {
  const category = slugToCategory[params.slug]
  if (!category) return notFound()

  const meta = categoryMeta[category]

  const sanityProducts = await sanityFetch<Product[]>(productsByCategoryQuery, { category })
  const products =
    sanityProducts && sanityProducts.length > 0
      ? sanityProducts
      : staticProducts.filter((p) => p.category === category)

  return (
    <>
      <AnnouncementBar />
      <Navbar solid />
      <main>
        <section className="border-b border-border/60 bg-secondary/30">
          <div className="mx-auto max-w-7xl px-6 pb-12 pt-10 lg:px-12 lg:pb-16 lg:pt-14">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Collections", href: "/collections" },
                { label: meta.title },
              ]}
            />
            <div className="mt-8 grid grid-cols-1 items-end gap-8 md:grid-cols-[1.3fr_1fr]">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
                  {meta.kicker}
                </p>
                <h1 className="mt-4 text-balance font-serif text-5xl leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
                  {meta.title}
                </h1>
              </div>
              <p className="max-w-md text-pretty leading-relaxed text-muted-foreground md:text-lg">
                {meta.description}
              </p>
            </div>
          </div>
        </section>

        <CollectionGrid products={products} />

        <ProductCare />
      </main>
      <Footer />
    </>
  )
}
