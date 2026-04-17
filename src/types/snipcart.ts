// ---------------------------------------------------------------------------
// Snipcart Integration Types — maps to Snipcart's data-item-* HTML attributes
// ---------------------------------------------------------------------------

/** Custom field for variant selection in Snipcart's buy button */
export interface ISnipcartCustomField {
  name: string;
  options: string;
  type?: "dropdown" | "textarea" | "readonly" | "hidden";
  required?: boolean;
  value?: string;
}

/** Required data attributes for a Snipcart buy button */
export interface ISnipcartItem {
  /** Unique product identifier — maps to data-item-id */
  id: string;
  /** Product URL for crawl validation — maps to data-item-url */
  url: string;
  /** Display name — maps to data-item-name */
  name: string;
  /** Unit price in INR — maps to data-item-price */
  price: number;
  /** Product image URL — maps to data-item-image */
  image: string;
  /** Product description — maps to data-item-description */
  description: string;
  /** Maximum purchasable quantity — maps to data-item-max-quantity */
  maxQuantity?: number;
  /** Minimum purchasable quantity — maps to data-item-min-quantity */
  minQuantity?: number;
  /** Whether item is stackable — maps to data-item-stackable */
  stackable?: "always" | "never" | "auto";
  /** Custom fields for variants — maps to data-item-custom{n}-* */
  customFields?: ISnipcartCustomField[];
}
