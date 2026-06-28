import { NextResponse } from "next/server";

import { CheckoutError, resolveCheckoutItems, type CheckoutItemInput } from "@/lib/checkout-pricing";
import { CouponError, validateCoupon } from "@/lib/coupons";
import { rateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { getSanityWriteClient } from "@/lib/sanity/write-client";

export const runtime = "nodejs";

type CouponRequest = {
  code?: string;
  items?: CheckoutItemInput[];
};

function getShippingAmount(subtotal: number) {
  const fee = Math.max(0, Number(process.env.SHIPPING_FEE_INR ?? 0) || 0);
  const freeThreshold = Math.max(0, Number(process.env.FREE_SHIPPING_THRESHOLD_INR ?? 2000) || 0);
  return freeThreshold > 0 && subtotal >= freeThreshold ? 0 : fee;
}

export async function POST(request: Request) {
  try {
    const limit = await rateLimit(request, { namespace: "coupon", limit: 20, windowSeconds: 600 });
    if (!limit.allowed) {
      return NextResponse.json(
        { error: limit.configured ? "Too many attempts. Please wait before trying another code." : "Discount codes are temporarily unavailable." },
        { status: limit.configured ? 429 : 503, headers: rateLimitHeaders(limit) },
      );
    }

    const body = (await request.json()) as CouponRequest;
    const client = getSanityWriteClient();
    const lineItems = await resolveCheckoutItems(client, body.items);
    const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const coupon = await validateCoupon(client, { code: body.code, subtotal, lineItems });
    const shippingAmount = getShippingAmount(subtotal);

    return NextResponse.json({
      code: coupon.code,
      discountAmount: coupon.discountAmount,
      discountedSubtotal: subtotal - coupon.discountAmount,
      shippingAmount,
      total: subtotal - coupon.discountAmount + shippingAmount,
    });
  } catch (error) {
    const customerError = error instanceof CheckoutError || error instanceof CouponError || error instanceof SyntaxError;
    console.error("Coupon validation error", error);
    return NextResponse.json(
      { error: customerError && error instanceof Error ? error.message : "This discount code could not be checked." },
      { status: customerError ? 400 : 500 },
    );
  }
}

