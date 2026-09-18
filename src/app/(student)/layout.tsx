import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/LogoutButton";
import { Logo } from "@/components/Logo";
import { MobileNav } from "@/components/MobileNav";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/welcome", label: "How it Works" },
  { href: "/modules", label: "Modules" },
  { href: "/assessment", label: "Assessment" },
  { href: "/reference", label: "Reference Library" },
  { href: "/bookmarks", label: "Bookmarks" },
  { href: "/settings", label: "Settings" },
];

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) redirect("/login");

  // This layout only checks that someone is signed in and renders the
  // shared header/nav — it no longer decides which pages are blocked for
  // an unpaid account. That check (hasPaidAccess, src/lib/access.ts) moved
  // to each gated page itself on 18 September 2026, after a bug where a
  // student's first click into /assessment right after signing up could
  // still show the block screen. See the comment on hasPaidAccess() for
  // the full reason — short version: this layout is shared by all routes
  // under it, and Next.js's client-side router doesn't guarantee it
  // re-renders on every navigation between sibling pages the way each
  // page itself does, so it can't reliably vary its output by pathname.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single<{ role: string }>();

  const isStaff = profile?.role === "admin" || profile?.role === "instructor";

  const isAdmin = profile?.role === "admin";

  return (
    <div className="min-h-screen bg-wcmt-bg">
      {/*
        `relative` here anchors MobileNav's dropdown (`absolute inset-x-0
        top-full`) directly under the header instead of under the page body.
      */}
      <header className="relative border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2 font-heading font-bold text-wcmt-navy">
            <Logo variant="icon" className="h-9" />
            <span>West Coast Marine Training</span>
          </Link>
          {/*
            Found 18 September 2026: once installed to a phone's home
            screen, this row of 7 links plus Log Out (and sometimes Admin/
            Instructor Portal) had no way to wrap or shrink — it just ran
            off the right edge of the screen. This full inline nav is now
            desktop-only (`md:flex`, hidden below that); MobileNav (a
            hamburger + dropdown) takes over on phone-width screens.
          */}
          <nav className="hidden items-center gap-5 text-sm font-medium text-wcmt-navy md:flex">
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
              (defined above, the same check hasPaidAccess() uses to let
              staff bypass the paywall) is reused here to make staff-only
              access visible instead of hidden.
            */}
            {isAdmin && (
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
          <MobileNav nav={NAV} isAdmin={isAdmin} isStaff={isStaff} />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
