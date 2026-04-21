// ---------------------------------------------------------------------------
// Reusable GROQ fragments
// ---------------------------------------------------------------------------

const imageFragment = `{
  asset->{ _id, url, metadata { lqip, dimensions } },
  hotspot, crop, alt
}`;

const productCardFields = `{
  "id": _id,
  "name": title,
  "slug": slug.current,
  description,
  category,
  collection,
  price,
  "compareAt": compareAtPrice,
  badge,
  palette,
  "image": mainImage.asset->url,
  "hoverImage": coalesce(hoverImage.asset->url, mainImage.asset->url)
}`;

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/** Fetch all products for listings (homepage, search) */
export const allProductsQuery = `
  *[_type == "saree"] | order(_createdAt desc) ${productCardFields}
`;

/** Fetch a single product by slug — full detail for PDP */
export const productBySlugQuery = `
  *[_type == "saree" && slug.current == $slug][0] {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    title,
    slug,
    description,
    category,
    weaveType,
    collection,
    price,
    compareAtPrice,
    badge,
    palette,
    mainImage ${imageFragment},
    hoverImage ${imageFragment},
    imageGallery[] ${imageFragment},
    variants[]{
      _key, sku, color, colorHex, size, price, compareAtPrice, stockQuantity,
      image ${imageFragment}
    },
    seo {
      metaTitle,
      metaDescription,
      ogImage ${imageFragment}
    }
  }
`;

/** Fetch all slugs for generateStaticParams */
export const allProductSlugsQuery = `
  *[_type == "saree" && defined(slug.current)].slug.current
`;
