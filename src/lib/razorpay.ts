import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

type RazorpayOrderInput = {
  amount: number;
  receipt: string;
  notes?: Record<string, string>;
};

export type RazorpayOrder = {
  id: string;
  entity: "order";
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: "INR";
  receipt: string;
  status: "created" | "attempted" | "paid";
};

function getRazorpayCredentials() {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay is not configured.");
  }

  return { keyId, keySecret };
}

export function getRazorpayKeyId() {
  return getRazorpayCredentials().keyId;
}

export async function createRazorpayOrder(input: RazorpayOrderInput) {
  const { keyId, keySecret } = getRazorpayCredentials();
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: input.amount,
      currency: "INR",
      receipt: input.receipt,
      notes: input.notes,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("Razorpay order creation failed", response.status, body);
    throw new Error("Could not create the payment order.");
  }

  return response.json() as Promise<RazorpayOrder>;
}

function secureCompare(expected: string, received: string) {
  const expectedBuffer = Buffer.from(expected, "utf8");
  const receivedBuffer = Buffer.from(received, "utf8");
  return expectedBuffer.length === receivedBuffer.length && timingSafeEqual(expectedBuffer, receivedBuffer);
}

export function verifyCheckoutSignature(orderId: string, paymentId: string, signature: string) {
  const { keySecret } = getRazorpayCredentials();
  const expected = createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return secureCompare(expected, signature);
}

export function verifyWebhookSignature(rawBody: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) throw new Error("Razorpay webhook secret is not configured.");

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  return secureCompare(expected, signature);
}
