import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

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
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${montserrat.variable} font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
