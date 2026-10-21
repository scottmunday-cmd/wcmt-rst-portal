import type { MetadataRoute } from "next";

const SITE_URL = "https://www.westcoastmarinetraining.com.au";

// Only the public marketing pages belong here. Everything under
// (student), /admin, /instructor and /checkout requires a signed-in
// session — Google would just get redirected to /login if it tried to
// crawl them (see (student)/layout.tsx and the checkout pages), so
// there's genuinely nothing for a sitemap to point at there. See
// robots.ts for the matching crawl rules. Added 21 October 2026 as part
// of the SEO pass.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
