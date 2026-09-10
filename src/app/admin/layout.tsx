import Link from "next/link";

const NAV = [
  { href: "/admin/products", label: "Products" },
  { href: "/admin/bookings", label: "Bookings" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-wcmt-bg">
      <header className="border-b border-slate-200 bg-wcmt-navy text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <span className="font-heading font-bold">WCMT — Admin</span>
          <nav className="flex gap-5 text-sm">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-wcmt-coastal">
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
