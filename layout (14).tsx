import Link from "next/link";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/modules", label: "Modules" },
  { href: "/assessment", label: "Assessment" },
  { href: "/reference", label: "Reference Library" },
  { href: "/bookmarks", label: "Bookmarks" },
];

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-wcmt-bg">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/dashboard" className="font-heading font-bold text-wcmt-navy">
            West Coast Marine Training
          </Link>
          <nav className="flex gap-5 text-sm font-medium text-wcmt-navy">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-wcmt-orange">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
