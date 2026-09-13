-- Module 1 age-rules update: expands the towing/observer/supervising-skipper
-- age rules in lesson 1, and adds Module 1's first practice question bank
-- covering those exact ages. Safe to run once against the live database.
do $$
declare
  v_module_id bigint;
begin
  select id into v_module_id from modules where sort_order = 1;
  if v_module_id is null then raise exception 'module sort_order % not found', 1; end if;
  update lessons set content = 'The Recreational Skipper''s Ticket (RST) is the licence you need to be in charge of a recreational boat in Western Australia. It exists for one reason: to make sure the person at the helm actually knows how to keep everyone on board, and everyone else on the water, safe.

You must hold an RST if you''re the skipper of a recreational vessel with a motor bigger than 6 hp (4.5 kW). "Skipper" means you''re the one responsible for the safe operation of the vessel and the safety of everyone on it — that''s a different job to just "driving," which means physically being at the controls.

The minimum age to hold an RST is 14. If you''re 14 or 15, you can only skipper during daylight hours and at speeds up to 8 knots. Once you turn 16, those restrictions lift.

A few specific activities carry their own age rules on top of this, and they come up often in the assessment, so it''s worth knowing the exact numbers rather than just "there are rules." To tow a water skier — that is, to be the skipper actually driving the ski boat — you must be at least 17. To act as the observer for water skiing (the person watching the skier and relaying signals to the skipper), you must be at least 14. And if you''re the supervising skipper on board for someone who doesn''t hold an RST themselves — the person legally responsible while they''re at the helm — you must be at least 18, and that age applies in any environment, not just at night or in a particular type of water.

Boats with a motor of 6 hp or less have lighter requirements — you don''t need an RST to skipper one — but these same age limits for towing, observing and supervising still apply.' where module_id = v_module_id and sort_order = 1;
  select id into v_module_id from modules where sort_order = 1;
  if v_module_id is null then raise exception 'module sort_order % not found', 1; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'What is the minimum age to hold an RST?', '12', '14', '16', '18', 'b', 'easy');
  select id into v_module_id from modules where sort_order = 1;
  if v_module_id is null then raise exception 'module sort_order % not found', 1; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'An RST holder aged 14 or 15 is restricted to skippering:', 'During daylight hours and at a speed of less than 8 knots.', 'Only on protected waters.', 'Only with an adult on board.', 'Only vessels under 3 metres.', 'a', 'normal');
  select id into v_module_id from modules where sort_order = 1;
  if v_module_id is null then raise exception 'module sort_order % not found', 1; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'What is the minimum age to be the skipper towing a water skier?', '14', '16', '17', '18', 'c', 'hard');
  select id into v_module_id from modules where sort_order = 1;
  if v_module_id is null then raise exception 'module sort_order % not found', 1; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'What is the minimum age to act as the observer when a vessel is towing a water skier?', '12', '14', '16', '18', 'b', 'normal');
  select id into v_module_id from modules where sort_order = 1;
  if v_module_id is null then raise exception 'module sort_order % not found', 1; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'You''re supervising a person who does not hold an RST while they skipper a vessel. What is the minimum age to act as that supervising skipper?', '16, but only during daylight hours.', '17, but only on protected waters.', '18, in any environment.', '21, but only on unprotected waters.', 'c', 'hard');
  select id into v_module_id from modules where sort_order = 1;
  if v_module_id is null then raise exception 'module sort_order % not found', 1; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'A vessel with a motor of 6 hp or less does not require the skipper to hold an RST. Do the age limits for towing, observing and supervising still apply?', 'No — those limits only apply to vessels requiring an RST.', 'Yes — the same age limits still apply.', 'Only the observer age limit applies.', 'Only the supervising skipper age limit applies.', 'b', 'hard');
end $$;
