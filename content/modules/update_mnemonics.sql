-- Update existing lesson content to fold in generic nautical mnemonics
-- (green to green, red-port-left-in-the-glass, cardinal hourglass shape,
-- the classic 'green to green or red to red' passing rhyme). Updates only —
-- no new rows, safe to run once against the live database.
do $$
declare
  v_module_id bigint;
begin
  select id into v_module_id from modules where sort_order = 3;
  if v_module_id is null then raise exception 'module sort_order % not found', 3; end if;
  update lessons set content = 'The golden rule on the water is: look to the right, give way to the right, turn to the right, and stay to the right. In general, power gives way to sail, and any vessel hampered by what it''s doing (dredging, cable laying) gets right of way over ordinary traffic.

Overtaking overrides every other give-way rule: the overtaking vessel must keep clear of the vessel being overtaken, on either side, but with plenty of room. If you''re being overtaken, hold your course and speed until the other vessel is past and clear.

For two power-driven vessels crossing paths: if the other vessel is on your right (starboard), it has right of way and you must keep clear — turn right, slow down, or both. If it''s on your left (port), you technically have right of way, but if it looks like the other skipper hasn''t seen you, you need to act anyway: alter course to the right, slow down, or both. Meeting another vessel head-on, both of you alter course to the right, so you pass port side to port side. There''s an old rhyme sailors have used for generations to remember this: "green to green, or red to red, perfect safety, go ahead" — if the sidelight colour you can see matches the one you''re showing them, you''re passing safely.

Sound signals are used to indicate what you''re about to do: one short blast means you''re altering course to starboard, two short blasts means altering course to port, three short blasts means your engines are going astern, and five short blasts is the "I don''t understand your intentions, or you''re not following the rules" signal — in other words, get out of the way.

When travelling upstream in a narrow channel or river, keep to the starboard (right-hand) side.' where module_id = v_module_id and sort_order = 2;
  select id into v_module_id from modules where sort_order = 5;
  if v_module_id is null then raise exception 'module sort_order % not found', 5; end if;
  update lessons set content = 'The IALA buoyage system uses distinctive shapes, colours and light rhythms so you can tell at a glance what a navigation mark is warning you about. Lateral marks show you the port and starboard sides of a channel: red, can-shaped marks are port marks, and green, triangular marks are starboard marks.

The rule for using them depends on your direction of travel. Entering harbours or heading upstream, keep port marks on your port (left) side and starboard marks on your starboard (right) side — a simple way to say this is "green to green, heading in": keep the green marks on your green (starboard) side as you come in from the sea. Leaving harbours or heading downstream, it''s reversed. If lit, port marks show red lights and starboard marks show green lights — the only marks that use those colours.

A couple of old memory tricks are worth knowing, because they stick. "There''s no red port left in the glass" plays on the drink: port wine is red, and red is port, which is left. And if you''re ever unsure which pair goes together, the word with more letters in it goes with the word with more letters: "green" and "right"/"starboard" are the longer words, "red", "left" and "port" are the shorter ones.

Isolated danger marks indicate a specific hazard with safe water all around it — pass well clear on any side. Their black body with a red band is a handy colour combination to remember precisely because it looks a bit like a redback spider — black with a red marking, and definitely something to stay well clear of. If lit, they show a white light flashing in groups of two, matching the two black spheres on top of the mark. Safe water marks indicate exactly that — safe water all around, often used to mark the seaward end of a channel — and if lit, show a white light, often using the Morse "A" rhythm.' where module_id = v_module_id and sort_order = 1;
  select id into v_module_id from modules where sort_order = 5;
  if v_module_id is null then raise exception 'module sort_order % not found', 5; end if;
  update lessons set content = 'Cardinal marks tell you which compass direction the safe water lies in, relative to a hazard — so you pass to the north of a North cardinal mark, the east of an East cardinal mark, and so on. Having a compass on board makes these genuinely useful rather than just decorative.

The black and yellow colour bands and the black cone-shaped topmarks follow a logical pattern: North has both cones pointing up, black at the top; South has both pointing down, black at the bottom; East has the cones pointing away from each other (up and down), black at the top and bottom; West has the cones pointing towards each other, black in the middle — picture an hourglass shape, pinched in the centre, and you''ve got West.

Lit cardinal marks roughly follow a clock face: continuous flashing for North (12 o''clock), three flashes for East (3 o''clock), six flashes plus one long flash for South (6 o''clock), and nine flashes for West (9 o''clock). The extra long flash on South and the continuous flash on North exist specifically so you don''t lose count in the dark.' where module_id = v_module_id and sort_order = 2;
end $$;
