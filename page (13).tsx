import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import type { ReferenceArticle } from "@/types/database";

export default async function ReferenceLibraryPage() {
  const supabase = await createClient();
  let articles: ReferenceArticle[] = [];
  let loadError: string | null = null;

  try {
    const { data, error } = await supabase
      .from("reference_articles")
      .select("*")
      .eq("active", true)
      .order("category");
    if (error) throw error;
    articles = data ?? [];
  } catch {
    loadError = "The reference library hasn't been populated yet.";
  }

  const byCategory = articles.reduce<Record<string, ReferenceArticle[]>>((acc, article) => {
    (acc[article.category] ??= []).push(article);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold text-wcmt-navy">Reference Library</h1>
      <p className="text-sm text-slate-600">Lifetime access after course completion.</p>
      {loadError && (
        <Card className="border-amber-300 bg-amber-50 text-sm text-amber-800">{loadError}</Card>
      )}
      {Object.entries(byCategory).map(([category, items]) => (
        <div key={category}>
          <h2 className="font-heading font-semibold text-wcmt-navy">{category}</h2>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {items.map((article) => (
              <Card key={article.id} className="text-sm">{article.title}</Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
