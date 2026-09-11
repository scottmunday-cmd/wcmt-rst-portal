import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/LogoutButton";

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Same gap fixed on the student side in 0008: this layout had no auth
  // or role check at all. The underlying tables are still RLS-protected
  // (is_instructor()/is_admin() in 0002), so no data was actually
  // exposed — but the page shell itself rendered for anyone, including a
  // logged-out visitor, which is a bad look and worth closing properly.
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single<{ role: string }>();

  if (profile?.role !== "instructor" && profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-wcmt-bg">
      <header className="border-b border-slate-200 bg-wcmt-navy text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" className="font-heading font-bold">
            WCMT — Instructor Portal
          </Link>
          <nav className="flex items-center gap-5 text-sm">
            <Link href="/instructor/students" className="hover:text-wcmt-coastal">
              Students
            </Link>
            <LogoutButton className="text-white hover:text-wcmt-coastal" />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
