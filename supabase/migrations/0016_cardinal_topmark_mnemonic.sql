-- Requested by Scott 24 September 2026, after a student had an exam
-- question trip them up on cardinal marks: the IALA Buoyage lesson
-- explained which way each cardinal mark's cones point, but never spelled
-- out the practical payoff — that the cones always point towards the
-- black colour band, so if a mark's topmark has been damaged, knocked
-- off, or removed, you can still identify it from the black band alone
-- (the band is painted on the body, so it survives far better than the
-- topmark). This appends that mnemonic as a new paragraph straight after
-- the existing "black cone-shaped topmarks follow a logical pattern..."
-- paragraph in the Cardinal marks lesson (module sort_order 5, lesson
-- sort_order 2). Uses replace() against the known end of that paragraph
-- so it only touches this one lesson and is safe to run once against the
-- live database; already applied directly via the Supabase SQL editor,
-- this file just keeps the migration history consistent with the rest of
-- supabase/migrations/.
update lessons
set content = replace(
  content,
  E'West has the cones pointing towards each other, black in the middle — picture an hourglass shape, pinched in the centre, and you''ve got West.',
  E'West has the cones pointing towards each other, black in the middle — picture an hourglass shape, pinched in the centre, and you''ve got West.\n\nHere''s a handy mnemonic: the black cone topmarks always point towards the black colour band, not away from it — North''s cones point up because black is at the top, South''s point down because black is at the bottom, East''s point away from each other because black is at both top and bottom, and West''s point towards each other because black is in the middle. The colour bands are painted onto the body of the mark, so they survive far better than the topmark itself — if a mark''s topmark has been damaged, knocked off, or removed for any reason, you can still work out which cardinal mark it is from the black band alone, using that same pattern.'
)
where module_id = (select id from modules where sort_order = 5)
  and sort_order = 2
  and content like E'%hourglass shape, pinched in the centre, and you''ve got West.%';
