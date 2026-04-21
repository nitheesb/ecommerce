/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Keep storefront assets rendering on hosts without Next's image optimizer.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
};

export default nextConfig;
