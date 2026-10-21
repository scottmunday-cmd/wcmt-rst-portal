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
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <Link
        href="/"
        className="absolute left-6 top-6 z-10 flex items-center gap-2 font-heading font-bold text-wcmt-navy"
      >
        <Logo variant="icon" priority className="h-10" />
      </Link>
      {children}
    </div>
  );
}
