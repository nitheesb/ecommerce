import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

import { CheckoutError, resolveCheckoutItems, type CheckoutItemInput } from "@/lib/checkout-pricing";
import { CouponError, normalizeCouponCode, validateCoupon } from "@/lib/coupons";
import { createRazorpayOrder, getRazorpayKeyId } from "@/lib/razorpay";
import { rateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { getSanityWriteClient } from "@/lib/sanity/write-client";

export const runtime = "nodejs";

type CheckoutBody = {
  items?: CheckoutItemInput[];
  couponCode?: string;
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
    const limit = await rateLimit(request, { namespace: "checkout", limit: 5, windowSeconds: 600 });
    if (!limit.allowed) {
      return NextResponse.json(
        { error: limit.configured ? "Too many checkout attempts. Please wait a few minutes and try again." : "Checkout is temporarily unavailable." },
        { status: limit.configured ? 429 : 503, headers: rateLimitHeaders(limit) },
      );
    }

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
    if (shippingAddress.country.toLowerCase() !== "india") {
      return NextResponse.json({ error: "Online checkout is currently available for delivery within India only." }, { status: 400 });
    }
    shippingAddress.country = "India";

    const client = getSanityWriteClient();
    const resolvedItems = await resolveCheckoutItems(client, rawItems);
    const lineItems = resolvedItems.map((item, index) => ({
        _key: `item-${index}-${randomBytes(3).toString("hex")}`,
        product: { _type: "reference", _ref: item.productId, _weak: true },
        ...item,
      }));

    const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const couponCode = normalizeCouponCode(body.couponCode);
    const coupon = couponCode
      ? await validateCoupon(client, {
          code: couponCode,
          subtotal,
          lineItems: resolvedItems,
          customerEmail: customer.email,
        })
      : null;
    const discountAmount = coupon?.discountAmount ?? 0;
    const shippingAmount = getShippingAmount(subtotal);
    const total = subtotal - discountAmount + shippingAmount;
    if (!Number.isFinite(total) || total < 1) {
      throw new CheckoutError("This discount would make the payable total invalid. Please contact us for help.");
    }
    const orderNumber = `THZ-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${randomBytes(3).toString("hex").toUpperCase()}`;
    const razorpayOrder = await createRazorpayOrder({
      amount: Math.round(total * 100),
      receipt: orderNumber,
      notes: { orderNumber, customerEmail: customer.email, ...(coupon ? { couponCode: coupon.code } : {}) },
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
      ...(coupon
        ? {
            coupon: { _type: "reference", _ref: coupon.couponId, _weak: true },
            couponCode: coupon.code,
            couponDiscountType: coupon.discountType,
            couponDiscountValue: coupon.discountValue,
            discountAmount,
          }
        : { discountAmount: 0 }),
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
      couponCode: coupon?.code,
      discountAmount,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout could not be started.";
    const configurationError = /not configured/i.test(message);
    const customerError = error instanceof CheckoutError || error instanceof CouponError || error instanceof SyntaxError;
    console.error("Checkout order error", error);
    return NextResponse.json(
      {
        error: configurationError
          ? "Checkout is temporarily unavailable."
          : customerError
          ? error instanceof CheckoutError || error instanceof CouponError
            ? message
            : "Invalid checkout request."
          : "Checkout could not be started. Please try again.",
      },
      { status: configurationError ? 503 : customerError ? 400 : 500 },
    );
  }
}
