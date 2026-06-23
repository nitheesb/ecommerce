import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export function subscriberId(email: string) {
  return `newsletterSubscriber.${createHash("sha256").update(email).digest("hex")}`;
}

export function createUnsubscribeToken(email: string) {
  const secret = process.env.NEWSLETTER_SIGNING_SECRET;
  if (!secret) throw new Error("Newsletter signing is not configured.");
  const encodedEmail = Buffer.from(email).toString("base64url");
  const signature = createHmac("sha256", secret).update(encodedEmail).digest("base64url");
  return `${encodedEmail}.${signature}`;
}

export function verifyUnsubscribeToken(token: string) {
  const secret = process.env.NEWSLETTER_SIGNING_SECRET;
  const [encodedEmail, providedSignature] = token.split(".");
  if (!secret || !encodedEmail || !providedSignature) return null;

  const expectedSignature = createHmac("sha256", secret).update(encodedEmail).digest("base64url");
  const provided = Buffer.from(providedSignature);
  const expected = Buffer.from(expectedSignature);
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return null;

  try {
    return Buffer.from(encodedEmail, "base64url").toString("utf8").toLowerCase();
  } catch {
    return null;
  }
}
