import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { LogoutButton } from "@/components/LogoutButton";

/**
 * Shown in place of a gated page's own content when hasPaidAccess() is
 * false (see src/lib/access.ts for why this check lives per-page rather
 * than in (student)/layout.tsx). Renders inside the normal student header
 * and nav now, rather than replacing the whole screen the way the old
 * layout-level version did — a small, deliberate visual change: it means a
 * blocked student can still see and use the nav to get back to Courses.
 */
export function PaywallGate() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <Card className="max-w-md text-center">
        <h1 className="font-heading text-xl font-bold text-wcmt-navy">
          You haven&apos;t purchased a course yet
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Your account is set up, but modules, the reference library and
          assessment booking only unlock once you&apos;ve bought Study
          Only, RST Assessment, or Private Tuition.
        </p>
        <ButtonLink href="/#pricing" variant="primary" className="mt-6">
          View Courses
        </ButtonLink>
        <p className="mt-4 text-xs text-slate-400">
          Already paid and seeing this by mistake?{" "}
          <Link href="/faq" className="underline">
            Get in touch
          </Link>
          . Testing with the wrong account?{" "}
          <LogoutButton className="text-wcmt-orange underline" /> and log
          back in with the right one.
        </p>
      </Card>
    </div>
  );
}
