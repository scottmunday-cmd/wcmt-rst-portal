-- Incremental content import: NEW Navigation Lights + IALA Buoyage rows only.
-- Safe to run once against a database that already has the original
-- module 4 (2 lessons, 1 question) and module 5 (3 lessons, 2 questions) rows —
-- this script does NOT touch those, it only adds the new ones below.
do $$
declare
  v_module_id bigint;
begin
  select id into v_module_id from modules where sort_order = 4;
  if v_module_id is null then raise exception 'module sort_order % not found', 4; end if;
  insert into lessons (module_id, title, content, video_url, sort_order) values (v_module_id, 'How far your lights must reach, and protecting your night vision', 'Every navigation light has a minimum range it must be visible from, based on your vessel''s length — this is what lets other skippers judge how far away you are and react in good time. As a rough guide: on a vessel under 12 metres, your masthead light must be visible from at least 2 nautical miles, and your sidelights, stern light, towing light and any all-round lights from at least 1 to 2 nautical miles. On vessels from 12 up to 50 metres, most of these ranges step up to around 2–3 nautical miles, and the masthead light needs at least 3 nautical miles once you''re 12 metres or more. Vessels 50 metres and over need greater range again across the board. The takeaway for a recreational skipper: don''t assume a dim aftermarket light is good enough — check it''s actually rated for the distance your vessel needs.

Night vision itself is worth understanding too. Rhodopsin is the light-sensitive molecule in your eyes that lets you see in the dark, and it bleaches out almost instantly when hit with a bright white light — full recovery can take the better part of an hour (roughly 10 minutes to get back 10 per cent of your night vision, 30–45 minutes for 80 per cent, and longer again for the rest). That''s why experienced boaties use red light at the helm and chart table at night: it lets you read instruments without wrecking the night vision you need to actually see the water and other vessels.

Speed limits can also tighten after dark in specific high-traffic areas — for example, the general open-water speed limit on Perth''s Swan and Canning rivers drops to 10 knots between sunset and sunrise. Always check local signage and charts for any area you''re operating in after dark, since unlit hazards combined with reduced visibility make night boating inherently riskier.', null, 3);
  select id into v_module_id from modules where sort_order = 4;
  if v_module_id is null then raise exception 'module sort_order % not found', 4; end if;
  insert into lessons (module_id, title, content, video_url, sort_order) values (v_module_id, 'Exact placement rules, and lights for sailing vessels', 'Where you mount your lights matters as much as which lights you carry. On a vessel using a masthead light, it must sit at least 2.5 metres above the gunwale, and if you''re also carrying combined sidelights, they need to sit at least 1 metre below the masthead light. This vertical separation helps other skippers read your lights correctly from a distance rather than seeing a confusing cluster.

Sailing vessels have their own combinations, since a boat under sail alone isn''t held to the same rules as one under power (though a sailing boat running its motor must show the same lights as any other motor boat of its size). A sailing vessel under 7 metres, or one being rowed, can use the same options as larger sailing boats — a combined lantern near the top of the mast, or separate sidelights and a stern light — but if it genuinely can''t carry those, it must at least have an electric torch or lantern ready, showing a white light in time to prevent a collision. Sailing vessels from 7 up to 20 metres show either a combined lantern at or near the masthead (incorporating sidelights and stern light in one fitting) or separate sidelights and a stern light. Sailing vessels over 20 metres must use separate sidelights and a stern light — a combined lantern isn''t an option at that size.

There''s also an optional extra for sailing vessels with separate (not combined) sidelights and a stern light: they may carry two additional all-round lights in a vertical line near the top of the mast, with the upper light red and the lower light green. These aren''t compulsory, but they help other vessels identify you as a sailing vessel from a distance, which matters most in mixed commercial and recreational traffic.', null, 4);
  select id into v_module_id from modules where sort_order = 5;
  if v_module_id is null then raise exception 'module sort_order % not found', 5; end if;
  insert into lessons (module_id, title, content, video_url, sort_order) values (v_module_id, 'Reading light rhythms: how marks ''blink'' at night', 'Every lit navigation mark flashes in a specific rhythm, and learning to read that rhythm is often faster than trying to make out a mark''s colour or shape in the dark. A Fixed light simply stays on continuously. A Flashing light is on for less time than it''s off, with each flash roughly equal in length; a Long Flashing light is the same idea but each flash lasts at least two seconds. A Group Flashing light repeats a specific number of flashes together — say, three flashes, a pause, then three flashes again — and the number in the group is often meaningful, as with cardinal marks. Composite Group Flashing combines two different flash-groups into one repeating pattern, and is deliberately kept away from ordinary lateral marks so it isn''t confused with genuine group-flashing marks.

Quick Flashing and Very Quick Flashing are exactly what they sound like — a continuous rapid flash, at 50 to 60 times a minute for Quick and 100 to 120 times a minute for Very Quick. Occulting is the reverse of flashing: the light is on for longer than it''s off, with brief, regular dark eclipses. Isophase lights spend exactly equal time lit and dark. Morse lights spell out a letter in Morse code using short and long flashes — the Morse "A" rhythm (short-long) turns up on some safe water marks.

These rhythms aren''t random — each type of mark is restricted to certain ones, so you can often narrow down what you''re looking at before you even check the chart. Lateral marks (port and starboard) may use their red or green light in any rhythm except Composite Group Flashing. Safe water marks, if lit, use Isophase, Occulting, a Long Flash roughly every 10 seconds, or the Morse "A" rhythm. Special marks show a yellow light in any rhythm not already used by cardinal, isolated danger or safe water marks. Leads, if lit, may use any colour at all — the chart will tell you exactly what to expect for a given pair.', null, 4);
  select id into v_module_id from modules where sort_order = 4;
  if v_module_id is null then raise exception 'module sort_order % not found', 4; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'On a vessel under 12 metres, what is the minimum distance a masthead light must be visible from?', '1 nautical mile.', '2 nautical miles.', '3 nautical miles.', '5 nautical miles.', 'b', 'normal');
  select id into v_module_id from modules where sort_order = 4;
  if v_module_id is null then raise exception 'module sort_order % not found', 4; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'On a vessel that carries a masthead light, how high above the gunwale must it be mounted, at minimum?', '1 metre.', '1.5 metres.', '2 metres.', '2.5 metres.', 'd', 'hard');
  select id into v_module_id from modules where sort_order = 4;
  if v_module_id is null then raise exception 'module sort_order % not found', 4; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'What happens to rhodopsin, the molecule in your eyes responsible for night vision, when exposed to a bright white light?', 'It bleaches out, and full night vision can take the better part of an hour to recover.', 'It has no real effect on night vision.', 'It permanently improves night vision.', 'It turns the surrounding area red.', 'a', 'normal');
  select id into v_module_id from modules where sort_order = 4;
  if v_module_id is null then raise exception 'module sort_order % not found', 4; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'A sailing vessel over 20 metres with separate sidelights and a stern light may also carry two optional all-round lights near the top of the mast. What colour is the upper light?', 'White.', 'Red.', 'Green.', 'Yellow.', 'b', 'hard');
  select id into v_module_id from modules where sort_order = 4;
  if v_module_id is null then raise exception 'module sort_order % not found', 4; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'Between sunset and sunrise, the general open-water speed limit on the Swan and Canning rivers reduces to:', '6 knots.', '8 knots.', '10 knots.', '12 knots.', 'c', 'normal');
  select id into v_module_id from modules where sort_order = 4;
  if v_module_id is null then raise exception 'module sort_order % not found', 4; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'What lights must a vessel over 50 metres in length show while at anchor?', 'A single all-round white light.', 'Two all-round white lights, with the forward light higher than the aft light.', 'Two all-round white lights, with the aft light higher than the forward light.', 'A single flashing yellow light.', 'b', 'normal');
  select id into v_module_id from modules where sort_order = 4;
  if v_module_id is null then raise exception 'module sort_order % not found', 4; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'What is the minimum lighting requirement for a motor boat under 7 metres travelling at 7 knots or less, underway at night?', 'Sidelights only, with no other light required.', 'A visible all-round white light, and sidelights if practicable.', 'A masthead light and stern light only.', 'No lights are required at that speed.', 'b', 'normal');
  select id into v_module_id from modules where sort_order = 5;
  if v_module_id is null then raise exception 'module sort_order % not found', 5; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'Which colours are used for lateral mark lights?', 'Red and green only — the only marks that use these colours.', 'White only.', 'Yellow only.', 'Red and white.', 'a', 'normal');
  select id into v_module_id from modules where sort_order = 5;
  if v_module_id is null then raise exception 'module sort_order % not found', 5; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'Which light rhythm is specifically kept away from ordinary lateral marks, to avoid confusion?', 'Flashing.', 'Quick Flashing.', 'Group Flashing.', 'Composite Group Flashing.', 'd', 'hard');
  select id into v_module_id from modules where sort_order = 5;
  if v_module_id is null then raise exception 'module sort_order % not found', 5; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'If lit, a Safe Water Mark will NOT normally show which of the following rhythms?', 'Isophase.', 'Occulting.', 'Composite Group Flashing.', 'Long Flash (about every 10 seconds).', 'c', 'hard');
  select id into v_module_id from modules where sort_order = 5;
  if v_module_id is null then raise exception 'module sort_order % not found', 5; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'What colour light does a Special Mark show, if lit?', 'White.', 'Yellow.', 'Red.', 'Green.', 'b', 'normal');
  select id into v_module_id from modules where sort_order = 5;
  if v_module_id is null then raise exception 'module sort_order % not found', 5; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'Which of the following is NOT a typical use of a Special Mark?', 'Marking a traffic separation zone.', 'Marking a spoil ground.', 'Marking an aquaculture lease.', 'Marking the port side of a channel.', 'd', 'normal');
  select id into v_module_id from modules where sort_order = 5;
  if v_module_id is null then raise exception 'module sort_order % not found', 5; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'A light shows a continuous flashing pattern at a rate of 50 to 60 flashes per minute. What type of light is this?', 'Isophase.', 'Quick Flashing.', 'Very Quick Flashing.', 'Occulting.', 'b', 'hard');
  select id into v_module_id from modules where sort_order = 5;
  if v_module_id is null then raise exception 'module sort_order % not found', 5; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'When using a pair of leads to steer a safe course, if the marks are lit, what colour must the lights be?', 'Always red.', 'Always white.', 'Always green.', 'Any colour — the chart will show what to expect.', 'd', 'normal');
end $$;
