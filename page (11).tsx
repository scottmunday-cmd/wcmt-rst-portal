import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import type { Module } from "@/types/database";

export default async function ModulesPage() {
  const supabase = await createClient();
  let modules: Module[] = [];
  let loadError: string | null = null;

  try {
    const { data, error } = await supabase
      .from("modules")
      .select("*")
      .eq("active", true)
      .order("sort_order");
    if (error) throw error;
    modules = data ?? [];
  } catch {
    loadError = "Modules haven't been loaded into the database yet.";
  }

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold text-wcmt-navy">Learning Modules</h1>
      {loadError && (
        <Card className="border-amber-300 bg-amber-50 text-sm text-amber-800">{loadError}</Card>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {modules.map((module) => (
          <Link key={module.id} href={`/modules/${module.id}`}>
            <Card className="hover:border-wcmt-coastal">
              <p className="text-xs font-semibold uppercase text-wcmt-coastal">
                Module {module.sort_order}
              </p>
              <h2 className="mt-1 font-heading font-semibold text-wcmt-navy">{module.title}</h2>
              {module.description && (
                <p className="mt-1 text-sm text-slate-600">{module.description}</p>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
