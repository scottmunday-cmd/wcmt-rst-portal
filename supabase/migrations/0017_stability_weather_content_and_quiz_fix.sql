-- Requested by Scott 24 September 2026:
--   1. Safe Operations > Stability lesson (module sort_order 8, lesson
--      sort_order 2) didn't distinguish heel from trim, or say anything
--      about managing trim for conditions — particularly trimming the bow
--      up in a following sea to avoid a broach (the capsize lesson already
--      names "broaching in a following sea" as a cause, so this fills in
--      the how-to-avoid-it half).
--   2. Safe Operations > Weather lesson (module sort_order 8, lesson
--      sort_order 3) didn't explain the difference between sea and swell,
--      or what actually determines wave height (wind strength, how long
--      it's blown, and fetch/distance to a lee shore).
--   3. Question bank: "In the southern hemisphere, a low pressure system
--      rotates in which direction?" was marked with correct_answer = 'b'
--      (Anti-clockwise), which is wrong — lows rotate clockwise in the
--      southern hemisphere (highs anti-clockwise), exactly as the Weather
--      lesson itself already states. Scott caught this from a student's
--      practice quiz. Fixed to 'a' (Clockwise).
-- Both lesson updates use replace() against a known, unique end-of-paragraph
-- string so they only touch these two lessons; safe to run once against the
-- live database. Already applied directly via the Supabase SQL editor, this
-- file just keeps the migration history consistent with the rest of
-- supabase/migrations/.

update lessons
set content = replace(
  content,
  'though a very stiff vessel can also be an uncomfortable, jerky ride.',
  E'though a very stiff vessel can also be an uncomfortable, jerky ride.\n\nIt''s worth keeping heel and trim separate in your head: heel is how far the vessel leans side to side (port or starboard), while trim is its fore-and-aft angle — bow up or down relative to the stern. Unlike heel, trim is something you can actively manage as conditions change, mostly by shifting weight, passengers or gear, or adjusting trim tabs. Running in a following sea (waves coming from behind) is the trickiest case: a bow-down trim lets the bow dig into the back of the wave ahead of you and can set up a broach, so trim the bow up — move weight aft, ease off the trim tabs — to keep the bow riding up and over each wave instead of ploughing into it.'
)
where module_id = (select id from modules where sort_order = 8)
  and sort_order = 2
  and content like '%though a very stiff vessel can also be an uncomfortable, jerky ride.%';

update lessons
set content = replace(
  content,
  'no vessel should be at sea within several hundred nautical miles of a cyclone.',
  E'no vessel should be at sea within several hundred nautical miles of a cyclone.\n\nIt''s worth knowing the difference between sea and swell. Sea (or wind waves) is chop being generated right where you are by the local wind — usually short, steep and a bit messy. Swell is waves generated somewhere else, sometimes a long way off and sometimes days earlier, that keep travelling on after the wind that made them has eased or moved away — usually longer, more rounded and more regular than sea, and you can have real swell running through with hardly any wind where you are. Wave height mostly comes down to three things: how strong the wind is, how long it''s been blowing for, and the fetch — the distance of open water it''s had to blow across. A strong wind over a long fetch, blowing for a long time, builds far bigger waves than the same wind over a short one, which is also why conditions build as you approach a lee shore (the shore the wind is blowing onto) — that''s where the fetch, and the wave-building, has had the most distance to work with.'
)
where module_id = (select id from modules where sort_order = 8)
  and sort_order = 3
  and content like '%no vessel should be at sea within several hundred nautical miles of a cyclone.%';

update questions
set correct_answer = 'a'
where module_id = (select id from modules where sort_order = 8)
  and question_text = 'In the southern hemisphere, a low pressure system rotates in which direction?'
  and correct_answer = 'b';
