import "server-only";

import type { SanityClient } from "@sanity/client";

import type { ResolvedCheckoutLine } from "@/lib/checkout-pricing";

type Coupon = {
  _id: string;
  code: string;
  active?: boolean;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  maximumDiscountAmount?: number;
  minimumSubtotal?: number;
  startsAt?: string;
  expiresAt?: string;
  usageLimit?: number;
  perCustomerLimit?: number;
  appliesTo?: "all" | "categories" | "products";
  eligibleCategories?: string[];
  eligibleProductIds?: string[];
};

export type AppliedCoupon = {
  couponId: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  discountAmount: number;
};

export class CouponError extends Error {}

const couponQuery = `
  *[_type == "coupon" && !(_id in path("drafts.**")) && code == $code][0] {
    _id, code, active, discountType, discountValue, maximumDiscountAmount,
    minimumSubtotal, startsAt, expiresAt, usageLimit, perCustomerLimit,
    appliesTo, eligibleCategories, "eligibleProductIds": eligibleProducts[]._ref
  }
`;

export function normalizeCouponCode(value: unknown) {
  return typeof value === "string" ? value.trim().toUpperCase().replace(/\s+/g, "").slice(0, 40) : "";
}

export async function validateCoupon(
  client: SanityClient,
  input: {
    code: unknown;
    subtotal: number;
    lineItems: ResolvedCheckoutLine[];
    customerEmail?: string;
  },
): Promise<AppliedCoupon> {
  const code = normalizeCouponCode(input.code);
  if (!code) throw new CouponError("Enter a discount code.");

  const coupon = await client.fetch<Coupon | null>(couponQuery, { code });
  if (!coupon || coupon.active === false) throw new CouponError("This discount code is not valid.");

  const now = Date.now();
  if (coupon.startsAt && new Date(coupon.startsAt).getTime() > now) {
    throw new CouponError("This discount code is not active yet.");
  }
  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() <= now) {
    throw new CouponError("This discount code has expired.");
  }
  if ((coupon.minimumSubtotal ?? 0) > input.subtotal) {
    throw new CouponError(`Spend at least ₹${coupon.minimumSubtotal?.toLocaleString("en-IN")} to use this code.`);
  }

  const email = input.customerEmail?.trim().toLowerCase();
  const redemptionCounts = await client.fetch<{ total: number; customer: number }>(
    `{
      "total": count(*[_type == "order" && status == "paid" && couponCode == $code]),
      "customer": count(*[_type == "order" && status == "paid" && couponCode == $code && customer.email == $email])
    }`,
    { code, email: email ?? "" },
  );
  if (coupon.usageLimit && redemptionCounts.total >= coupon.usageLimit) {
    throw new CouponError("This discount code has reached its usage limit.");
  }
  if (email && coupon.perCustomerLimit && redemptionCounts.customer >= coupon.perCustomerLimit) {
    throw new CouponError("This discount code has already been used with this email address.");
  }

  const eligibleSubtotal = input.lineItems.reduce((sum, item) => {
    const eligible =
      !coupon.appliesTo ||
      coupon.appliesTo === "all" ||
      (coupon.appliesTo === "categories" && Boolean(item.category && coupon.eligibleCategories?.includes(item.category))) ||
      (coupon.appliesTo === "products" && Boolean(coupon.eligibleProductIds?.includes(item.productId)));
    return eligible ? sum + item.lineTotal : sum;
  }, 0);
  if (eligibleSubtotal <= 0) throw new CouponError("This discount code does not apply to the items in your bag.");

  const discountType = coupon.discountType;
  const discountValue = Number(coupon.discountValue ?? 0);
  if (!discountType || !Number.isFinite(discountValue) || discountValue <= 0) {
    throw new CouponError("This discount code is not configured correctly.");
  }

  let discountAmount =
    discountType === "percentage"
      ? Math.round((eligibleSubtotal * Math.min(discountValue, 100)) / 100)
      : Math.round(discountValue);
  if (discountType === "percentage" && coupon.maximumDiscountAmount) {
    discountAmount = Math.min(discountAmount, coupon.maximumDiscountAmount);
  }
  discountAmount = Math.min(discountAmount, eligibleSubtotal);

  return {
    couponId: coupon._id,
    code: coupon.code,
    discountType,
    discountValue,
    discountAmount,
  };
}

