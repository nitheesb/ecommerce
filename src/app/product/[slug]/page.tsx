import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { Breadcrumbs } from "@/components/breadcrumbs"
import { InnerPageShell } from "@/components/inner-page-shell"
import { ProductCard } from "@/components/product-card"
import { absoluteUrl, cn, formatCurrency } from "@/lib/utils"
import { sanityFetch } from "@/lib/sanity/client"
import { productBySlugQuery, allProductSlugsQuery, allProductsQuery } from "@/lib/sanity/queries"
import { getVisibleProducts, products as staticProducts, type Product } from "@/lib/products"
import type { IProduct } from "@/types"
import { ProductActions } from "./product-actions"
import { ProductGallery } from "./product-gallery"
import { RecentlyViewedTracker } from "@/components/recently-viewed-tracker"
import { StaticProductActions } from "@/components/static-product-actions"

// ---------------------------------------------------------------------------
// Static params
// ---------------------------------------------------------------------------

export async function generateStaticParams() {
  const sanitySlugs = await sanityFetch<string[]>(allProductSlugsQuery)

  if (sanitySlugs && sanitySlugs.length > 0) {
    return sanitySlugs.map((slug) => ({ slug }))
  }

  return getVisibleProducts(staticProducts).map((p) => ({ slug: p.slug }))
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
      alternates: {
        canonical: `/product/${params.slug}`,
      },
      openGraph: {
        title: `${title} · Thazhuval`,
        description,
        type: "website",
        url: `/product/${params.slug}`,
        siteName: "House of Thazhuval",
        images: sanityProduct.seo?.ogImage?.url
          ? [{ url: sanityProduct.seo.ogImage.url }]
          : sanityProduct.mainImage?.url
          ? [{ url: sanityProduct.mainImage.url }]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} · Thazhuval`,
        description,
        images: sanityProduct.seo?.ogImage?.url
          ? [sanityProduct.seo.ogImage.url]
          : sanityProduct.mainImage?.url
          ? [sanityProduct.mainImage.url]
          : undefined,
      },
    }
  }

  const staticProduct = getVisibleProducts(staticProducts).find((p) => p.slug === params.slug)
  if (!staticProduct) return { title: "Product Not Found" }

  return {
    title: staticProduct.name,
    description: staticProduct.description,
    alternates: {
      canonical: `/product/${params.slug}`,
    },
    openGraph: {
      title: `${staticProduct.name} · Thazhuval`,
      description: staticProduct.description,
      type: "website",
      url: `/product/${params.slug}`,
      siteName: "House of Thazhuval",
      images: [{ url: staticProduct.image, alt: staticProduct.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${staticProduct.name} · Thazhuval`,
      description: staticProduct.description,
      images: [staticProduct.image],
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
  const [sanityProduct, sanityProducts] = await Promise.all([
    sanityFetch<IProduct | null>(productBySlugQuery, {
      slug: params.slug,
    }),
    sanityFetch<Product[]>(allProductsQuery),
  ])

  if (sanityProduct) {
    return (
      <SanityProductDetail
        product={sanityProduct}
        relatedProducts={getRelatedProducts(
          sanityProducts ?? [],
          sanityProduct.slug.current,
          sanityProduct.category,
          sanityProduct.collection,
        )}
      />
    )
  }

  const visibleStaticProducts = getVisibleProducts(staticProducts)
  const staticProduct = visibleStaticProducts.find((p) => p.slug === params.slug)
  if (!staticProduct) return notFound()

  return (
    <StaticProductDetail
      product={staticProduct}
      relatedProducts={getRelatedProducts(
        visibleStaticProducts,
        staticProduct.slug,
        staticProduct.category,
        staticProduct.collection,
      )}
    />
  )
}

// ---------------------------------------------------------------------------
// Sanity Product Detail (Sanity-backed PDP with card-matched imagery)
// ---------------------------------------------------------------------------

