-- Read-only: shows exactly how many duplicate copies exist of each lesson/
-- question in Module 4 (Navigation Lights) and Module 5 (IALA Buoyage),
-- caused by increment_nav_iala.sql being run more than once. Safe to run
-- any number of times — it only SELECTs.
select 'lesson' as kind, m.sort_order as module_sort_order, l.title, count(*) as copies
from lessons l
join modules m on m.id = l.module_id
where m.sort_order in (4, 5)
group by m.sort_order, l.title
having count(*) > 1
union all
select 'question', m.sort_order, q.question_text, count(*)
from questions q
join modules m on m.id = q.module_id
where m.sort_order in (4, 5)
group by m.sort_order, q.question_text
having count(*) > 1
order by 1, 2;
