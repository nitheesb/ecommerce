import { notFound } from "next/navigation"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { InnerPageShell } from "@/components/inner-page-shell"
import { ProductCare } from "@/components/product-care"
import { CollectionGrid } from "@/components/collection-grid"
import { products as staticProducts, type Product, type ProductCategory } from "@/lib/products"
import { sanityFetch } from "@/lib/sanity/client"
import { productsByCategoryQuery } from "@/lib/sanity/queries"

// ---------------------------------------------------------------------------
// Allow any slug — Next.js won't 404 on slugs missing from generateStaticParams
// ---------------------------------------------------------------------------
export const dynamicParams = true

// ---------------------------------------------------------------------------
// Collection metadata for every navbar slug
// ---------------------------------------------------------------------------
type CollectionMeta = {
  title: string
  kicker: string
  description: string
  sanityCategory?: ProductCategory
}

const collectionMeta: Record<string, CollectionMeta> = {
  // ── Sarees ────────────────────────────────────────────────────────────
  "all-sarees": {
    title: "All Sarees",
    kicker: "The Complete Collection",
    description:
      "Every handcrafted saree in our collection — silks, cottons, linens, and heritage weaves, all in one place.",
  },
  sarees: {
    title: "All Sarees",
    kicker: "The Complete Collection",
    description:
      "Every handcrafted saree in our collection — silks, cottons, linens, and heritage weaves, all in one place.",
  },
  "best-sellers": {
    title: "Best Sellers",
    kicker: "Most Loved",
    description:
      "Our most coveted pieces — the sarees our patrons return to, time and again.",
  },
  "new-arrivals": {
    title: "New Arrivals",
    kicker: "Just In",
    description:
      "Fresh from the loom. The newest additions to the House of Thazhuval collection.",
  },
  cotton: {
    title: "Cotton Sarees",
    kicker: "Handloom · Jamdani · Khadi",
    description:
      "Airy, living weaves for the everyday. Breathable cottons from our master handlooms, finished with whispers of color and restraint.",
    sanityCategory: "Cotton",
  },
  linen: {
    title: "Linen Sarees",
    kicker: "Pure Linen · Linen Blends",
    description:
      "Effortlessly elegant linen sarees with a natural texture that only gets better with wear. Perfect for warm days and relaxed gatherings.",
  },
  modal: {
    title: "Modal Sarees",
    kicker: "Buttery Soft · Lightweight",
    description:
      "Luxuriously soft modal sarees that drape like a dream. Lightweight, breathable, and perfect for all-day comfort.",
  },
  silk: {
    title: "Silk Sarees",
    kicker: "Kanchipuram · Banaras · Chanderi",
    description:
      "Pure mulberry silk, woven with threads of gold and silver. Every Thazhuval silk is a quiet heirloom — heavy with memory, luminous with light.",
    sanityCategory: "Silk",
  },
  "soft-silks": {
    title: "Soft Silk Sarees",
    kicker: "Lightweight Silk · Everyday Luxury",
    description:
      "The grace of silk without the weight. Soft silk sarees that flow beautifully, ideal for celebrations and everyday elegance alike.",
  },
  tussar: {
    title: "Tussar Sarees",
    kicker: "Wild Silk · Natural Texture",
    description:
      "Raw, textured beauty from wild silk cocoons. Tussar sarees carry an earthy charm and a distinctive natural sheen.",
  },
  "silk-cotton": {
    title: "Silk Cotton Sarees",
    kicker: "The Best of Both",
    description:
      "A harmonious blend of silk's sheen and cotton's comfort. Versatile sarees for the woman who wants elegance without compromise.",
  },
  crepe: {
    title: "Crepe Sarees",
    kicker: "Textured · Flowing",
    description:
      "Crinkled elegance that moves with you. Crepe sarees with beautiful drape and a subtle, sophisticated texture.",
  },
  chiffon: {
    title: "Chiffon Sarees",
    kicker: "Sheer · Lightweight",
    description:
      "Weightless and ethereal, our chiffon sarees float like poetry. Perfect for evenings that call for understated glamour.",
  },
  organza: {
    title: "Organza Sarees",
    kicker: "Crisp · Luminous",
    description:
      "Translucent organza with a crisp hand-feel and luminous sheen. Statement pieces for those who love to stand out.",
  },
  georgette: {
    title: "Georgette Sarees",
    kicker: "Fluid · Versatile",
    description:
      "Flowing georgette sarees with a matte finish and beautiful drape. Effortless elegance for every occasion.",
  },
  heritage: {
    title: "Heritage Sarees",
    kicker: "Patola · Paithani · Baluchari",
    description:
      "Protected weaves from India's most storied ateliers. Rare techniques, small editions, and six yards that carry centuries.",
    sanityCategory: "Heritage",
  },

  // ── Prints ────────────────────────────────────────────────────────────
  prints: {
    title: "Shop by Prints",
    kicker: "Artisan Prints · Hand-Blocked",
    description:
      "From Ajrakh to Kalamkari — discover sarees adorned with India's most celebrated hand-printing traditions.",
  },
  "ajrakh-print": {
    title: "Ajrakh Print Sarees",
    kicker: "Block-Printed · Natural Dyes",
    description:
      "Ancient resist-printing from Kutch, using natural indigo and madder. Geometric poetry on fabric, perfected over centuries.",
  },
  "bagru-print": {
    title: "Bagru Print Sarees",
    kicker: "Hand Block-Printed · Rajasthan",
    description:
      "Traditional Bagru prints from Rajasthan — wooden block-printed with vegetable dyes in earthy, sun-baked tones.",
  },
  "sanganeri-print": {
    title: "Sanganeri Print Sarees",
    kicker: "Delicate · Floral",
    description:
      "Fine floral prints from Sanganer, Jaipur — delicate hand-blocks on airy fabrics, a celebration of Rajasthani artistry.",
  },
  "dabu-print": {
    title: "Dabu Print Sarees",
    kicker: "Mud-Resist · Hand-Printed",
    description:
      "Mud-resist printing from Rajasthan, creating soft, organic patterns that tell stories of the earth and sky.",
  },
  kalamkari: {
    title: "Kalamkari Sarees",
    kicker: "Pen-Drawn · Mythological",
    description:
      "Hand-painted and block-printed art from Andhra Pradesh. Mythological motifs and botanical illustrations on fine fabric.",
  },
  bandhani: {
    title: "Bandhani Sarees",
    kicker: "Tie-Dye · Gujarat & Rajasthan",
    description:
      "Thousands of tiny hand-tied knots creating cascading patterns. A vibrant art form passed down through generations.",
  },
  "batik-print": {
    title: "Batik Print Sarees",
    kicker: "Wax-Resist · Artistic",
    description:
      "Wax-resist dyeing creating unique, flowing patterns. Each piece is one-of-a-kind, bearing the hand of its maker.",
  },
  leheriya: {
    title: "Leheriya Sarees",
    kicker: "Wave Patterns · Rajasthan",
    description:
      "Tie-dyed waves of colour from Rajasthan — joyful, monsoon-inspired patterns that bring life to every drape.",
  },
  "pochampally-ikat": {
    title: "Pochampally Ikat Sarees",
    kicker: "Double Ikat · Telangana",
    description:
      "Precision-dyed ikat patterns from Pochampally. Bold geometric designs woven with extraordinary skill and patience.",
  },
  "floral-prints": {
    title: "Floral Print Sarees",
    kicker: "Botanical · Romantic",
    description:
      "Garden-inspired prints ranging from delicate wildflowers to bold tropical blooms. Nature's beauty, draped in six yards.",
  },
  "geometric-prints": {
    title: "Geometric Print Sarees",
    kicker: "Modern · Structured",
    description:
      "Clean lines and bold geometry for the contemporary woman. Where tradition meets modern design sensibility.",
  },
  "digital-prints": {
    title: "Digital Print Sarees",
    kicker: "Vibrant · Contemporary",
    description:
      "High-definition prints with vivid colours and intricate detail. Contemporary designs for the modern wardrobe.",
  },

  // ── Occasion ──────────────────────────────────────────────────────────
  occasion: {
    title: "Shop by Occasion",
    kicker: "Daily to Festive",
    description:
      "Find the perfect saree for every moment — from everyday grace to grand celebrations.",
  },
  dailywear: {
    title: "Dailywear Sarees",
    kicker: "Comfortable · Effortless",
    description:
      "Lightweight, easy-drape sarees designed for everyday elegance. Comfort that doesn't compromise on style.",
  },
  festive: {
    title: "Festive Sarees",
    kicker: "Celebration · Grandeur",
    description:
      "Opulent weaves and rich embellishments for festivals, weddings, and special occasions that deserve something extraordinary.",
  },

  // ── Colors ────────────────────────────────────────────────────────────
  "by-colour": {
    title: "Shop by Colour",
    kicker: "Curated by Hue",
    description:
      "Find your perfect shade — sarees curated by colour for every mood and occasion.",
  },
  black: {
    title: "Black Sarees",
    kicker: "Bold · Timeless",
    description: "The ultimate in sophistication. Black sarees that command attention with quiet authority.",
  },
  blue: {
    title: "Blue Sarees",
    kicker: "Indigo · Navy · Sky",
    description: "From deep midnight to cerulean sky — blue sarees that evoke depth, calm, and endless possibility.",
  },
  cream: {
    title: "Cream Sarees",
    kicker: "Warm · Elegant",
    description: "Soft, warm cream tones that whisper elegance. Perfect as a canvas for intricate borders and zari work.",
  },
  green: {
    title: "Green Sarees",
    kicker: "Emerald · Sage · Forest",
    description: "The colour of life and renewal. Green sarees ranging from lush emerald to subtle sage.",
  },
  grey: {
    title: "Grey Sarees",
    kicker: "Silver · Slate · Ash",
    description: "Modern, understated, and endlessly versatile. Grey sarees for the contemporary connoisseur.",
  },
  ivory: {
    title: "Ivory Sarees",
    kicker: "Classic · Bridal",
    description: "Pure, luminous ivory — the colour of new beginnings. Timeless elegance for brides and beyond.",
  },
  maroon: {
    title: "Maroon Sarees",
    kicker: "Deep · Regal",
    description: "Rich, wine-dark maroon that speaks of heritage and celebration. A colour steeped in tradition.",
  },
  mustard: {
    title: "Mustard Sarees",
    kicker: "Warm · Earthy",
    description: "Sun-kissed mustard tones that bring warmth and vibrancy to every drape.",
  },
  "olive-green": {
    title: "Olive Green Sarees",
    kicker: "Earthy · Sophisticated",
    description: "Muted, earthy olive tones for the woman who appreciates understated beauty with depth.",
  },
  peach: {
    title: "Peach Sarees",
    kicker: "Soft · Romantic",
    description: "Delicate peach hues that glow with feminine grace. Soft, romantic, and effortlessly beautiful.",
  },
  pink: {
    title: "Pink Sarees",
    kicker: "Blush · Rose · Fuchsia",
    description: "From the softest blush to vivid magenta — pink sarees that celebrate every shade of femininity.",
  },
  purple: {
    title: "Purple Sarees",
    kicker: "Royal · Majestic",
    description: "The colour of royalty. Purple sarees that make a majestic statement at every occasion.",
  },
  red: {
    title: "Red Sarees",
    kicker: "Bridal · Auspicious",
    description: "The quintessential bridal hue. Red sarees symbolising love, prosperity, and celebration.",
  },
  violet: {
    title: "Violet Sarees",
    kicker: "Dreamy · Unique",
    description: "Enchanting violet shades that sit between the warmth of red and the depth of blue. Truly distinctive.",
  },
  white: {
    title: "White Sarees",
    kicker: "Pure · Minimal",
    description: "Crisp, pristine white sarees — a canvas of purity that lets the weave and craftsmanship shine through.",
  },
  yellow: {
    title: "Yellow Sarees",
    kicker: "Bright · Auspicious",
    description: "Sunshine woven into fabric. Yellow sarees that radiate joy, positivity, and festive energy.",
  },
}

