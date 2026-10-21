import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { AuthRefresher } from "@/components/AuthRefresher";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

// SEO pass, 21 October 2026. metadataBase lets every relative URL used
// below (icons, openGraph.images, alternates.canonical on individual
// pages) resolve against the real domain instead of localhost — without
// it, Next warns at build time and social previews can break.
const SITE_URL = "https://www.westcoastmarinetraining.com.au";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // `template` lets every page set just its own title (e.g. "About Us")
  // and have "| West Coast Marine Training" appended automatically —
  // `default` is what's used on pages (like this root layout on its own)
  // that don't set a title at all.
  title: {
    default: "West Coast Marine Training | WA Recreational Skipper's Ticket (RST) Online Course",
    template: "%s | West Coast Marine Training",
  },
  description:
    "Get your WA Recreational Skipper's Ticket online with West Coast Marine Training. Self-paced theory, practical assessment booking, and lifetime reference access — serving Two Rocks, Perth's northern suburbs and the WA coast up to Port Hedland.",
  // manifest.ts (Next's file-convention manifest) covers Android/Chrome
  // install; iOS Safari doesn't read icons from the manifest for "Add to
  // Home Screen", it wants this instead. appleWebApp makes the installed
  // icon open full-screen (no Safari chrome) rather than as a bookmark.
  icons: { apple: "/apple-touch-icon.png" },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "WCMT",
  },
  // Open Graph / Twitter — the actual preview image comes from
  // opengraph-image.tsx (Next's file-convention OG image route), which
  // wires up og:image automatically; Next falls back to these same
  // openGraph values for Twitter's card when `twitter.images` isn't set,
  // so there's no need to duplicate the image reference here.
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: SITE_URL,
    siteName: "West Coast Marine Training",
    title: "West Coast Marine Training | WA Recreational Skipper's Ticket (RST) Online Course",
    description:
      "Get your WA Recreational Skipper's Ticket online. Self-paced theory, practical assessment booking, and lifetime reference access.",
  },
  twitter: {
    card: "summary_large_image",
    title: "West Coast Marine Training | WA Recreational Skipper's Ticket (RST) Online Course",
    description:
      "Get your WA Recreational Skipper's Ticket online. Self-paced theory, practical assessment booking, and lifetime reference access.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B2545", // wcmt-navy — colors the mobile browser/OS chrome
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${montserrat.variable} font-body antialiased`}
      >
        <AuthRefresher />
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