function SanityProductDetail({
  product,
  relatedProducts,
}: {
  product: IProduct
  relatedProducts: Product[]
}) {
  const mainImageUrl = product.mainImage?.url ?? "/images/hero.jpg"
  const imageUrls = new Set<string>()
  const productImages: Array<{
    src: string
    alt: string
    lqip?: string
    sizes: string
  }> = []
  const addProductImage = (
    image: IProduct["mainImage"] | undefined,
    fallbackAlt: string,
  ) => {
    if (!image?.url || imageUrls.has(image.url) || productImages.length >= 3) return

    imageUrls.add(image.url)
    productImages.push({
      src: image.url,
      alt: image.alt ?? fallbackAlt,
      lqip: image.lqip ?? undefined,
      sizes: "(max-width: 1024px) 100vw, 50vw",
    })
  }

  addProductImage(product.mainImage, `${product.title} saree`)
  addProductImage(product.hoverImage, `${product.title} alternate product image`)
  addProductImage(product.thirdImage, `${product.title} drape detail image`)
  if (productImages.length === 0) {
    productImages.push({
      src: mainImageUrl,
      alt: `${product.title} saree`,
      sizes: "(max-width: 1024px) 100vw, 50vw",
    })
  }

  const isOutOfStock = isSanityProductOutOfStock(product)
  const productKicker = getProductKicker(product.category, product.collection)
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: product.title },
  ]
  const productSchema = buildProductSchema({
    name: product.title,
    description: product.description,
    image: mainImageUrl,
    price: product.price,
    compareAtPrice: product.compareAtPrice ?? undefined,
    sku: product.sku,
    slug: product.slug.current,
    category: product.category,
    collection: product.collection ?? product.weaveType ?? "Saree",
    isOutOfStock,
  })

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
        <div className="mx-auto max-w-[1440px] px-4 pb-12 pt-6 md:px-6 md:pb-14 md:pt-8 lg:px-10">
          <Breadcrumbs
            items={breadcrumbItems}
          />

          <div className="mt-7 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(390px,0.72fr)] lg:items-start lg:gap-10 xl:gap-14">
            {/* Image Gallery */}
            <div className="order-2 lg:order-1">
              <ProductGallery
                images={productImages}
                badge={
                  product.badge
                    ? { text: product.badge, variant: badgeVariant }
                    : undefined
                }
              />
            </div>

            {/* Product Info */}
            <div className="order-1 lg:sticky lg:top-32 lg:order-2">
              <div className="rounded-[34px] border border-border/70 bg-[linear-gradient(145deg,rgba(255,253,248,0.97)_0%,rgba(246,240,230,0.94)_100%)] p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-7 xl:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-muted-foreground">
                    {productKicker}
                  </p>
                </div>

                <h1 className="mt-5 font-serif text-4xl leading-[0.96] tracking-tight text-foreground md:text-5xl xl:text-6xl">
                  {product.title}
                </h1>

                <div className="mt-5 flex items-baseline gap-3">
                  <span className="font-sans text-[1.9rem] font-medium leading-none tracking-[-0.04em] text-foreground md:text-[2.15rem]">
                    {formatCurrency(product.price)}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatCurrency(product.compareAtPrice)}
                    </span>
                  )}
                </div>

                <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground">
                  {product.description}
                </p>

                <div className="mt-7">
                  <ProductActions product={product} />
                </div>

                <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">
                  Secure checkout, careful packing, and direct support before dispatch.
                </p>
              </div>
            </div>
          </div>
        </div>
        <RelatedProducts products={relatedProducts} />
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

