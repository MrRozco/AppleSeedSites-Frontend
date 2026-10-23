/** @type {import('next').NextConfig} */

// Image hosts that next/image may optimize: Strapi Cloud (API + media CDN) and local Strapi.
const strapi = new URL(process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337");

const remotePatterns = [
  { protocol: "https", hostname: "incredible-friendship-84da35b266.strapiapp.com" },
  { protocol: "https", hostname: "incredible-friendship-84da35b266.media.strapiapp.com" },
  { protocol: "http", hostname: "localhost" },
  { protocol: "http", hostname: "127.0.0.1" },
  { protocol: strapi.protocol.replace(":", ""), hostname: strapi.hostname },
];

const nextConfig = {
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns,
    // Next 16 blocks optimizing images from local IPs by default; allow it for a local Strapi in dev.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
