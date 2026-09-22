-- Closes the gap noted in 0014_readiness_score_calculation.sql: "Practical
-- Preparation" (10% of the readiness formula) had no trackable signal, so
-- it was hardcoded to 0 — capping every student's online-trackable score
-- at 90%. Requested by Scott 22 September 2026: treat opening the
-- Practical Assessment module (sort_order 10 — overview lessons only, no
-- quiz, "assessed on-water" per content/modules/build_content.py) as that
-- signal. src/app/(student)/modules/[moduleId]/page.tsx now marks that
-- specific module "viewed" (a student_progress upsert) the moment its page
-- loads, since it has no quiz completion to hook into otherwise — see that
-- file's comment on PRACTICAL_ASSESSMENT_SORT_ORDER for the full story.
--
-- This also incidentally fixes the module-completion 40% slice for the
-- same module: previously a student could never get a "completed" row for
-- it at all (ModuleQuiz.tsx only writes student_progress from
-- saveProgress(), which returns early when there are zero questions), so
-- module completion could never reach 100% either, even ignoring practical
-- prep entirely.
--
-- Run after 0001-0014 (0014 must have already created
-- fn_calculate_readiness_score and its triggers).

create or replace function fn_calculate_readiness_score(p_student_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_active_modules integer;
  v_completed_modules integer;
  v_module_completion_percent numeric;
  v_avg_quiz_score numeric;
  v_avg_mock_exam_score numeric;
  v_practical_preparation_percent numeric;
  v_score integer;
begin
  select count(*) into v_active_modules from modules where active = true;

  select count(*) into v_completed_modules
  from student_progress sp
  join modules m on m.id = sp.module_id and m.active = true
  where sp.student_id = p_student_id and sp.completed = true;

  v_module_completion_percent := case when v_active_modules > 0
    then (v_completed_modules::numeric / v_active_modules) * 100
    else 0 end;

  select coalesce(avg(quiz_score), 0) into v_avg_quiz_score
  from student_progress
  where student_id = p_student_id and quiz_score is not null;

  select coalesce(avg(score), 0) into v_avg_mock_exam_score
  from mock_exams
  where student_id = p_student_id;

  -- 100 if the student has an (auto-marked) completed row for the
  -- Practical Assessment module, else 0 — see the migration comment above.
  select case when exists (
    select 1
    from student_progress sp
    join modules m on m.id = sp.module_id
    where sp.student_id = p_student_id
      and m.sort_order = 10
      and sp.completed = true
  ) then 100 else 0 end into v_practical_preparation_percent;

  v_score := round(
    v_module_completion_percent * 0.4 +
    v_avg_quiz_score * 0.3 +
    v_avg_mock_exam_score * 0.2 +
    v_practical_preparation_percent * 0.1
  );
  v_score := greatest(0, least(100, v_score));

  update students set readiness_score = v_score where id = p_student_id;

  return v_score;
end;
$$;

-- Recalculate everyone now — anyone who's already opened the Practical
-- Assessment module before this migration ran gets credit for it
-- immediately, not just from their next visit.
do $$
declare
  r record;
begin
  for r in select id from students loop
    perform fn_calculate_readiness_score(r.id);
  end loop;
end $$;