function StaticProductDetail({
  product,
  relatedProducts,
}: {
  product: Product
  relatedProducts: Product[]
}) {
  const isOutOfStock = isStaticProductOutOfStock(product)
  const productKicker = getProductKicker(product.category, product.collection)
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: product.name },
  ]
  const productSchema = buildProductSchema({
    name: product.name,
    description: product.description,
    image: product.image,
    price: product.price,
    compareAtPrice: product.compareAt,
    slug: product.slug,
    category: product.category,
    collection: product.collection,
    isOutOfStock,
  })

  const badgeVariant =
    product.badge === "Limited Edition"
      ? "heritage"
      : product.badge === "Heritage"
      ? "gold"
      : product.badge === "Bestseller"
      ? "sand"
      : "outline"
  const staticProductImages = [
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
    product.detailImage
      ? {
          src: product.detailImage,
          alt: `${product.name} — drape detail`,
          sizes: "(max-width: 1024px) 100vw, 50vw",
        }
      : null,
  ].filter(Boolean) as Array<{ src: string; alt: string; sizes: string }>

  return (
    <InnerPageShell>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
        <div className="mx-auto max-w-[1440px] px-4 pb-12 pt-6 md:px-6 md:pb-14 md:pt-8 lg:px-10">
          <Breadcrumbs
            items={breadcrumbItems}
          />

          <div className="mt-7 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(390px,0.72fr)] lg:items-start lg:gap-10 xl:gap-14">
            {/* Images */}
            <div className="order-2 lg:order-1">
              <ProductGallery
                images={staticProductImages}
                badge={
                  product.badge
                    ? {
                        text: product.badge,
                        variant: badgeVariant,
                      }
                    : undefined
                }
              />
            </div>

            {/* Product Info */}
            <div className="order-1 lg:sticky lg:top-32 lg:order-2">
              <div className="rounded-[34px] border border-border/70 bg-[linear-gradient(145deg,rgba(255,253,248,0.97)_0%,rgba(246,240,230,0.94)_100%)] p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-7 xl:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-muted-foreground">
                    {productKicker}
                  </p>
                </div>

                <h1 className="mt-5 font-serif text-4xl leading-[0.96] tracking-tight text-foreground md:text-5xl xl:text-6xl">
                  {product.name}
                </h1>

                <div className="mt-5 flex items-baseline gap-3">
                  <span className="font-sans text-[1.9rem] font-medium leading-none tracking-[-0.04em] text-foreground md:text-[2.15rem]">
                    {formatCurrency(product.price)}
                  </span>
                  {product.compareAt && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatCurrency(product.compareAt)}
                    </span>
                  )}
                </div>

                <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground">
                  {product.description}
                </p>

                <div className="mt-7">
                  <StaticProductActions product={product} />
                </div>

                <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">
                  Secure checkout, careful packing, and direct support before dispatch.
                </p>
              </div>
            </div>
          </div>
        </div>
        <RelatedProducts products={relatedProducts} />
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

function isSanityProductOutOfStock(product: IProduct) {
  return product.stockStatus === "outOfStock" || product.stockQuantity === 0;
}

function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null

  return (
    <section className="mx-auto max-w-[1440px] px-4 pb-16 pt-4 md:px-6 md:pb-20 lg:px-10">
      <div className="border-t border-border/60 pt-10 md:pt-12">
        <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              You may also like
            </p>
            <h2 className="mt-3 font-serif text-3xl leading-tight tracking-tight md:text-4xl">
              Related Sarees
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            Similar pieces from the same house edit, chosen by collection and category.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < 2}
              hideQuickAdd
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function getRelatedProducts(
  products: Product[],
  currentSlug: string,
  category: string,
  collection?: string,
) {
  return products
    .filter((product) => product.slug !== currentSlug)
    .sort((a, b) => {
      const aScore = getRelatedProductScore(a, category, collection)
      const bScore = getRelatedProductScore(b, category, collection)
      return bScore - aScore
    })
    .slice(0, 4)
}

function getRelatedProductScore(
  product: Product,
  category: string,
  collection?: string,
) {
  let score = 0
  if (product.category === category) score += 4
  if (collection && product.collection === collection) score += 3
  if (collection && product.collection.toLowerCase().includes(collection.toLowerCase())) {
    score += 1
  }
  if (product.badge === "Bestseller" || product.badge === "New") score += 1
  return score
}

function isStaticProductOutOfStock(product: Product) {
  return product.stockStatus === "outOfStock" || product.stockQuantity === 0;
}

function getProductKicker(category?: string, collection?: string) {
  if (collection) return collection
  return category && category !== "None" ? category : "Saree"
}

function buildProductSchema({
  name,
  description,
  image,
  price,
  compareAtPrice,
  sku,
  slug,
  category,
  collection,
  isOutOfStock,
}: {
  name: string
  description: string
  image: string
  price: number
  compareAtPrice?: number
  sku?: string
  slug: string
  category: string
  collection: string
  isOutOfStock: boolean
}) {
  const productCategory = [category !== "None" ? category : "", collection]
    .filter(Boolean)
    .join(" / ")

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: [absoluteUrl(image)],
    brand: {
      "@type": "Brand",
      name: "House of Thazhuval",
    },
    ...(sku ? { sku } : {}),
    category: productCategory || "Saree",
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/product/${slug}`),
      priceCurrency: "INR",
      price,
      availability: isOutOfStock
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "House of Thazhuval",
      },
    },
    ...(compareAtPrice
      ? {
          additionalProperty: [
            {
              "@type": "PropertyValue",
              name: "Compare at price",
              value: compareAtPrice,
            },
          ],
        }
      : {}),
  }
}
