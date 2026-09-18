// Minimal service worker for the PWA install (Chrome/Android in particular
// won't offer "Install app" without one registered). Added 18 September
// 2026 alongside src/app/manifest.ts.
//
// Deliberately narrow scope: this ONLY cache-first's Next's hashed static
// build assets (_next/static/*, safe — the hash changes when the content
// does) plus the app icons/logo. It never caches page HTML, RSC payloads,
// or anything under /api/ — those all go straight to the network,
// untouched. Reasoning: this app serves gated, per-account content
// (modules, reference library, orders) over cookie auth, sometimes on
// shared/public devices (a library computer, a boat club's tablet). A more
// aggressive "cache pages for offline reading" strategy risks one
// student's cached lesson page being served to whoever's logged in next on
// the same device after they log out — not worth it for what's really
// just meant to make the installed app feel fast and native. If real
// offline lesson-reading is wanted later, it needs a per-user cache keyed
// off something that actually invalidates on logout — a bigger, separate
// piece of work, not bundled into this.
const CACHE_NAME = "wcmt-static-v1";
const CACHEABLE_PATH_PREFIXES = ["/_next/static/", "/icons/", "/logo-", "/apple-touch-icon.png"];

function isCacheable(url) {
  return CACHEABLE_PATH_PREFIXES.some((prefix) => url.pathname.startsWith(prefix));
}

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Only ever handle same-origin GETs — everything else (Stripe, Supabase,
  // ClickSend, POSTs, etc.) passes straight through untouched.
  if (event.request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  if (!isCacheable(url)) {
    return; // network only — no caches.match, no caches.put
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(event.request);
      if (cached) return cached;
      const response = await fetch(event.request);
      if (response.ok) cache.put(event.request, response.clone());
      return response;
    })
  );
});
