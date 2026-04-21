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
import { RecentlyViewedTracker } from "@/components/recently-viewed-tracker"

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

              {/* WhatsApp */}
              <a
                href={`https://wa.me/919585628565?text=${encodeURIComponent(`Hi, I'm interested in the ${product.title} saree (${formatCurrency(product.price)}). ${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/product/${product.slug.current}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex w-full items-center justify-center gap-2 border border-border/60 py-4 text-[11px] font-medium uppercase tracking-[0.22em] text-foreground transition-colors hover:bg-secondary/40"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Ask About This Saree
              </a>

              <Separator className="my-6" />

              <ProductCare />
            </div>
          </div>
        </div>
        <RecentlyViewedTracker
          item={{
            id: product._id,
            slug: product.slug.current,
            name: product.title,
            collection: product.collection ?? "",
            price: product.price,
            image: mainImageUrl,
          }}
        />
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
                <a
                  href={`https://wa.me/919585628565?text=${encodeURIComponent(`Hi, I'm interested in the ${product.name} saree (${formatCurrency(product.price)}). ${siteUrl}/product/${product.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex w-full items-center justify-center gap-2 border border-border/60 py-4 text-[11px] font-medium uppercase tracking-[0.22em] text-foreground transition-colors hover:bg-secondary/40"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Ask About This Saree
                </a>
              </div>

              <Separator className="my-6" />

              <ProductCare />
            </div>
          </div>
        </div>
        <RecentlyViewedTracker
          item={{
            id: product.id,
            slug: product.slug,
            name: product.name,
            collection: product.collection,
            price: product.price,
            image: product.image,
          }}
        />
    </InnerPageShell>
  )
}
