-- Read-only check: confirms which of the content-update scripts have been
-- run against this database. Safe to run any number of times — it only
-- SELECTs, it never writes anything.
with checks as (
  select 1 as ord, 'import.sql — base module/lesson/question import' as script,
    (select count(*) from modules) >= 11 as applied
  union all
  select 2, 'increment_nav_iala.sql — extra Nav Lights / IALA rows',
    exists(select 1 from lessons where content ilike '%Reading light rhythms%')
  union all
  select 3, 'increment_quizbank_v3.sql — extra practice-exam question bank',
    exists(select 1 from questions where answer_b ilike '%Continue on your way unless directly asked for help%')
  union all
  select 4, 'update_mnemonics.sql — nautical mnemonics added to lessons',
    exists(select 1 from lessons where content ilike '%hourglass%')
  union all
  select 5, 'module1_age_rules_update.sql — 17 / 14 / 18 age rules',
    exists(select 1 from lessons where content ilike '%you must be at least 17%')
  union all
  select 6, 'exam_alignment_update.sql — Module 2/7 exam-alignment pass',
    exists(select 1 from lessons where title ilike '%Water skiing rules%')
  union all
  select 7, 'module1_practical_update.sql — practical-attempt reword',
    exists(select 1 from lessons where content ilike '%this is the easy part%')
)
select
  script,
  case when applied then '✅ applied' else '❌ MISSING — needs to be run' end as status
from checks
order by ord;

-- Optional sanity check on totals (run separately) — expect 33 lessons, 114 questions
-- once every script above has been applied:
-- select (select count(*) from lessons) as lesson_count, (select count(*) from questions) as question_count;
