import type { MetadataRoute } from "next";

const SITE_URL = "https://www.westcoastmarinetraining.com.au";

// Keeps crawlers out of the signed-in student portal, staff portals, API
// routes and checkout flow entirely, rather than relying only on their
// own login redirects — saves crawl budget and keeps Google Search
// Console's coverage report free of "redirected" noise. Public marketing
// pages (/, /about, /faq) and the auth pages (/login, /register, etc.)
// stay crawlable — the auth pages carry their own noindex meta tag (see
// (auth)/layout.tsx) rather than being blocked here, so a stray inbound
// link to them still gets de-indexed instead of just invisible to
// Google. Added 21 October 2026 as part of the SEO pass.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        "/instructor/",
        "/dashboard/",
        "/modules/",
        "/assessment/",
        "/reference/",
        "/bookmarks/",
        "/settings/",
        "/welcome/",
        "/checkout/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
