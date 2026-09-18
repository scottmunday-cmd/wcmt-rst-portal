"use client";

import { useState } from "react";
import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";

type NavItem = { href: string; label: string };

// Found 18 September 2026: once the site was installed as a home-screen
// app, the student header's nav — Dashboard / How it Works / Modules /
// Assessment / Reference Library / Bookmarks / Settings, plus Log Out and
// sometimes Admin/Instructor Portal — had nowhere to go on a phone-width
// screen. It just kept laying out in one row, running the last couple of
// links off the right edge of the screen past the logo/title. The header
// in (student)/layout.tsx now only renders that full row from the `md`
// breakpoint up; below that, this component takes over: a single hamburger
// button that opens a simple dropdown list of the same links.
export function MobileNav({
  nav,
  isAdmin,
  isStaff,
}: {
  nav: NavItem[];
  isAdmin: boolean;
  isStaff: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-md text-wcmt-navy"
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-20 border-b border-slate-200 bg-white px-6 py-4 shadow-md">
          <nav className="flex flex-col gap-4 text-sm font-medium text-wcmt-navy">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="hover:text-wcmt-orange"
              >
                {item.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin/products"
                onClick={() => setOpen(false)}
                className="hover:text-wcmt-orange"
              >
                Admin Portal
              </Link>
            )}
            {isStaff && (
              <Link
                href="/instructor/schedule"
                onClick={() => setOpen(false)}
                className="hover:text-wcmt-orange"
              >
                Instructor Portal
              </Link>
            )}
            <LogoutButton className="text-left text-wcmt-navy hover:text-wcmt-orange" />
          </nav>
        </div>
      )}
    </div>
  );
}
