import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { InnerPageShell } from "@/components/inner-page-shell"
import { ProductCare } from "@/components/product-care"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"
import { sanityFetch } from "@/lib/sanity/client"
import { productBySlugQuery, allProductSlugsQuery } from "@/lib/sanity/queries"
import { products as staticProducts, type Product } from "@/lib/products"
import type { IProduct } from "@/types"
import { ProductActions } from "./product-actions"
import { ProductGallery } from "./product-gallery"

// ---------------------------------------------------------------------------
// Static params
// ---------------------------------------------------------------------------

export async function generateStaticParams() {
  const sanitySlugs = await sanityFetch<string[]>(allProductSlugsQuery)

  if (sanitySlugs && sanitySlugs.length > 0) {
    return sanitySlugs.map((slug) => ({ slug }))
  }

  return staticProducts.map((p) => ({ slug: p.slug }))
}

// ---------------------------------------------------------------------------
// SEO Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const sanityProduct = await sanityFetch<IProduct | null>(productBySlugQuery, {
    slug: params.slug,
  })

  if (sanityProduct) {
    const title = sanityProduct.seo?.metaTitle ?? sanityProduct.title
    const description =
      sanityProduct.seo?.metaDescription ?? sanityProduct.description

    return {
      title,
      description,
      openGraph: {
        title: `${title} · Thazhuval`,
        description,
        type: "website",
        images: sanityProduct.seo?.ogImage?.url
          ? [{ url: sanityProduct.seo.ogImage.url }]
          : sanityProduct.mainImage?.url
          ? [{ url: sanityProduct.mainImage.url }]
          : undefined,
      },
    }
  }

  const staticProduct = staticProducts.find((p) => p.slug === params.slug)
  if (!staticProduct) return { title: "Product Not Found" }

  return {
    title: staticProduct.name,
    description: staticProduct.description,
    openGraph: {
      title: `${staticProduct.name} · Thazhuval`,
      description: staticProduct.description,
    },
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ProductPage({
  params,
}: {
  params: { slug: string }
}) {
  const sanityProduct = await sanityFetch<IProduct | null>(productBySlugQuery, {
    slug: params.slug,
  })

  if (sanityProduct) {
    return <SanityProductDetail product={sanityProduct} />
  }

  const staticProduct = staticProducts.find((p) => p.slug === params.slug)
  if (!staticProduct) return notFound()

  return <StaticProductDetail product={staticProduct} />
}

// ---------------------------------------------------------------------------
// Sanity Product Detail (full PDP with variants, gallery, LQIP)
// ---------------------------------------------------------------------------

function SanityProductDetail({ product }: { product: IProduct }) {
  const mainImageUrl = product.mainImage?.url ?? "/images/hero.jpg"
  const lqip = product.mainImage?.lqip

  const badgeVariant =
    product.badge === "Limited Edition"
      ? "heritage"
      : product.badge === "Heritage"
      ? "gold"
      : product.badge === "Bestseller"
      ? "sand"
      : "outline"

  return (
    <InnerPageShell>
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-12">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: product.category, href: `/collections/${product.category.toLowerCase()}` },
              { label: product.title },
            ]}
          />

          <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Image Gallery */}
            <ProductGallery
              images={[
                {
                  src: mainImageUrl,
                  alt: product.mainImage?.alt ?? `${product.title} saree`,
                  lqip: lqip ?? undefined,
                  sizes: "(max-width: 1024px) 100vw, 50vw",
                },
                ...(product.imageGallery ?? []).map((img, i) => ({
                  src: img.url ?? "/images/hero.jpg",
                  alt: img.alt ?? `${product.title} gallery image ${i + 1}`,
                  lqip: img.lqip ?? undefined,
                  sizes: "(max-width: 1024px) 50vw, 25vw",
                })),
              ]}
              badge={
                product.badge
                  ? { text: product.badge, variant: badgeVariant }
                  : undefined
              }
            />

            {/* Product Info */}
            <div className="flex flex-col">
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                {product.weaveType ?? product.collection}
              </p>
              <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight md:text-5xl">
                {product.title}
              </h1>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-serif text-2xl">{formatCurrency(product.price)}</span>
                {product.compareAtPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatCurrency(product.compareAtPrice)}
                  </span>
                )}
              </div>

              <Separator className="my-6" />

              <p className="max-w-md leading-relaxed text-muted-foreground">
                {product.description}
              </p>

              {/* Variant selection + Buy Button (client component) */}
              <ProductActions product={product} />

              <Separator className="my-6" />

              <ProductCare />
            </div>
          </div>
        </div>
    </InnerPageShell>
  )
}

