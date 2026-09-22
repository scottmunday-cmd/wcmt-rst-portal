-- Fixes a real bug found by Scott 22 September 2026: students.readiness_score
-- has sat at its default of 0 for every student since launch. The formula
-- for it (Module Completion 40% + Quiz Scores 30% + Mock Exams 20% +
-- Practical Preparation 10%) was written down in src/lib/readiness.ts, but
-- nothing ever actually called it or wrote the result back to the
-- students table — student_progress and mock_exams have been filling up
-- with real study activity the whole time (confirmed live: Jack Gibbings
-- has 9 student_progress rows and 3 mock_exams rows), completely
-- disconnected from the 0% shown on his dashboard and the Instructor
-- Portal's Students/Schedule pages.
--
-- This migration makes the database itself keep readiness_score correct,
-- via a trigger, rather than relying on every place that writes
-- student_progress/mock_exams (currently ModuleQuiz.tsx, MockExamQuiz.tsx,
-- PracticeExams.tsx — future ones too) to remember to recalculate it.
--
-- One honest gap: "Practical Preparation" (10% of the formula) has no
-- trackable signal anywhere in this schema — there's no on-water/practical
-- checklist, just the in-person assessment itself (see the "What this
-- portal certifies" note in README.md). Rather than invent one, this
-- treats it as 0 for now, same as calculateReadinessScore() already did
-- with no caller supplying it — which caps the online-trackable score at
-- 90%, not 100%. If Scott wants a real practical-prep signal later (e.g.
-- an instructor checkbox), this function is the one place to update.
--
-- Run after 0001-0013.

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
  v_practical_preparation_percent numeric := 0; -- no trackable signal yet — see migration comment
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

create or replace function fn_refresh_readiness_on_progress()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform fn_calculate_readiness_score(coalesce(new.student_id, old.student_id));
  return coalesce(new, old);
end;
$$;

drop trigger if exists trg_readiness_on_progress on student_progress;
create trigger trg_readiness_on_progress
after insert or update or delete on student_progress
for each row execute function fn_refresh_readiness_on_progress();

drop trigger if exists trg_readiness_on_mock_exam on mock_exams;
create trigger trg_readiness_on_mock_exam
after insert or update or delete on mock_exams
for each row execute function fn_refresh_readiness_on_progress();

-- Backfill: recalculate every existing student now, so this fixes what's
-- already stuck at 0 (Jack Gibbings included) the moment this migration
-- runs, not just future activity.
do $$
declare
  r record;
begin
  for r in select id from students loop
    perform fn_calculate_readiness_score(r.id);
  end loop;
end $$;
