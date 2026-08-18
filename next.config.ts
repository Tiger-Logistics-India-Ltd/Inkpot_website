import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options",           value: "DENY" },
  { key: "X-Content-Type-Options",    value: "nosniff" },
  { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },

  // The June 2026 edition moved from /inaugural-edition when the archive was
  // restructured (Aug 2026). Google had never crawled the old URL, but keep a
  // permanent redirect for external links and bookmarks.
  async redirects() {
    return [
      {
        source: "/the-living-table/inaugural-edition",
        destination: "/the-living-table/archive/june-2026",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
