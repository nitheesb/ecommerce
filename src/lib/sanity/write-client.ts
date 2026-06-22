import "server-only";

import { createClient, type SanityClient } from "@sanity/client";

let writeClient: SanityClient | null = null;

export function getSanityWriteClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const token = process.env.SANITY_API_TOKEN;

  if (!projectId || !token) {
    throw new Error("Sanity order storage is not configured.");
  }

  if (!writeClient) {
    writeClient = createClient({
      projectId,
      dataset,
      token,
      apiVersion: "2024-01-01",
      useCdn: false,
      perspective: "published",
    });
  }

  return writeClient;
}
