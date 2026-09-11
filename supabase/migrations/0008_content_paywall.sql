-- Fixes a real gap found during Scott's first live checkout test
-- (11 September 2026): modules, lessons, reference_articles and quiz
-- questions were readable by ANY authenticated user, paid or not — the
-- RLS policies from 0002 only checked `active = true`, with no link back
-- to whether that profile had actually bought anything. In practice this
-- meant creating a free account gave full access to everything WCMT
-- sells.
--
-- All three current products (Study Only, RST Assessment, Private
-- Tuition) include the online content — see the 0006 description text —
-- so "has paid" is intentionally *any* paid order at all, not tied to a
-- specific product slug.

create or replace function has_paid_access()
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from orders
    where profile_id = auth.uid() and status = 'paid'
  );
$$;

comment on function has_paid_access() is
  'True if the signed-in profile has at least one paid order. Every '
  'current product includes online content access, so this is not '
  'scoped to a specific product — revisit if a content-only-vs-not '
  'product split is ever introduced.';

-- Replaces the 0002 versions of these three policies: same active-rows
-- shape, now also requiring payment for a non-staff reader.
drop policy if exists "modules_read_active" on modules;
create policy "modules_read_active" on modules
  for select using ((active = true and has_paid_access()) or is_admin() or is_instructor());

drop policy if exists "lessons_read_active" on lessons;
create policy "lessons_read_active" on lessons
  for select using ((active = true and has_paid_access()) or is_admin() or is_instructor());

drop policy if exists "reference_articles_read_active" on reference_articles;
create policy "reference_articles_read_active" on reference_articles
  for select using ((active = true and has_paid_access()) or is_admin() or is_instructor());

-- questions_public (0002) is a view granted directly to `authenticated`,
-- bypassing the `questions` table's RLS entirely — it needs its own
-- paid check added to the view definition itself.
create or replace view questions_public as
  select id, module_id, question_text, answer_a, answer_b, answer_c, answer_d, difficulty
  from questions
  where active = true and has_paid_access();

-- grade_quiz_answer (0002) is SECURITY DEFINER and granted to
-- `authenticated` directly, same gap as the view above.
create or replace function grade_quiz_answer(p_question_id bigint, p_selected text)
returns boolean
language plpgsql
security definer
as $$
begin
  if not has_paid_access() then
    raise exception 'Payment required' using errcode = 'P0001';
  end if;
  return (select correct_answer = p_selected from questions where id = p_question_id);
end;
$$;
