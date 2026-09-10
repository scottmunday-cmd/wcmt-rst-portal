import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";

export default async function BookmarksPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) redirect("/login");

  let bookmarks: { article_id: number; reference_articles: { title: string } | null }[] = [];
  let loadError: string | null = null;

  try {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("article_id, reference_articles(title)")
      .eq("profile_id", userData.user.id)
      // Without generated Database types wired into createClient() (see the
      // note at the top of src/types/database.ts), supabase-js can't tell
      // this is a many-to-one join and infers reference_articles as an
      // array — it's actually a single object (or null) at runtime, since
      // bookmarks.article_id has one matching reference_articles row.
      // .returns() asserts the real shape instead of the guessed one.
      .returns<{ article_id: number; reference_articles: { title: string } | null }[]>();
    if (error) throw error;
    bookmarks = data ?? [];
  } catch {
    loadError = "Couldn't load bookmarks yet.";
  }

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold text-wcmt-navy">My Bookmarks</h1>
      {loadError && (
        <Card className="border-amber-300 bg-amber-50 text-sm text-amber-800">{loadError}</Card>
      )}
      {!loadError && bookmarks.length === 0 && (
        <p className="text-sm text-slate-500">
          Nothing bookmarked yet — save lessons and reference pages as you go.
        </p>
      )}
      <div className="grid gap-2 sm:grid-cols-2">
        {bookmarks.map((b) => (
          <Card key={b.article_id} className="text-sm">
            {b.reference_articles?.title ?? `Article #${b.article_id}`}
          </Card>
        ))}
      </div>
    </div>
  );
}
