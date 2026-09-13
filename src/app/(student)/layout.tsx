import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { LogoutButton } from "@/components/LogoutButton";
import { Logo } from "@/components/Logo";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/modules", label: "Modules" },
  { href: "/assessment", label: "Assessment" },
  { href: "/reference", label: "Reference Library" },
  { href: "/bookmarks", label: "Bookmarks" },
];

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) redirect("/login");

  // This is the UI-level mirror of the RLS gate added in
  // 0008_content_paywall.sql (has_paid_access()) — a signed-up-but-unpaid
  // account previously landed here and every page underneath rendered
  // fine, because nothing anywhere actually checked payment status.
  // The database policies are the real security boundary; this check
  // just means an unpaid visitor sees an honest "you haven't bought
  // this yet" screen instead of empty-looking pages where the content
  // silently failed to load.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single<{ role: string }>();

  const isStaff = profile?.role === "admin" || profile?.role === "instructor";

  let hasAccess = isStaff;
  if (!hasAccess) {
    const { data: paidOrder } = await supabase
      .from("orders")
      .select("id")
      .eq("profile_id", userData.user.id)
      .eq("status", "paid")
      .limit(1)
      .maybeSingle();
    hasAccess = !!paidOrder;
  }

  if (!hasAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-wcmt-bg px-6">
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

  return (
    <div className="min-h-screen bg-wcmt-bg">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2 font-heading font-bold text-wcmt-navy">
            <Logo variant="icon" className="h-9" />
            <span>West Coast Marine Training</span>
          </Link>
          <nav className="flex items-center gap-5 text-sm font-medium text-wcmt-navy">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-wcmt-orange">
                {item.label}
              </Link>
            ))}
            {/*
              Found 12 September 2026: Scott's account was promoted to
              admin directly in the database, but this nav never had a
              link into the Admin/Instructor portals for any role — so a
              staff account logging in here saw exactly the same student
              nav as before, with no way to discover /admin or
              /instructor short of typing the URL directly. isStaff
              (defined above, already used to bypass the paywall screen)
              is the same check; this just makes staff-only access
              visible instead of hidden.
            */}
            {profile?.role === "admin" && (
              <Link href="/admin/products" className="hover:text-wcmt-orange">
                Admin Portal
              </Link>
            )}
            {isStaff && (
              <Link href="/instructor/schedule" className="hover:text-wcmt-orange">
                Instructor Portal
              </Link>
            )}
            <LogoutButton className="text-wcmt-navy hover:text-wcmt-orange" />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
