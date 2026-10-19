-- Requested by Scott 19 October 2026: the paragraph-break changes made in
-- 0020_paragraph_breaks_readability.sql "haven't come out as I hoped" --
-- revert all 17 of them back to the original run-on text. Scott plans to
-- give individual, more specific change requests instead of a batch one.
-- Each statement below is the exact reverse of the matching statement in
-- 0020 (old/new swapped), matched by lesson title and the split text, so
-- it's safe to run once. Already applied directly via the Supabase SQL
-- editor on the wcmt-rst-staging project; this file just keeps the
-- migration history consistent with the rest of supabase/migrations/.
--
-- NOTE for Scott: this still leaves the "Theory and practical" lesson's
-- "there's no need to study too hard" / "our expert trainers" wording
-- exactly as it was -- flagged in 0020's note and still unaddressed.

update lessons set content = replace(
  content,
  E'so six or fewer mistakes.\n\nYou get one practical attempt on the day,',
  E'so six or fewer mistakes. You get one practical attempt on the day,'
) where title = 'Theory and practical: what the assessment actually covers' and content like '%so six or fewer mistakes.' || chr(10) || chr(10) || 'You get%';

update lessons set content = replace(
  content,
  E'signed by a parent or guardian.\n\nYou''ll also need to prove your identity',
  E'signed by a parent or guardian. You''ll also need to prove your identity'
) where title = 'Getting ready for assessment day' and content like '%signed by a parent or guardian.' || chr(10) || chr(10) || 'You''ll also%';

update lessons set content = replace(
  content,
  E'comparing prices between authorised providers.\n\nIf you already hold a recognised interstate',
  E'comparing prices between authorised providers. If you already hold a recognised interstate'
) where title = 'Getting ready for assessment day' and content like '%comparing prices between authorised providers.' || chr(10) || chr(10) || 'If%';

update lessons set content = replace(
  content,
  E'even where there seems to be plenty of room.\n\nStay within the hull of your vessel while underway too — no perching on the bow or gunwales.\n\nMarine animals and their habitat get specific protection:',
  E'even where there seems to be plenty of room. Stay within the hull of your vessel while underway too — no perching on the bow or gunwales. Marine animals and their habitat get specific protection:'
) where title = 'Speed limits and staying clear of others' and content like '%even where there seems to be plenty of room.' || chr(10) || chr(10) || 'Stay%';

update lessons set content = replace(
  content,
  E'wearing an approved Level 50 or 50S lifejacket is recommended.\n\nYou can only ski in a gazetted ski area,',
  E'wearing an approved Level 50 or 50S lifejacket is recommended. You can only ski in a gazetted ski area,'
) where title = 'Water skiing rules' and content like '%wearing an approved Level 50 or 50S lifejacket is recommended.' || chr(10) || chr(10) || 'You can only%';

update lessons set content = replace(
  content,
  E'alter course to the right, slow down, or both.\n\nMeeting another vessel head-on,',
  E'alter course to the right, slow down, or both. Meeting another vessel head-on,'
) where title = 'Who gives way, and how you signal it' and content like '%alter course to the right, slow down, or both.' || chr(10) || chr(10) || 'Meeting%';

update lessons set content = replace(
  content,
  E'on vessels under 12 metres, these two can be combined into a single all-round white light.\n\nAnchor lights are all-round white,',
  E'on vessels under 12 metres, these two can be combined into a single all-round white light. Anchor lights are all-round white,'
) where title = 'Why navigation lights matter' and content like '%on vessels under 12 metres, these two can be combined into a single all-round white light.' || chr(10) || chr(10) || 'Anchor%';

update lessons set content = replace(
  content,
  E'matching the two black spheres on top of the mark.\n\nSafe water marks indicate exactly that',
  E'matching the two black spheres on top of the mark. Safe water marks indicate exactly that'
) where title = 'Lateral marks: reading channels' and content like '%matching the two black spheres on top of the mark.' || chr(10) || chr(10) || 'Safe water%';

