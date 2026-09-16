/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV !== "production",
  // Cache strategies for different asset types
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts",
        expiration: { maxEntries: 4, maxAgeSeconds: 365 * 24 * 60 * 60 },
      },
    },
    {
      urlPattern: /\/api\/products.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "products-api",
        expiration: { maxEntries: 50, maxAgeSeconds: 5 * 60 },
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: /\.(png|jpg|jpeg|webp|svg|gif|ico)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "images",
        expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 },
      },
    },
  ],
});


const securityHeaders = [
  // Prevents the browser from MIME-sniffing a response away from the declared content-type
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Stops the page being embedded in iframes (clickjacking protection)
  { key: "X-Frame-Options", value: "DENY" },
  // Forces HTTPS for 1 year (enable only once HTTPS is confirmed working)
  // { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Controls referrer information sent with requests
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Restricts browser features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
  },
  // Content Security Policy
  // 'unsafe-inline' kept for styles because the app uses inline style props extensively.
  // Tighten further once a nonce-based approach is adopted.
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Scripts: self + Next.js inline scripts (needed for hydration)
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      // Styles: self + inline (heavily used in this codebase)
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // Images: self + backend API + data URIs
      `img-src 'self' data: blob: http://localhost:3001 ${process.env.NEXT_PUBLIC_CDN_URL || ""}`,
      // API calls: self + backend
      `connect-src 'self' http://localhost:3001 ${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}`,
      // Media
      "media-src 'none'",
      // No plugins
      "object-src 'none'",
      // No framing
      "frame-ancestors 'none'",
      // Base URI locked to self
      "base-uri 'self'",
      // Forms only submit to self
      "form-action 'self'",
    ]
      .filter(Boolean)
      .join("; "),
  },
];

const nextConfig = {
  reactStrictMode: true,

  // Security headers on all routes
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/**",
      },
    ],
  },

  // Reduce bundle size in production
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error", "warn"] }
      : false,
  },
};

module.exports = withPWA(nextConfig);
