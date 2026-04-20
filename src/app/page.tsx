import { AnnouncementBar } from "@/components/announcement-bar"
import { EditorialSection } from "@/components/editorial-section"
import { FeaturedGridSection } from "@/components/featured-grid-section"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/hero"
import { Navbar } from "@/components/navbar"
import { ProductCare } from "@/components/product-care"
import { sanityFetch } from "@/lib/sanity/client"
import { allProductsQuery } from "@/lib/sanity/queries"
import { products as staticProducts, type Product } from "@/lib/products"

export default async function HomePage() {
  const sanityProducts = await sanityFetch<Product[]>(allProductsQuery)
  const products = sanityProducts && sanityProducts.length > 0 ? sanityProducts : staticProducts

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        <Hero />
        <div className="relative z-10 bg-background">
          <FeaturedGridSection products={products} />
          <EditorialSection />
          <ProductCare />
        </div>
      </main>
      <div className="relative z-10 bg-background">
        <Footer />
      </div>
    </>
  )
}
