import { AnnouncementBar } from "@/components/announcement-bar"
import { CategoriesSection } from "@/components/categories-section"
import { EditorialSection } from "@/components/editorial-section"
import { FeaturedGridSection } from "@/components/featured-grid-section"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/hero"
import { MobileShopStart } from "@/components/mobile-shop-start"
import { Navbar } from "@/components/navbar"
import { ProductCare } from "@/components/product-care"
import { SectionDivider } from "@/components/section-divider"
import { WeaveJourney } from "@/components/weave-journey"
import { sanityFetch } from "@/lib/sanity/client"
import { allProductsQuery, siteMediaQuery } from "@/lib/sanity/queries"
import { getVisibleProducts, products as staticProducts, type Product } from "@/lib/products"
import type { ISiteMedia } from "@/types"

export default async function HomePage() {
  const [sanityProducts, siteMedia] = await Promise.all([
    sanityFetch<Product[]>(allProductsQuery),
    sanityFetch<ISiteMedia>(siteMediaQuery),
  ])
  const products = sanityProducts && sanityProducts.length > 0 ? sanityProducts : getVisibleProducts(staticProducts)

  return (
    <>
      <Navbar overlay />
      <main id="main-content">
        <Hero image={siteMedia?.heroImage} />
        <div className="relative z-10 bg-background">
          <MobileShopStart collectionCardImages={siteMedia?.collectionCardImages} />
          <div className="hidden md:block">
            <CategoriesSection collectionCardImages={siteMedia?.collectionCardImages} />
            <SectionDivider />
          </div>
          <FeaturedGridSection products={products} />
          <SectionDivider />
          <EditorialSection image={siteMedia?.homepageStoryImage} />
          <WeaveJourney chapters={siteMedia?.weaveJourneyChapters} />
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
