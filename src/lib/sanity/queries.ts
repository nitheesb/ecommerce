import { groq } from "next-sanity";

// ---------------------------------------------------------------------------
// Reusable GROQ fragments
// ---------------------------------------------------------------------------

const imageFragment = groq`{
  asset->{ _id, url, metadata { lqip, dimensions } },
  hotspot, crop, alt
}`;

const productCardFields = groq`{
  _id,
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
  variants[]{ _key, sku, color, colorHex, size, price, compareAtPrice, stockQuantity }
}`;

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/** Fetch all products for listings (homepage, search) */
export const allProductsQuery = groq`
  *[_type == "saree"] | order(_createdAt desc) ${productCardFields}
`;

/** Fetch products filtered by category */
export const productsByCategoryQuery = groq`
  *[_type == "saree" && category == $category] | order(_createdAt desc) ${productCardFields}
`;

/** Fetch a single product by slug — full detail for PDP */
export const productBySlugQuery = groq`
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
export const allProductSlugsQuery = groq`
  *[_type == "saree" && defined(slug.current)].slug.current
`;
