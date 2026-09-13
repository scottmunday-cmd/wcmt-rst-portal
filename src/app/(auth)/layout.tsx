import Link from "next/link";
import { Logo } from "@/components/Logo";

// The (auth) route group (login, register, forgot/reset password) had no
// shared layout at all before this — each page was a bare centred Card with
// zero branding. This wraps all of them with the logo, without touching the
// centring/Card markup already inside each page.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <Link
        href="/"
        className="absolute left-6 top-6 z-10 flex items-center gap-2 font-heading font-bold text-wcmt-navy"
      >
        <Logo variant="icon" priority className="h-10" />
      </Link>
      {children}
    </div>
  );
}
