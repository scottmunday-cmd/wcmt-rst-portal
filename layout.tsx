import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { ComplianceFooter } from "@/components/ComplianceFooter";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-heading text-lg font-bold text-wcmt-navy">
            West Coast Marine Training
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-wcmt-navy md:flex">
            <Link href="/#how-it-works">How It Works</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/login">Log In</Link>
          </nav>
          <ButtonLink href="/register" variant="primary" className="md:ml-4">
            Start Learning
          </ButtonLink>
        </div>
        <div className="bg-wcmt-bg px-6 py-1 text-center">
          <ComplianceFooter />
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-center">
          <p className="font-heading font-semibold text-wcmt-navy">
            West Coast Marine Training
          </p>
          <ComplianceFooter />
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} West Coast Marine Training. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
