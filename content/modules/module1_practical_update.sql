-- Module 1, Lesson 2: reworded the practical-assessment line to reassure
-- students and point their study time at the theory component. Safe to run once.
do $$
declare
  v_module_id bigint;
begin
  select id into v_module_id from modules where sort_order = 1;
  if v_module_id is null then raise exception 'module sort_order % not found', 1; end if;
  update lessons set content = 'Getting your RST means passing two separate assessments: a theory test and a practical, on-water test. You don''t have to do a training course first — plenty of people study this workbook on their own and practise with a supervising skipper (a friend, parent or relative who already holds an RST and is over 18).

The theory assessment is a 40-question multiple-choice paper covering rules and regulations, collision avoidance, navigation lights, IALA buoyage, maintenance, safety equipment, safe operations, and emergencies. You need at least 34 correct to move on to the practical. Score 30–33 and you can resit with a different set of questions the same day; score under 30 and you''ll need to come back another day. You get a maximum of two attempts in one day.

The practical assessment takes about 30 minutes and is done on the water with an approved assessor. It covers things like a safety briefing, starting the motor safely, logging a voyage plan, departing and returning to a berth, recovering someone from the water, and bringing the vessel to a controlled stop. You need to get at least 56 of the 62 assessment criteria right — so six or fewer mistakes. You get one practical attempt on the day, but don''t worry — this is the easy part. Our expert trainers will teach you all the steps on the day, so there''s no need to study too hard for this one. You''re better off spending that time on the theory component.

Pass both and your assessor issues you a Receipt of Completion certificate on the spot, which lets you skipper straight away. Your actual RST card follows in the mail once DTMI processes your records.' where module_id = v_module_id and sort_order = 2;
end $$;
