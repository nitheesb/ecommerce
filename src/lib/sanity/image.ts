import imageUrlBuilder, { type SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "./client";

const builder = imageUrlBuilder(sanityClient);

/** Returns an image URL builder for chaining .width().height().url() */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
