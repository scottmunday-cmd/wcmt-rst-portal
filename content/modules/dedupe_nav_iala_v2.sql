-- Follow-up cleanup: after dedupe_nav_iala.sql removed exact-duplicate rows,
-- one "flattened" copy of a couple of Module 4/5 lessons remained — a copy
-- where the paragraph breaks (blank lines) got collapsed into one run-on
-- paragraph, so it wasn't byte-identical to the correctly formatted copy and
-- survived the first cleanup. This removes only the flattened copy, and
-- only in a (module, title) group that still has a correctly formatted
-- sibling to keep — so it can never delete the last remaining copy of a
-- lesson, and never touches anything outside Modules 4 and 5. Safe to run
-- more than once.
with grouped as (
  select
    l.id,
    l.module_id,
    l.title,
    (position(chr(10) || chr(10) in l.content) > 0) as has_paragraph_breaks,
    count(*) over (partition by l.module_id, l.title) as total_copies,
    sum(case when position(chr(10) || chr(10) in l.content) > 0 then 1 else 0 end)
      over (partition by l.module_id, l.title) as well_formatted_copies
  from lessons l
  join modules m on m.id = l.module_id
  where m.sort_order in (4, 5)
)
delete from lessons
where id in (
  select id from grouped
  where total_copies > 1
    and well_formatted_copies >= 1
    and not has_paragraph_breaks
);

-- Re-check afterwards:
-- select m.sort_order, l.title, count(*) from lessons l join modules m on m.id = l.module_id
-- where m.sort_order in (4,5) group by 1,2 having count(*) > 1;
