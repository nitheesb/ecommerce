// ---------------------------------------------------------------------------
// Collection Domain Entities — for collection pages and navigation
// ---------------------------------------------------------------------------

import type { ISanityImage, ProductCategory } from "./product";

/** A collection document in Sanity (e.g., "Silk Sarees", "Heritage Weaves") */
export interface ICollection {
  _id: string;
  _type: "collection";
  title: string;
  slug: {
    _type: "slug";
    current: string;
  };
  category: ProductCategory;
  description: string;
  kicker?: string;
  image?: ISanityImage;
}

/** Individual sub-item in a category navigation group */
export interface ICategoryItem {
  label: string;
  href: string;
}

/** Navigation structure for the mega-menu — matches existing `categories` array shape */
export interface ICollectionCategory {
  title: ProductCategory;
  blurb: string;
  href: string;
  items: ICategoryItem[];
}
