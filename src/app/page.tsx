import { AnnouncementBar } from "@/components/announcement-bar"
import { CategoriesSection } from "@/components/categories-section"
import { EditorialSection } from "@/components/editorial-section"
import { FeaturedGridSection } from "@/components/featured-grid-section"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/hero"
import { Navbar } from "@/components/navbar"
import { ProductCare } from "@/components/product-care"
import { SectionDivider } from "@/components/section-divider"
import { WeaveJourney } from "@/components/weave-journey"
import { sanityFetch } from "@/lib/sanity/client"
import { allProductsQuery } from "@/lib/sanity/queries"
import { products as staticProducts, type Product } from "@/lib/products"

export default async function HomePage() {
  const sanityProducts = await sanityFetch<Product[]>(allProductsQuery)
  const products = sanityProducts && sanityProducts.length > 0 ? sanityProducts : staticProducts

  return (
    <>
      <Navbar overlay />
      <main id="main-content">
        <Hero />
        <div className="relative z-10 bg-background">
          <CategoriesSection />
          <SectionDivider />
          <FeaturedGridSection products={products} />
          <SectionDivider />
          <EditorialSection />
          <WeaveJourney />
          <SectionDivider />
          <ProductCare />
        </div>
      </main>
      <div className="relative z-10 bg-background">
        <Footer />
      </div>
    </>
  )
}
