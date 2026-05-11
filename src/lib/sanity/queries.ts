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
  status,
  sku,
  category,
  fabric,
  printType,
  occasion,
  colorFamily,
  collection,
  price,
  "compareAt": compareAtPrice,
  badge,
  palette,
  stockStatus,
  stockQuantity,
  blouseIncluded,
  featured,
  sortOrder,
  "image": mainImage.asset->url,
  "hoverImage": coalesce(hoverImage.asset->url, mainImage.asset->url)
}`;

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/** Fetch all products for listings (homepage, search) */
export const allProductsQuery = `
  *[_type == "saree" && coalesce(status, "active") == "active"] | order(coalesce(sortOrder, 100) asc, _createdAt desc) ${productCardFields}
`;

/** Fetch a single product by slug — full detail for PDP */
export const productBySlugQuery = `
  *[_type == "saree" && slug.current == $slug && coalesce(status, "active") == "active"][0] {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    title,
    slug,
    description,
    status,
    sku,
    category,
    fabric,
    weaveType,
    printType,
    occasion,
    colorFamily,
    collection,
    price,
    compareAtPrice,
    badge,
    palette,
    stockStatus,
    stockQuantity,
    blouseIncluded,
    careInstructions,
    featured,
    sortOrder,
    highlights,
    mainImage ${imageFragment},
    hoverImage ${imageFragment},
    "imageGallery": coalesce(imageGallery[] ${imageFragment}, []),
    "variants": coalesce(variants[]{
      _key, sku, color, colorHex, size, price, compareAtPrice, stockQuantity,
      image ${imageFragment}
    }, []),
    seo {
      metaTitle,
      metaDescription,
      ogImage ${imageFragment}
    }
  }
`;

/** Fetch all slugs for generateStaticParams */
export const allProductSlugsQuery = `
  *[_type == "saree" && defined(slug.current) && coalesce(status, "active") == "active"].slug.current
`;
