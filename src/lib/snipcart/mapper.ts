import type { IProduct, IProductVariant, ISnipcartItem, ISnipcartCustomField } from "@/types";
import { urlFor } from "@/lib/sanity/image";
import { absoluteUrl } from "@/lib/utils";

/**
 * Maps a Sanity product (+ optional selected variant) to Snipcart data attributes.
 */
export function mapProductToSnipcartItem(
  product: IProduct,
  variant?: IProductVariant,
): ISnipcartItem {
  const effectivePrice = variant?.price ?? product.price;
  const variants = product.variants ?? [];
  const imageUrl = variant?.image
    ? urlFor(variant.image).width(400).height(500).url()
    : urlFor(product.mainImage).width(400).height(500).url();

  const customFields: ISnipcartCustomField[] = [];

  if (variants.length > 0) {
    const colorOptions = variants.map((v) => v.color).join("|");
    customFields.push({
      name: "Color",
      options: colorOptions,
      type: "dropdown",
      required: true,
      value: variant?.color,
    });

    const sizesAvailable = variants
      .filter((v) => v.size)
      .map((v) => v.size!);
    if (sizesAvailable.length > 0) {
      customFields.push({
        name: "Size",
        options: [...new Set(sizesAvailable)].join("|"),
        type: "dropdown",
        required: true,
        value: variant?.size,
      });
    }
  }

  return {
    id: variant?.sku ?? product.sku ?? product._id,
    url: absoluteUrl(`/product/${product.slug.current}`),
    name: product.title,
    price: effectivePrice,
    image: imageUrl,
    description: product.description,
    maxQuantity: variant?.stockQuantity,
    customFields: customFields.length > 0 ? customFields : undefined,
  };
}
