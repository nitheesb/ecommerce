import imageUrlBuilder, { type SanityImageSource } from "@sanity/image-url";

/** Returns an image URL builder for chaining .width().height().url() */
export function urlFor(source: SanityImageSource) {
  const builder = imageUrlBuilder({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  });
  return builder.image(source);
}
