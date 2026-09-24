-- Requested by Scott 24 September 2026: trim the Weather lesson's wave
-- height paragraph (module sort_order 8, lesson sort_order 3, added in
-- 0017) — end the sentence at "...over a short one." with a full stop, and
-- drop the trailing lee-shore clause entirely rather than keeping it as a
-- separate sentence.
-- Uses replace() against the exact trailing clause, so it only touches
-- this one lesson and is safe to run once; already applied directly via
-- the Supabase SQL editor, this file just keeps the migration history
-- consistent with the rest of supabase/migrations/.
update lessons
set content = replace(
  content,
  E', which is also why conditions build as you approach a lee shore (the shore the wind is blowing onto) — that''s where the fetch, and the wave-building, has had the most distance to work with.',
  '.'
)
where module_id = (select id from modules where sort_order = 8)
  and sort_order = 3
  and content like '%, which is also why conditions build as you approach a lee shore%';