// ---------------------------------------------------------------------------
// Static Product Detail (fallback when Sanity is not configured)
// ---------------------------------------------------------------------------

function StaticProductDetail({ product }: { product: Product }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ""

  const badgeVariant =
    product.badge === "Limited Edition"
      ? "heritage"
      : product.badge === "Heritage"
      ? "gold"
      : product.badge === "Bestseller"
      ? "sand"
      : "outline"

  return (
    <InnerPageShell>
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-12">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: product.category, href: `/collections/${product.category.toLowerCase()}` },
              { label: product.name },
            ]}
          />

          <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Images */}
            <ProductGallery
              images={[
                {
                  src: product.image,
                  alt: `${product.name} — ${product.collection} saree`,
                  sizes: "(max-width: 1024px) 100vw, 50vw",
                },
                {
                  src: product.hoverImage,
                  alt: `${product.name} — alternate view`,
                  sizes: "(max-width: 1024px) 100vw, 50vw",
                },
              ]}
              badge={
                product.badge
                  ? {
                      text: product.badge,
                      variant: badgeVariant,
                    }
                  : undefined
              }
            />

            {/* Product Info */}
            <div className="flex flex-col">
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                {product.collection}
              </p>
              <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight md:text-5xl">
                {product.name}
              </h1>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-serif text-2xl">{formatCurrency(product.price)}</span>
                {product.compareAt && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatCurrency(product.compareAt)}
                  </span>
                )}
              </div>

              <Separator className="my-6" />

              <p className="max-w-md leading-relaxed text-muted-foreground">
                {product.description}
              </p>

              {/* Product Details */}
              <div className="mt-6 space-y-3">
                <h3 className="text-xs font-medium uppercase tracking-[0.2em]">Product Details</h3>
                <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
                  <dt className="text-muted-foreground">Fabric</dt>
                  <dd>{product.category === "Silk" ? "Pure Silk" : product.category === "Cotton" ? "Handloom Cotton" : "Heritage Weave"}</dd>
                  <dt className="text-muted-foreground">Weave</dt>
                  <dd>{product.collection}</dd>
                  <dt className="text-muted-foreground">Length</dt>
                  <dd>6.3 meters (with blouse piece)</dd>
                  <dt className="text-muted-foreground">Origin</dt>
                  <dd>{product.collection === "Kanjeevaram" || product.collection === "Bridal" ? "Kanchipuram, Tamil Nadu" : product.collection === "Banarasi" ? "Varanasi, Uttar Pradesh" : product.collection === "Chanderi" ? "Chanderi, Madhya Pradesh" : product.collection === "Patola" ? "Patan, Gujarat" : "India"}</dd>
                  <dt className="text-muted-foreground">Care</dt>
                  <dd>Dry clean recommended</dd>
                </dl>
              </div>

              {/* Why You'll Love This */}
              <div className="mt-6 rounded-lg bg-secondary/40 px-5 py-4">
                <h3 className="text-xs font-medium uppercase tracking-[0.2em]">Why You&apos;ll Love This</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
                    Handcrafted by master artisans with generations of expertise
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
                    {product.category === "Silk" ? "Pure mulberry silk with authentic zari work" : product.category === "Cotton" ? "Breathable handloom fabric, perfect for all-day wear" : "Rare heritage technique, limited production"}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
                    Comes with a matching blouse piece
                  </li>
                </ul>
              </div>

              {/* Add to Cart — Snipcart */}
              <div className="mt-8">
                <button
                  className="snipcart-add-item w-full bg-foreground py-4 text-[11px] font-medium uppercase tracking-[0.22em] text-background transition-colors hover:bg-foreground/90"
                  data-item-id={product.id}
                  data-item-name={product.name}
                  data-item-price={product.price}
                  data-item-url={`${siteUrl}/product/${product.slug}`}
                  data-item-image={product.image}
                  data-item-description={product.description}
                >
                  Add to Cart — {formatCurrency(product.price)}
                </button>
              </div>

              <Separator className="my-6" />

              <ProductCare />
            </div>
          </div>
        </div>
    </InnerPageShell>
  )
}
