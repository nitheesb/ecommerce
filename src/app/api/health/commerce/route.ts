import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function configured(...names: string[]) {
  return names.every((name) => Boolean(process.env[name]));
}

export async function GET() {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "";
  const checks = {
    sanity: configured("NEXT_PUBLIC_SANITY_PROJECT_ID", "NEXT_PUBLIC_SANITY_DATASET", "SANITY_API_TOKEN"),
    razorpay: configured("NEXT_PUBLIC_RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "RAZORPAY_WEBHOOK_SECRET"),
    resend: configured("RESEND_API_KEY", "RESEND_FROM_EMAIL", "ORDER_NOTIFICATION_EMAIL"),
    newsletter: configured("NEWSLETTER_SIGNING_SECRET"),
    shipping: configured("SHIPPING_FEE_INR", "FREE_SHIPPING_THRESHOLD_INR"),
    siteUrl: configured("NEXT_PUBLIC_SITE_URL"),
    rateLimit: configured("UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN") || configured("SANITY_API_TOKEN"),
  };
  const ready = Object.values(checks).every(Boolean);

  return NextResponse.json(
    {
      status: ready ? "ready" : "configuration_required",
      paymentMode: keyId.startsWith("rzp_live_") ? "live" : keyId.startsWith("rzp_test_") ? "test" : "unknown",
      checks,
    },
    { status: ready ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
