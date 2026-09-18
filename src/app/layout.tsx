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

export const metadata: Metadata = {
  title: "West Coast Marine Training | RST Student Portal",
  description:
    "Learn Online. Boat Safely. Pass With Confidence. WA Recreational Skipper's Ticket training, assessment booking, and lifetime reference library.",
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
