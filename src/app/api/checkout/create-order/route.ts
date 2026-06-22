import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

import { createRazorpayOrder, getRazorpayKeyId } from "@/lib/razorpay";
import { getSanityWriteClient } from "@/lib/sanity/write-client";

export const runtime = "nodejs";

type CheckoutItemInput = { productId?: string; variantSku?: string; quantity?: number };
type CheckoutBody = {
  items?: CheckoutItemInput[];
  customer?: { name?: string; email?: string; phone?: string };
  shippingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  website?: string;
};

type CheckoutProduct = {
  _id: string;
  title: string;
  slug: string;
  sku?: string;
  price: number;
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

class CheckoutError extends Error {}

const checkoutProductsQuery = `
  *[_type == "saree" && !(_id in path("drafts.**")) && _id in $productIds && coalesce(status, "active") == "active"] {
    _id, title, "slug": slug.current, sku, price, stockStatus, stockQuantity,
    "imageUrl": mainImage.asset->url,
    "variants": coalesce(variants[]{_key, sku, price, stockQuantity}, [])
  }
`;

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getShippingAmount(subtotal: number) {
  const fee = Math.max(0, Number(process.env.SHIPPING_FEE_INR ?? 0) || 0);
  const freeThreshold = Math.max(0, Number(process.env.FREE_SHIPPING_THRESHOLD_INR ?? 2000) || 0);
  return freeThreshold > 0 && subtotal >= freeThreshold ? 0 : fee;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutBody;
    if (body.website) return NextResponse.json({ error: "Invalid checkout request." }, { status: 400 });

    const customer = {
      name: clean(body.customer?.name, 100),
      email: clean(body.customer?.email, 160).toLowerCase(),
      phone: clean(body.customer?.phone, 24),
    };
    const shippingAddress = {
      line1: clean(body.shippingAddress?.line1, 160),
      line2: clean(body.shippingAddress?.line2, 160),
      city: clean(body.shippingAddress?.city, 80),
      state: clean(body.shippingAddress?.state, 80),
      postalCode: clean(body.shippingAddress?.postalCode, 16),
      country: clean(body.shippingAddress?.country || "India", 80),
    };
    const rawItems = Array.isArray(body.items) ? body.items.slice(0, 20) : [];

    if (
      rawItems.length === 0 ||
      !customer.name ||
      !isValidEmail(customer.email) ||
      !customer.phone ||
      !shippingAddress.line1 ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode
    ) {
      return NextResponse.json({ error: "Please provide valid items, contact details, and delivery address." }, { status: 400 });
    }

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
      return NextResponse.json({ error: "The cart contains an invalid item." }, { status: 400 });
    }

    const client = getSanityWriteClient();
    const productIds = Array.from(new Set(items.map((item) => item.productId)));
    const products = await client.fetch<CheckoutProduct[]>(checkoutProductsQuery, { productIds });
    const productMap = new Map(products.map((product) => [product._id, product]));

    const lineItems = items.map((item, index) => {
      const product = productMap.get(item.productId);
      if (!product || product.stockStatus === "outOfStock") throw new CheckoutError("One or more products are no longer available.");

      const variant = item.variantSku
        ? product.variants?.find((candidate) => candidate.sku === item.variantSku)
        : undefined;
      if (product.variants?.length && !variant) throw new CheckoutError(`Please select an available option for ${product.title}.`);

      const available = variant?.stockQuantity ?? product.stockQuantity;
      if (typeof available === "number" && available < item.quantity) {
        throw new CheckoutError(`Only ${available} of ${product.title} remain in stock.`);
      }

      const unitPrice = variant?.price ?? product.price;
      if (!Number.isFinite(unitPrice) || unitPrice <= 0) throw new CheckoutError("One or more products have an invalid price.");

      return {
        _key: `item-${index}-${randomBytes(3).toString("hex")}`,
        product: { _type: "reference", _ref: product._id, _weak: true },
        productId: product._id,
        title: product.title,
        slug: product.slug,
        sku: variant?.sku ?? product.sku ?? product._id,
        variantSku: variant?.sku,
        variantKey: variant?._key,
        imageUrl: product.imageUrl,
        quantity: item.quantity,
        unitPrice,
        lineTotal: unitPrice * item.quantity,
      };
    });

    const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const shippingAmount = getShippingAmount(subtotal);
    const total = subtotal + shippingAmount;
    const orderNumber = `THZ-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${randomBytes(3).toString("hex").toUpperCase()}`;
    const razorpayOrder = await createRazorpayOrder({
      amount: Math.round(total * 100),
      receipt: orderNumber,
      notes: { orderNumber, customerEmail: customer.email },
    });

    await client.create({
      _id: `order.${razorpayOrder.id}`,
      _type: "order",
      orderNumber,
      status: "paymentPending",
      paymentStatus: "created",
      fulfilmentStatus: "unfulfilled",
      customer,
      shippingAddress,
      lineItems,
      subtotal,
      shippingAmount,
      total,
      currency: "INR",
      razorpayOrderId: razorpayOrder.id,
      receipt: razorpayOrder.receipt,
      inventoryAdjusted: false,
    });

    return NextResponse.json({
      keyId: getRazorpayKeyId(),
      orderId: razorpayOrder.id,
      orderNumber,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      customer,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout could not be started.";
    const configurationError = /not configured/i.test(message);
    const customerError = error instanceof CheckoutError || error instanceof SyntaxError;
    console.error("Checkout order error", error);
    return NextResponse.json(
      {
        error: configurationError
          ? "Checkout is temporarily unavailable."
          : customerError
          ? error instanceof CheckoutError
            ? message
            : "Invalid checkout request."
          : "Checkout could not be started. Please try again.",
      },
      { status: configurationError ? 503 : customerError ? 400 : 500 },
    );
  }
}
