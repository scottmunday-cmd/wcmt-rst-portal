import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet Scotty, West Coast Marine Training's primary trainer — a Marine Master with 25+ years' experience, training WA Recreational Skipper's Ticket students and BHP tug masters across the west coast.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-heading text-3xl font-bold text-wcmt-navy">About Us</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-700">
          <p>G&apos;day and welcome to West Coast Marine Training.</p>
          <p>
            We&apos;re based north of Perth, WA — primarily in Two Rocks — but run
            marine training and RST services anywhere from Hillarys right through
            to Port Hedland.
          </p>
          <p>
            Our primary trainer, Scotty, is a vastly experienced Marine Master,
            having operated various types of vessels up and down the West Coast
            of WA for over 25 years. He&apos;s also an experienced trainer and
            assessor — training tug masters on multimillion-dollar ASD tugs
            for BHP in the busy port of Port Hedland (when he isn&apos;t home
            offering recreational training).
          </p>
          <p>
            Our main training vessel is the Blue Bull, a 6.5m Ali Centercab
            walk-around in 2C restricted survey with a 150hp Yamaha. She&apos;s
            built like a tank, so she doesn&apos;t mind a few bumps along the
            way, but provides a nice, comfortable platform for learning —
            out of the weather if required.
          </p>
          <Image
            src="/about-blue-bull.jpg"
            alt="The Blue Bull, West Coast Marine Training's main training vessel"
            width={314}
            height={227}
            className="w-full max-w-md rounded-xl border border-slate-200 shadow-sm"
          />
          <p>
            Ready to get started? You can{" "}
            <Link href="/register" className="font-medium text-wcmt-coastal underline">
              enrol in the online course
            </Link>{" "}
            at your own pace, or check our{" "}
            <Link href="/faq" className="font-medium text-wcmt-coastal underline">
              frequently asked questions
            </Link>{" "}
            first.
          </p>
        </div>
      </div>
    </section>
  );
}
