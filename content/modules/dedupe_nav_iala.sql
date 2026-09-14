-- Removes duplicate lessons/questions in Module 4 (Navigation Lights) and
-- Module 5 (IALA Buoyage) caused by increment_nav_iala.sql being run more
-- than once. For every group of rows that are exact duplicates (same
-- module, same title/text and content), keeps only the earliest-inserted
-- copy (lowest id) and deletes the rest. Scoped ONLY to modules 4 and 5, so
-- nothing else in the database is touched. Safe to run more than once —
-- once there are no duplicates left, it deletes nothing.
do $$
begin
  -- Lessons
  with ranked as (
    select l.id,
           row_number() over (
             partition by l.module_id, l.title, l.content
             order by l.id
           ) as rn
    from lessons l
    join modules m on m.id = l.module_id
    where m.sort_order in (4, 5)
  )
  delete from lessons where id in (select id from ranked where rn > 1);

  -- Questions
  with ranked as (
    select q.id,
           row_number() over (
             partition by q.module_id, q.question_text, q.answer_a, q.answer_b, q.answer_c, q.answer_d
             order by q.id
           ) as rn
    from questions q
    join modules m on m.id = q.module_id
    where m.sort_order in (4, 5)
  )
  delete from questions where id in (select id from ranked where rn > 1);
end $$;

-- After running, the lessons in modules 4 and 5 should renumber back down to
-- their intended sort_order sequence with no repeats — re-run
-- check_nav_iala_duplicates.sql to confirm zero rows come back.
