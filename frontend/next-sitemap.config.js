/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://autofixkenya.co.ke",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,

  // Exclude auth, dashboard, and admin pages from public index
  exclude: [
    "/auth/*",
    "/dashboard",
    "/dashboard/*",
    "/admin",
    "/admin/*",
    "/my-garage",
    "/my-garage/*",
    "/checkout",
    "/order-tracking",
    "/api/*",
  ],

  // Pages with higher update frequency or priority
  transform: async (config, path) => {
    const highPriority = ["/", "/inventory", "/parts", "/services", "/appointments"];
    const priority = highPriority.includes(path) ? 1.0 : config.priority;
    const changefreq = path === "/" ? "daily" : config.changefreq;

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/auth/",
          "/dashboard/",
          "/admin/",
          "/my-garage/",
          "/checkout/",
          "/api/",
        ],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || "https://autofixkenya.co.ke"}/sitemap.xml`,
    ],
  },
};
