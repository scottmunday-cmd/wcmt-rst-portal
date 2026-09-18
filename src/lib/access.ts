import type { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

/**
 * Whether this signed-in user has paid for something (or is staff, who
 * always pass). This is the UI-level mirror of the RLS gate added in
 * 0008_content_paywall.sql (has_paid_access()) — the database policies are
 * the real security boundary; this just means an unpaid visitor sees an
 * honest "you haven't bought this yet" screen instead of empty-looking
 * pages where the content silently failed to load.
 *
 * Moved here from (student)/layout.tsx on 18 September 2026. It used to
 * live in the layout and use a request header (forwarded by
 * src/middleware.ts) to exempt /assessment from the check — but that broke
 * for a student's very first click into /assessment after logging in.
 * Next.js's App Router keeps a shared layout's already-rendered output
 * around across client-side navigations between sibling routes under it,
 * and only guarantees a fresh render for the page segment actually being
 * navigated to — a layout is assumed to be stable UI shared by its
 * children, not something that re-renders differently depending on which
 * child page is showing. A student landing on /dashboard right after
 * signup (blocked, no paid order yet) would render this layout once with
 * hasAccess=false; clicking through to /assessment then reused that same
 * stale layout render instead of re-evaluating it with the new pathname,
 * so the block screen stuck around until a full page reload. Pages,
 * unlike layouts, always render fresh for the route being navigated to —
 * so each gated page now calls this itself. /assessment deliberately
 * never calls this — see (student)/assessment/page.tsx.
 */
export async function hasPaidAccess(
  supabase: SupabaseServerClient,
  userId: string
): Promise<boolean> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single<{ role: string }>();

  if (profile?.role === "admin" || profile?.role === "instructor") return true;

  const { data: paidOrder } = await supabase
    .from("orders")
    .select("id")
    .eq("profile_id", userId)
    .eq("status", "paid")
    .limit(1)
    .maybeSingle();

  return !!paidOrder;
}
