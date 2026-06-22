import { NextResponse } from "next/server";

import { verifyCheckoutSignature } from "@/lib/razorpay";
import { getSanityWriteClient } from "@/lib/sanity/write-client";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const orderId = typeof body.razorpay_order_id === "string" ? body.razorpay_order_id : "";
    const paymentId = typeof body.razorpay_payment_id === "string" ? body.razorpay_payment_id : "";
    const signature = typeof body.razorpay_signature === "string" ? body.razorpay_signature : "";

    if (!orderId || !paymentId || !signature || !verifyCheckoutSignature(orderId, paymentId, signature)) {
      return NextResponse.json({ verified: false, error: "Payment verification failed." }, { status: 400 });
    }

    const client = getSanityWriteClient();
    const order = await client.fetch<{ _id: string } | null>(
      `*[_type == "order" && razorpayOrderId == $orderId][0]{_id}`,
      { orderId },
    );
    if (!order) return NextResponse.json({ verified: false, error: "Order not found." }, { status: 404 });

    await client
      .patch(order._id)
      .set({ paymentStatus: "signatureVerified", razorpayPaymentId: paymentId })
      .commit();

    return NextResponse.json({ verified: true });
  } catch (error) {
    console.error("Checkout verification error", error);
    return NextResponse.json({ verified: false, error: "Payment verification is temporarily unavailable." }, { status: 500 });
  }
}
