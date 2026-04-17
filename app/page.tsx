import { AnnouncementBar } from "@/components/announcement-bar"
import { CartDrawer } from "@/components/cart-drawer"
import { CategoriesSection } from "@/components/categories-section"
import { EditorialSection } from "@/components/editorial-section"
import { FeaturedGridSection } from "@/components/featured-grid-section"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/hero"
import { Navbar } from "@/components/navbar"
import { ProductCare } from "@/components/product-care"

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        <Hero />
        <CategoriesSection />
        <FeaturedGridSection />
        <EditorialSection />
        <ProductCare />
      </main>
      <Footer />
      <CartDrawer />
    </>
  )
}
