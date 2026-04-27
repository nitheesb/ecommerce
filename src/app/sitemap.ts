import type { MetadataRoute } from "next"

import { categories, products as staticProducts, type Product } from "@/lib/products"
import { sanityFetch } from "@/lib/sanity/client"
import { allProductsQuery } from "@/lib/sanity/queries"
import { absoluteUrl } from "@/lib/utils"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    "",
    "/our-story",
    "/contact",
    "/privacy",
    "/refund-policy",
    "/shipping",
    "/terms",
  ]

  const collectionPaths = new Set<string>()

  for (const category of categories) {
    collectionPaths.add(category.href)
    for (const item of category.items) {
      collectionPaths.add(item.href)
    }
  }

  const sanityProducts = await sanityFetch<Product[]>(allProductsQuery)
  const products = sanityProducts && sanityProducts.length > 0 ? sanityProducts : staticProducts

  const entries: MetadataRoute.Sitemap = [
    ...staticPages.map((path) => ({
      url: absoluteUrl(path || "/"),
      lastModified: new Date(),
      changeFrequency: (path === "" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: path === "" ? 1 : 0.7,
    })),
    ...Array.from(collectionPaths).map((path) => ({
      url: absoluteUrl(path),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((product) => ({
      url: absoluteUrl(`/product/${product.slug}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ]

  return entries
}
