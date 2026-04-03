import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.com https://*.clerk.accounts.dev https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' blob: data: https://*.clerk.com https://img.clerk.com",
      "font-src 'self' https://fonts.gstatic.com",
      "frame-src https://clerk.com https://*.clerk.accounts.dev https://challenges.cloudflare.com",
      "connect-src 'self' https://api.clerk.com https://*.clerk.accounts.dev",
    ].join("; "),
  },
];

const config: NextConfig = {
  headers: async () => [{ source: "/(.*)", headers: securityHeaders }],
  images: {
    domains: ["img.clerk.com", "images.clerk.dev"],
  },
  experimental: {
    serverActions: { allowedOrigins: ["localhost:3000"] },
  },
};

export default config;