update lessons set content = replace(
  content,
  E'make sure the bilges are dry, and test the steering.\n\nAfter every trip, flush the engine with fresh water,',
  E'make sure the bilges are dry, and test the steering. After every trip, flush the engine with fresh water,'
) where title = 'A simple maintenance routine' and content like '%make sure the bilges are dry, and test the steering.' || chr(10) || chr(10) || 'After every%';

update lessons set content = replace(
  content,
  E'check flares and EVDS are in date, and test any bilge pump.\n\nYearly, service the motor as the manufacturer recommends',
  E'check flares and EVDS are in date, and test any bilge pump. Yearly, service the motor as the manufacturer recommends'
) where title = 'A simple maintenance routine' and content like '%check flares and EVDS are in date, and test any bilge pump.' || chr(10) || chr(10) || 'Yearly%';

update lessons set content = replace(
  content,
  E'but don''t have head and neck support.\n\nWearing requirements (not just carrying) apply',
  E'but don''t have head and neck support. Wearing requirements (not just carrying) apply'
) where title = 'What you need to carry, and lifejackets' and content like '%but don''t have head and neck support.' || chr(10) || chr(10) || 'Wearing requirements%';

update lessons set content = replace(
  content,
  E'and plain water should never go near an electrical or cooking-oil fire.\n\nGet extinguishers inspected at least every six months,',
  E'and plain water should never go near an electrical or cooking-oil fire. Get extinguishers inspected at least every six months,'
) where title = 'Bailers, fire extinguishers and anchors' and content like '%and plain water should never go near an electrical or cooking-oil fire.' || chr(10) || chr(10) || 'Get extinguishers%';

update lessons set content = replace(
  content,
  E'its weight acts as a shock absorber that helps the anchor bite and hold.\n\nLower the anchor by letting it run out',
  E'its weight acts as a shock absorber that helps the anchor bite and hold. Lower the anchor by letting it run out'
) where title = 'Bailers, fire extinguishers and anchors' and content like '%its weight acts as a shock absorber that helps the anchor bite and hold.' || chr(10) || chr(10) || 'Lower the anchor%';

update lessons set content = replace(
  content,
  E'taking a bearing or transit on a fixed object on shore and watching for it to change.\n\nAnchoring is prohibited in channels',
  E'taking a bearing or transit on a fixed object on shore and watching for it to change. Anchoring is prohibited in channels'
) where title = 'Bailers, fire extinguishers and anchors' and content like '%taking a bearing or transit on a fixed object on shore and watching for it to change.' || chr(10) || chr(10) || 'Anchoring is%';

update lessons set content = replace(
  content,
  E'loose scuba cylinders, for example, are heavy enough to cause real damage if they roll around.\n\nWater sloshing around inside the hull (free surface effect)',
  E'loose scuba cylinders, for example, are heavy enough to cause real damage if they roll around. Water sloshing around inside the hull (free surface effect)'
) where title = 'Stability and loading your vessel' and content like '%loose scuba cylinders, for example, are heavy enough to cause real damage if they roll around.' || chr(10) || chr(10) || 'Water sloshing%';

update lessons set content = replace(
  content,
  E'and you can have real swell running through with hardly any wind where you are.\n\nWave height mostly comes down to three things:',
  E'and you can have real swell running through with hardly any wind where you are. Wave height mostly comes down to three things:'
) where title = 'Weather, tides and reading the conditions' and content like '%and you can have real swell running through with hardly any wind where you are.' || chr(10) || chr(10) || 'Wave height%';

update lessons set content = replace(
  content,
  E'a well-stocked, waterproof, clearly marked first aid kit are worth having.\n\nSeasickness is best managed preventatively:',
  E'a well-stocked, waterproof, clearly marked first aid kit are worth having. Seasickness is best managed preventatively:'
) where title = 'First aid, seasickness and hypothermia' and content like '%a well-stocked, waterproof, clearly marked first aid kit are worth having.' || chr(10) || chr(10) || 'Seasickness%';
