import Link from "next/link";
import type { Metadata } from "next";
import { Logo } from "@/components/Logo";

// Covers login, register, forgot-password and reset-password at once —
// none of these have unique search-worthy content, and reset-password's
// URL carries a one-time token in its query string, so none of them
// should end up in search results. noindex still allows Google to crawl
// (see robots.ts, which intentionally does NOT block this route group) so
// it actually sees this tag rather than just finding a closed door. Added
// 21 October 2026 as part of the SEO pass.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

// The (auth) route group (login, register, forgot/reset password) had no
// shared layout at all before this — each page was a bare centred Card with
// zero branding. This wraps all of them with the logo, without touching the
// centring/Card markup already inside each page.
//
// The logo used to be `absolute left-6 top-6 z-10` — floating over the
// page rather than taking up space in it. Each page below centres its own
// Card vertically in a `min-h-screen` wrapper, so on a short mobile
// screen the top of that Card (register's "First name" field, in
// particular) could land directly underneath the floating, higher-z-index
// logo link — meaning a tap meant for the input hit the link instead and
// bounced to "/". Fixed 21 October 2026, per Scott: the logo now sits in
// normal document flow as a small header above `children` instead, so it
// physically pushes the page's own content down rather than ever
// overlapping it — the page may run slightly taller than one screen on
// mobile now (a bit of scroll), which is the correct trade-off for an
// input that's actually reachable.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="px-6 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-heading font-bold text-wcmt-navy"
        >
          <Logo variant="icon" priority className="h-10" />
        </Link>
      </div>
      {children}
    </div>
  );
}
