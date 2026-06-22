import { NextResponse } from "next/server";

import { recordFailedPayment, recordSuccessfulPayment } from "@/lib/orders";
import { verifyWebhookSignature } from "@/lib/razorpay";

export const runtime = "nodejs";

type RazorpayWebhook = {
  event?: string;
  payload?: {
    order?: { entity?: { id?: string } };
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        error_description?: string;
        error_reason?: string;
      };
    };
  };
};

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";

  try {
    if (!signature || !verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
    }

    const event = JSON.parse(rawBody) as RazorpayWebhook;
    const payment = event.payload?.payment?.entity;
    const razorpayOrderId = event.payload?.order?.entity?.id ?? payment?.order_id;

    if (!razorpayOrderId) return NextResponse.json({ received: true });

    if (event.event === "order.paid" || event.event === "payment.captured") {
      await recordSuccessfulPayment(razorpayOrderId, payment?.id);
    } else if (event.event === "payment.failed") {
      await recordFailedPayment(
        razorpayOrderId,
        payment?.id,
        payment?.error_description ?? payment?.error_reason,
      );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Razorpay webhook error", error);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
