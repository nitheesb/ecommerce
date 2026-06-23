import { NextResponse } from "next/server";

import { subscriberId, verifyUnsubscribeToken } from "@/lib/newsletter";
import { getSanityWriteClient } from "@/lib/sanity/write-client";

export const runtime = "nodejs";

function page(title: string, message: string, status = 200) {
  return new NextResponse(
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${title}</title><body style="margin:0;background:#fbf8f1;color:#24303a;font-family:Georgia,serif"><main style="max-width:580px;margin:15vh auto;padding:32px"><p style="font:12px Arial,sans-serif;letter-spacing:.2em;text-transform:uppercase">House of Thazhuval</p><h1 style="font-size:42px;font-weight:400">${title}</h1><p style="font:16px/1.7 Arial,sans-serif;color:#66717b">${message}</p><a href="/" style="font:12px Arial,sans-serif;color:#24303a;text-transform:uppercase;letter-spacing:.16em">Return to the house</a></main></body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } },
  );
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const email = verifyUnsubscribeToken(token);
  if (!email) return page("This link is invalid.", "Please contact us if you still need help leaving the mailing list.", 400);

  try {
    await getSanityWriteClient()
      .patch(subscriberId(email))
      .set({ status: "unsubscribed", unsubscribedAt: new Date().toISOString() })
      .commit();
    return page("You’re unsubscribed.", "We will no longer send collection and styling emails to this address.");
  } catch (error) {
    console.error("Newsletter unsubscribe failed", error);
    return page("We couldn’t update your subscription.", "Please try the link again or contact us for help.", 503);
  }
}
