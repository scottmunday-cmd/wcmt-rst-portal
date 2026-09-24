-- Fixes a slip from 0017: Scott ran that migration's SQL twice in the
-- Supabase SQL editor (the second run matched the same anchor text again,
-- since the appended paragraph itself starts with that anchor), which
-- duplicated the new paragraph in both the Stability and Weather lessons
-- (module sort_order 8, lesson sort_order 2 and 3). Also folds in a wording
-- tweak Scott asked for at the same time: the Stability paragraph's list of
-- ways to manage trim now explicitly calls out adjusting outboard trim,
-- alongside shifting weight/passengers/gear and trim tabs.
-- Both statements below match the exact doubled text (two back-to-back
-- copies of the paragraph) and collapse it to one corrected copy, so this
-- is safe to run once against a database left in that doubled state by the
-- same mistake; already applied directly via the Supabase SQL editor, this
-- file just keeps the migration history consistent with the rest of
-- supabase/migrations/.

update lessons
set content = replace(
  content,
  E'It''s worth keeping heel and trim separate in your head: heel is how far the vessel leans side to side (port or starboard), while trim is its fore-and-aft angle — bow up or down relative to the stern. Unlike heel, trim is something you can actively manage as conditions change, mostly by shifting weight, passengers or gear, or adjusting trim tabs. Running in a following sea (waves coming from behind) is the trickiest case: a bow-down trim lets the bow dig into the back of the wave ahead of you and can set up a broach, so trim the bow up — move weight aft, ease off the trim tabs — to keep the bow riding up and over each wave instead of ploughing into it.\n\nIt''s worth keeping heel and trim separate in your head: heel is how far the vessel leans side to side (port or starboard), while trim is its fore-and-aft angle — bow up or down relative to the stern. Unlike heel, trim is something you can actively manage as conditions change, mostly by shifting weight, passengers or gear, or adjusting trim tabs. Running in a following sea (waves coming from behind) is the trickiest case: a bow-down trim lets the bow dig into the back of the wave ahead of you and can set up a broach, so trim the bow up — move weight aft, ease off the trim tabs — to keep the bow riding up and over each wave instead of ploughing into it.',
  E'It''s worth keeping heel and trim separate in your head: heel is how far the vessel leans side to side (port or starboard), while trim is its fore-and-aft angle — bow up or down relative to the stern. Unlike heel, trim is something you can actively manage as conditions change, mostly by shifting weight, passengers or gear, adjusting your outboard trim or adjusting trim tabs. Running in a following sea (waves coming from behind) is the trickiest case: a bow-down trim lets the bow dig into the back of the wave ahead of you and can set up a broach, so trim the bow up — move weight aft, ease off the trim tabs — to keep the bow riding up and over each wave instead of ploughing into it.'
)
where module_id = (select id from modules where sort_order = 8)
  and sort_order = 2
  and content like E'%It''s worth keeping heel and trim separate in your head: hee%It''s worth keeping heel and trim separate in your head: hee%';

update lessons
set content = replace(
  content,
  E'It''s worth knowing the difference between sea and swell. Sea (or wind waves) is chop being generated right where you are by the local wind — usually short, steep and a bit messy. Swell is waves generated somewhere else, sometimes a long way off and sometimes days earlier, that keep travelling on after the wind that made them has eased or moved away — usually longer, more rounded and more regular than sea, and you can have real swell running through with hardly any wind where you are. Wave height mostly comes down to three things: how strong the wind is, how long it''s been blowing for, and the fetch — the distance of open water it''s had to blow across. A strong wind over a long fetch, blowing for a long time, builds far bigger waves than the same wind over a short one, which is also why conditions build as you approach a lee shore (the shore the wind is blowing onto) — that''s where the fetch, and the wave-building, has had the most distance to work with.\n\nIt''s worth knowing the difference between sea and swell. Sea (or wind waves) is chop being generated right where you are by the local wind — usually short, steep and a bit messy. Swell is waves generated somewhere else, sometimes a long way off and sometimes days earlier, that keep travelling on after the wind that made them has eased or moved away — usually longer, more rounded and more regular than sea, and you can have real swell running through with hardly any wind where you are. Wave height mostly comes down to three things: how strong the wind is, how long it''s been blowing for, and the fetch — the distance of open water it''s had to blow across. A strong wind over a long fetch, blowing for a long time, builds far bigger waves than the same wind over a short one, which is also why conditions build as you approach a lee shore (the shore the wind is blowing onto) — that''s where the fetch, and the wave-building, has had the most distance to work with.',
  E'It''s worth knowing the difference between sea and swell. Sea (or wind waves) is chop being generated right where you are by the local wind — usually short, steep and a bit messy. Swell is waves generated somewhere else, sometimes a long way off and sometimes days earlier, that keep travelling on after the wind that made them has eased or moved away — usually longer, more rounded and more regular than sea, and you can have real swell running through with hardly any wind where you are. Wave height mostly comes down to three things: how strong the wind is, how long it''s been blowing for, and the fetch — the distance of open water it''s had to blow across. A strong wind over a long fetch, blowing for a long time, builds far bigger waves than the same wind over a short one, which is also why conditions build as you approach a lee shore (the shore the wind is blowing onto) — that''s where the fetch, and the wave-building, has had the most distance to work with.'
)
where module_id = (select id from modules where sort_order = 8)
  and sort_order = 3
  and content like E'%It''s worth knowing the difference between sea and swell. Se%It''s worth knowing the difference between sea and swell. Se%';
