import "server-only";

import type { SanityClient } from "@sanity/client";

export type CheckoutItemInput = {
  productId?: string;
  variantSku?: string;
  quantity?: number;
};

type CheckoutProduct = {
  _id: string;
  title: string;
  slug: string;
  sku?: string;
  price: number;
  category?: string;
  stockStatus?: string;
  stockQuantity?: number;
  imageUrl?: string;
  variants?: Array<{
    _key: string;
    sku: string;
    price: number;
    stockQuantity: number;
  }>;
};

export type ResolvedCheckoutLine = {
  productId: string;
  title: string;
  slug: string;
  sku: string;
  variantSku?: string;
  variantKey?: string;
  imageUrl?: string;
  category?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export class CheckoutError extends Error {}

const checkoutProductsQuery = `
  *[_type == "saree" && !(_id in path("drafts.**")) && _id in $productIds && coalesce(status, "active") == "active"] {
    _id, title, "slug": slug.current, sku, price, category, stockStatus, stockQuantity,
    "imageUrl": mainImage.asset->url,
    "variants": coalesce(variants[]{_key, sku, price, stockQuantity}, [])
  }
`;

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function resolveCheckoutItems(
  client: SanityClient,
  rawInput: CheckoutItemInput[] | undefined,
) {
  const rawItems = Array.isArray(rawInput) ? rawInput.slice(0, 20) : [];
  if (rawItems.length === 0) throw new CheckoutError("Your shopping bag is empty.");

  const combinedItems = new Map<string, { productId: string; variantSku: string; quantity: number }>();
  for (const item of rawItems) {
    const productId = clean(item.productId, 120);
    const variantSku = clean(item.variantSku, 80);
    const quantity = Math.floor(Number(item.quantity ?? 1));
    const key = `${productId}::${variantSku}`;
    const existing = combinedItems.get(key);
    combinedItems.set(key, { productId, variantSku, quantity: (existing?.quantity ?? 0) + quantity });
  }

  const items = Array.from(combinedItems.values());
  if (items.some((item) => !item.productId || item.quantity < 1 || item.quantity > 10)) {
    throw new CheckoutError("The cart contains an invalid item.");
  }

  const productIds = Array.from(new Set(items.map((item) => item.productId)));
  const products = await client.fetch<CheckoutProduct[]>(checkoutProductsQuery, { productIds });
  const productMap = new Map(products.map((product) => [product._id, product]));

  return items.map<ResolvedCheckoutLine>((item) => {
    const product = productMap.get(item.productId);
    if (!product || product.stockStatus === "outOfStock") {
      throw new CheckoutError("One or more products are no longer available.");
    }

    const variant = item.variantSku
      ? product.variants?.find((candidate) => candidate.sku === item.variantSku)
      : undefined;
    if (product.variants?.length && !variant) {
      throw new CheckoutError(`Please select an available option for ${product.title}.`);
    }

    const available = variant?.stockQuantity ?? product.stockQuantity;
    if (typeof available === "number" && available < item.quantity) {
      throw new CheckoutError(`Only ${available} of ${product.title} remain in stock.`);
    }

    const unitPrice = variant?.price ?? product.price;
    if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
      throw new CheckoutError("One or more products have an invalid price.");
    }

    return {
      productId: product._id,
      title: product.title,
      slug: product.slug,
      sku: variant?.sku ?? product.sku ?? product._id,
      variantSku: variant?.sku,
      variantKey: variant?._key,
      imageUrl: product.imageUrl,
      category: product.category,
      quantity: item.quantity,
      unitPrice,
      lineTotal: unitPrice * item.quantity,
    };
  });
}

