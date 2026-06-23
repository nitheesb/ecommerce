import "server-only";

import { createHash } from "node:crypto";

import { getSanityWriteClient } from "@/lib/sanity/write-client";

type RateLimitOptions = {
  namespace: string;
  limit: number;
  windowSeconds: number;
};

export type RateLimitResult = {
  allowed: boolean;
  configured: boolean;
  limit: number;
  remaining: number;
  retryAfter: number;
};

const fixedWindowScript = `
local current = redis.call("INCR", KEYS[1])
if current == 1 then
  redis.call("EXPIRE", KEYS[1], ARGV[1])
end
local ttl = redis.call("TTL", KEYS[1])
return {current, ttl}
`;

function clientIdentifier(request: Request) {
  const forwarded =
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const ip = forwarded.split(",")[0]?.trim() || "unknown";
  const salt = process.env.RATE_LIMIT_SALT ?? "thazhuval-rate-limit";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

export async function rateLimit(request: Request, options: RateLimitOptions): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const fallback: RateLimitResult = {
    allowed: process.env.NODE_ENV !== "production",
    configured: false,
    limit: options.limit,
    remaining: 0,
    retryAfter: options.windowSeconds,
  };

  const bucket = Math.floor(Date.now() / (options.windowSeconds * 1000));
  const identifier = clientIdentifier(request);

  if (!url || !token) {
    try {
      const client = getSanityWriteClient();
      const id = `requestRateLimit.${options.namespace}.${identifier}.${bucket}`;
      const expiresAt = new Date((bucket + 1) * options.windowSeconds * 1000).toISOString();
      await client
        .transaction()
        .createIfNotExists({ _id: id, _type: "requestRateLimit", count: 0, expiresAt })
        .patch(id, (patch) => patch.inc({ count: 1 }))
        .commit();
      const count = await client.fetch<number>(`*[_id == $id][0].count`, { id });
      const retryAfter = Math.max(1, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 1000));
      return {
        allowed: count <= options.limit,
        configured: true,
        limit: options.limit,
        remaining: Math.max(0, options.limit - count),
        retryAfter,
      };
    } catch (error) {
      console.error("Sanity rate limit fallback unavailable", error);
      return fallback;
    }
  }

  const key = `thazhuval:${options.namespace}:${identifier}:${bucket}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(["EVAL", fixedWindowScript, "1", key, String(options.windowSeconds)]),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Upstash returned ${response.status}`);

    const payload = (await response.json()) as { result?: [number, number]; error?: string };
    if (payload.error || !Array.isArray(payload.result)) throw new Error(payload.error ?? "Invalid Upstash response");

    const [count, ttl] = payload.result.map(Number);
    return {
      allowed: count <= options.limit,
      configured: true,
      limit: options.limit,
      remaining: Math.max(0, options.limit - count),
      retryAfter: Math.max(1, ttl || options.windowSeconds),
    };
  } catch (error) {
    console.error("Rate limit service unavailable", error);
    return fallback;
  }
}

export function rateLimitHeaders(result: RateLimitResult) {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "Retry-After": String(result.retryAfter),
  };
}