// ---------------------------------------------------------------------------
// Static params — generate known slugs at build time
// ---------------------------------------------------------------------------
export function generateStaticParams() {
  return Object.keys(collectionMeta).map((slug) => ({ slug }))
}

// ---------------------------------------------------------------------------
// SEO metadata
// ---------------------------------------------------------------------------
export function generateMetadata({ params }: { params: { slug: string } }) {
  const meta = collectionMeta[params.slug]
  if (!meta) return { title: "Collection" }
  return { title: meta.title, description: meta.description }
}

// ---------------------------------------------------------------------------
// Helper: title-case a slug ("ajrakh-print" → "Ajrakh Print")
// ---------------------------------------------------------------------------
function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default async function CollectionPage({ params }: { params: { slug: string } }) {
  const meta = collectionMeta[params.slug] ?? {
    title: `${slugToTitle(params.slug)} Sarees`,
    kicker: "Curated Collection",
    description: `Discover our curated selection of ${slugToTitle(params.slug).toLowerCase()} sarees, handcrafted with care and tradition.`,
  }

  // Try Sanity first if we know the category
  let products: Product[] = []
  if (meta.sanityCategory) {
    const sanityProducts = await sanityFetch<Product[]>(productsByCategoryQuery, {
      category: meta.sanityCategory,
    })
    if (sanityProducts && sanityProducts.length > 0) {
      products = sanityProducts
    } else {
      products = staticProducts.filter((p) => p.category === meta.sanityCategory)
    }
  } else {
    // Show all products for generic collections (since we only have 8 static products)
    products = staticProducts
  }

  return (
    <InnerPageShell>
        <section className="border-b border-border/60 bg-secondary/30">
          <div className="mx-auto max-w-7xl px-6 pb-12 pt-10 lg:px-12 lg:pb-16 lg:pt-14">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Collections", href: "/collections/all-sarees" },
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
    </InnerPageShell>
  )
}
