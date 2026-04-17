"use client";

import type { IProduct, IProductVariant, ISnipcartItem, ISnipcartCustomField } from "@/types";
import { mapProductToSnipcartItem } from "@/lib/snipcart/mapper";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

interface BuyButtonProps {
  product: IProduct;
  variant?: IProductVariant;
  className?: string;
  children?: React.ReactNode;
}

/** Renders a Snipcart-compatible add-to-cart button with all required data attributes. */
export function BuyButton({ product, variant, className, children }: BuyButtonProps) {
  const item = mapProductToSnipcartItem(product, variant);

  const dataAttributes: Record<string, string | number | undefined> = {
    "data-item-id": item.id,
    "data-item-url": item.url,
    "data-item-name": item.name,
    "data-item-price": item.price,
    "data-item-image": item.image,
    "data-item-description": item.description,
  };

  if (item.maxQuantity !== undefined) {
    dataAttributes["data-item-max-quantity"] = item.maxQuantity;
  }

  // Map custom fields to Snipcart data-item-custom{n}-* attributes
  if (item.customFields) {
    item.customFields.forEach((field: ISnipcartCustomField, index: number) => {
      const n = index + 1;
      dataAttributes[`data-item-custom${n}-name`] = field.name;
      dataAttributes[`data-item-custom${n}-options`] = field.options;
      if (field.type) dataAttributes[`data-item-custom${n}-type`] = field.type;
      if (field.required) dataAttributes[`data-item-custom${n}-required`] = "true";
      if (field.value) dataAttributes[`data-item-custom${n}-value`] = field.value;
    });
  }

  return (
    <Button
      className={`snipcart-add-item ${className ?? ""}`}
      {...dataAttributes}
    >
      {children ?? (
        <>
          <ShoppingBag className="mr-2 h-4 w-4" />
          Add to Cart
        </>
      )}
    </Button>
  );
}
