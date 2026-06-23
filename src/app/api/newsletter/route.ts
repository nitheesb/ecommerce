import { NextResponse } from "next/server";

import { createUnsubscribeToken, subscriberId } from "@/lib/newsletter";
import { rateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { sendTransactionalEmail } from "@/lib/resend";
import { getSanityWriteClient } from "@/lib/sanity/write-client";
import { SITE_URL } from "@/lib/utils";

export const runtime = "nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const consentText = "I agree to receive collection drops, archive releases, and styling notes by email.";

export async function POST(request: Request) {
  const limit = await rateLimit(request, { namespace: "newsletter", limit: 5, windowSeconds: 3600 });
  if (!limit.allowed) {
    return NextResponse.json(
      { message: limit.configured ? "Too many signup attempts. Please try again later." : "Newsletter signup is temporarily unavailable." },
      { status: limit.configured ? 429 : 503, headers: rateLimitHeaders(limit) },
    );
  }

  const body = (await request.json().catch(() => null)) as
    | { email?: string; source?: string; website?: string }
    | null;
  const email = body?.email?.trim().toLowerCase() ?? "";
  const source = body?.source?.trim().slice(0, 60) || "unknown";

  if (body?.website) return NextResponse.json({ ok: true });
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ message: "Enter a valid email address to join the list." }, { status: 400 });
  }

  try {
    const token = createUnsubscribeToken(email);
    const client = getSanityWriteClient();
    const id = subscriberId(email);
    const now = new Date().toISOString();
    const existing = await client.fetch<{ status?: string; welcomeEmailSentAt?: string } | null>(
      `*[_id == $id][0]{status, welcomeEmailSentAt}`,
      { id },
    );

    await client
      .transaction()
      .createIfNotExists({
        _id: id,
        _type: "newsletterSubscriber",
        email,
        source,
        status: "subscribed",
        subscribedAt: now,
        lastSubmittedAt: now,
        consentText,
      })
      .patch(id, (patch) =>
        patch
          .set({ status: "subscribed", source, lastSubmittedAt: now, consentText })
          .unset(["unsubscribedAt"]),
      )
      .commit();

    if (!existing?.welcomeEmailSentAt || existing.status === "unsubscribed") {
      const unsubscribeUrl = `${SITE_URL}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
      const sent = await sendTransactionalEmail(
        email,
        "Welcome to the House of Thazhuval",
        `<div style="font-family:Georgia,serif;color:#24303a;line-height:1.65;max-width:600px;margin:auto"><h1 style="font-weight:400">Welcome to the house.</h1><p>You are now on the list for collection drops, archive releases, and thoughtful styling notes.</p><p style="font-family:Arial,sans-serif;font-size:12px;color:#66717b">You can <a href="${unsubscribeUrl}">unsubscribe at any time</a>.</p></div>`,
      );
      if (sent) await client.patch(id).set({ welcomeEmailSentAt: new Date().toISOString() }).commit();
    }

    return NextResponse.json({ ok: true }, { headers: rateLimitHeaders(limit) });
  } catch (error) {
    console.error("Newsletter signup failed", error);
    return NextResponse.json({ message: "We couldn’t save your signup right now. Please try again shortly." }, { status: 503 });
  }
}
