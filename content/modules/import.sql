-- Auto-generated content import: lessons + questions
-- Source: content/modules/lessons.csv, questions.csv (build_content.py)
do $$
declare
  v_module_id bigint;
begin
  select id into v_module_id from modules where sort_order = 1;
  if v_module_id is null then raise exception 'module sort_order % not found', 1; end if;
  insert into lessons (module_id, title, content, video_url, sort_order) values (v_module_id, 'What is the RST, and do you need one?', 'The Recreational Skipper''s Ticket (RST) is the licence you need to be in charge of a recreational boat in Western Australia. It exists for one reason: to make sure the person at the helm actually knows how to keep everyone on board, and everyone else on the water, safe.

You must hold an RST if you''re the skipper of a recreational vessel with a motor bigger than 6 hp (4.5 kW). "Skipper" means you''re the one responsible for the safe operation of the vessel and the safety of everyone on it — that''s a different job to just "driving," which means physically being at the controls.

The minimum age to hold an RST is 14. If you''re 14 or 15, you can only skipper during daylight hours and at speeds up to 8 knots. Once you turn 16, those restrictions lift. Some activities — like towing a water skier, or driving a boat when you''re the one being supervised because you don''t hold an RST yourself — have their own age rules, so if you''re planning anything unusual, it''s worth checking the requirements for that specific activity.

Boats with a motor of 6 hp or less have lighter requirements — you don''t need an RST to skipper one, though age limits still apply for towing and similar activities.', null, 1);
  select id into v_module_id from modules where sort_order = 1;
  if v_module_id is null then raise exception 'module sort_order % not found', 1; end if;
  insert into lessons (module_id, title, content, video_url, sort_order) values (v_module_id, 'Theory and practical: what the assessment actually covers', 'Getting your RST means passing two separate assessments: a theory test and a practical, on-water test. You don''t have to do a training course first — plenty of people study this workbook on their own and practise with a supervising skipper (a friend, parent or relative who already holds an RST and is over 18).

The theory assessment is a 40-question multiple-choice paper covering rules and regulations, collision avoidance, navigation lights, IALA buoyage, maintenance, safety equipment, safe operations, and emergencies. You need at least 34 correct to move on to the practical. Score 30–33 and you can resit with a different set of questions the same day; score under 30 and you''ll need to come back another day. You get a maximum of two attempts in one day.

The practical assessment takes about 30 minutes and is done on the water with an approved assessor. It covers things like a safety briefing, starting the motor safely, logging a voyage plan, departing and returning to a berth, recovering someone from the water, and bringing the vessel to a controlled stop. You need to get at least 56 of the 62 assessment criteria right — so six or fewer mistakes — and you only get one practical attempt per day.

Pass both and your assessor issues you a Receipt of Completion certificate on the spot, which lets you skipper straight away. Your actual RST card follows in the mail once DTMI processes your records.', null, 2);
  select id into v_module_id from modules where sort_order = 1;
  if v_module_id is null then raise exception 'module sort_order % not found', 1; end if;
  insert into lessons (module_id, title, content, video_url, sort_order) values (v_module_id, 'Getting ready for assessment day', 'Before you can be assessed, there''s some paperwork to sort out.

If you''re under 18, you''ll need a letter of consent signed by a parent or guardian. You''ll also need to prove your identity — a valid Australian driver''s licence or learner''s permit covers both identity and the eyesight requirement (a minimum corrected vision of 6/12 in at least one eye). If you don''t have one, you''ll need either one full identity document or a primary-plus-secondary combination, and a medical practitioner, nurse or optometrist to sign an eyesight declaration for you.

You''ll also need to self-declare your medical fitness. If you have a condition that could affect your ability to safely operate a vessel — things like epilepsy, heart disease, uncontrolled blood pressure, or type 1 diabetes are examples — you''ll need a medical practitioner to complete a Declaration of Medical Fitness form.

Assessment fees aren''t set by DTMI, so it''s worth comparing prices between authorised providers. If you already hold a recognised interstate or overseas skipper''s licence, you can operate in WA for up to three months before you need to apply for your RST under the Skills Recognition scheme — and if you hold certain existing marine qualifications, you may be able to skip the assessment altogether through that same scheme.', null, 3);
  select id into v_module_id from modules where sort_order = 2;
  if v_module_id is null then raise exception 'module sort_order % not found', 2; end if;
  insert into lessons (module_id, title, content, video_url, sort_order) values (v_module_id, 'Your responsibilities as skipper', 'As skipper, you carry a duty of care for everyone on your vessel and everyone else sharing the water with you. That''s the starting point for everything in this module — the rules exist because a boat is a powerful, sometimes dangerous thing, and someone has to be answerable for how it''s used.

Marine safety officers and police have the power to stop and check vessels, and you''re required to identify yourself as the skipper when asked. If you change your name or address, you need to update your RST details with DTMI.

If you''re involved in a marine incident, there are reporting obligations. Any accident involving serious injury or death, or damage that makes a vessel unseaworthy or unsafe, must be reported within 72 hours. Beyond the legal obligation, there''s also a longstanding tradition of the sea: if you come across someone in distress, you''re expected to offer assistance, within the limits of what you can safely do.

Alcohol and drugs are treated the same way on the water as on the road — the blood alcohol limit for skippers is 0.05, aligned with WA''s road law, and operating under the influence of illicit drugs carries the same seriousness as drink driving.', null, 1);
  select id into v_module_id from modules where sort_order = 2;
  if v_module_id is null then raise exception 'module sort_order % not found', 2; end if;
  insert into lessons (module_id, title, content, video_url, sort_order) values (v_module_id, 'Speed limits and staying clear of others', 'Speed limits on the water exist to protect people, property and the environment, and they show up in a few recurring situations. As a rule of thumb, 8 knots is the limit near bridges, in mooring areas, in shallow water, within 50 metres of vessels underway, within 50 metres of a person in the water, and near jetties or riverbanks. Marine safety signs will tell you the specific limit for a given area, so it pays to know how to read them.

Right of way at jetties follows a similar logic to giving way on the water generally: the vessel travelling down-river usually gives way, a boat on the outer course gives way to one on the inner course, and whoever got underway first generally has the right of way.

You''re also required to keep clear of navigation aids (don''t obstruct them) and to stay within the hull of your vessel while underway — no perching on the bow or gunwales. Marine animals and their habitat get specific protection too: anchoring in a way that damages seagrass, disturbing wildlife, or excessive noise and wake near sensitive areas can all be enforcement matters, not just courtesy issues.', null, 2);
  select id into v_module_id from modules where sort_order = 2;
  if v_module_id is null then raise exception 'module sort_order % not found', 2; end if;
  insert into lessons (module_id, title, content, video_url, sort_order) values (v_module_id, 'Pollution, rubbish and refuelling', 'Polluting WA''s waterways carries serious penalties — up to $200,000 for an individual and $1 million for a company — so the rules here aren''t just guidelines. There are set distances for disposing of rubbish, oil and garbage overboard, and you''re expected to manage your bilge responsibly rather than pumping contaminated water straight over the side.

Refuelling is one of the most common ways fuel ends up in the water, so take care: know how much fuel you need before you start (to avoid overfilling), and keep a fire extinguisher within reach while you refuel. If you do have a spill, WA''s Oil Spill Response Coordination Unit can be contacted on (08) 9480 9924.

Sewage discharge from vessels is also regulated, particularly in sensitive or enclosed waterways, so check the rules for the area you''re operating in if your vessel has onboard toilet facilities.', null, 3);
  select id into v_module_id from modules where sort_order = 2;
  if v_module_id is null then raise exception 'module sort_order % not found', 2; end if;
  insert into lessons (module_id, title, content, video_url, sort_order) values (v_module_id, 'Registration and special activities', 'Most recreational vessels with an engine need to be registered, though there are exemptions — small tenders, canoes, and lifeboats used only for their intended purpose are common examples, generally where the vessel is 3.1 metres or less, or fitted with a motor of 5 hp or less. Registered vessels need to display their registration number and label correctly for their vessel type.

A few activities carry their own extra rules. Diving needs to be signalled with Code Flag "A" and diving lights where relevant, and other vessels need to give divers 50 metres of clearance. Water skiing requires a skipper, an observer and a skier who all meet age and role requirements, uses standard hand signals, and is restricted to defined ski areas and distances from other water users. Personal watercraft (PWC) have their own safety equipment requirements that differ depending on whether you''re operating inshore or more than 400 metres offshore, and freestyling or tow-in surfing are prohibited in some zones.', null, 4);
  select id into v_module_id from modules where sort_order = 3;
  if v_module_id is null then raise exception 'module sort_order % not found', 3; end if;
  insert into lessons (module_id, title, content, video_url, sort_order) values (v_module_id, 'The basics: lookout, safe speed and responsibility', 'Every skipper is responsible for avoiding collisions — full stop. Even when the rules say another vessel should give way to you, if they don''t, you''re still expected to take whatever action is needed to avoid a crash. "They should have given way" is not a defence.

The single most important habit is keeping a good lookout, using your eyes, ears and any equipment you have — radar, sounders, plotters — especially at night or in poor visibility. Alongside that, travel at a safe speed: one that gives you enough time to manoeuvre and avoid a collision, taking into account visibility, traffic, background lighting and water depth.

To assess whether another vessel is a collision risk, watch its bearing relative to you. If the bearing isn''t changing — the other boat isn''t moving ahead or dropping back in your line of sight — you''re likely on a collision course, and whatever action you take needs to be obvious to the other vessel and result in you passing well clear.

In restricted visibility (fog, heavy rain), keep an especially good lookout, switch your navigation lights on, slow to a safe speed for the conditions, and be ready to stop or manoeuvre at any moment.', null, 1);
  select id into v_module_id from modules where sort_order = 3;
  if v_module_id is null then raise exception 'module sort_order % not found', 3; end if;
  insert into lessons (module_id, title, content, video_url, sort_order) values (v_module_id, 'Who gives way, and how you signal it', 'The golden rule on the water is: look to the right, give way to the right, turn to the right, and stay to the right. In general, power gives way to sail, and any vessel hampered by what it''s doing (dredging, cable laying) gets right of way over ordinary traffic.

Overtaking overrides every other give-way rule: the overtaking vessel must keep clear of the vessel being overtaken, on either side, but with plenty of room. If you''re being overtaken, hold your course and speed until the other vessel is past and clear.

For two power-driven vessels crossing paths: if the other vessel is on your right (starboard), it has right of way and you must keep clear — turn right, slow down, or both. If it''s on your left (port), you technically have right of way, but if it looks like the other skipper hasn''t seen you, you need to act anyway: alter course to the right, slow down, or both. Meeting another vessel head-on, both of you alter course to the right.

Sound signals are used to indicate what you''re about to do: one short blast means you''re altering course to starboard, two short blasts means altering course to port, three short blasts means your engines are going astern, and five short blasts is the "I don''t understand your intentions, or you''re not following the rules" signal — in other words, get out of the way.

When travelling upstream in a narrow channel or river, keep to the starboard (right-hand) side.', null, 2);
  select id into v_module_id from modules where sort_order = 4;
  if v_module_id is null then raise exception 'module sort_order % not found', 4; end if;
  insert into lessons (module_id, title, content, video_url, sort_order) values (v_module_id, 'Why navigation lights matter', 'Any vessel out from sunset to sunrise — whether underway or at anchor — must carry and correctly show navigation lights, and they''re also required during daylight hours if visibility is restricted. Before you head out, make sure your lights actually work; it''s an easy thing to overlook and a common cause of near-misses at night.

Lights need to be positioned so nothing on your vessel blocks them — a common problem on trailer boats is a masthead light on a pole that doesn''t clear the top of a cabin or windscreen. An obscured light can confuse other vessels about what you''re doing and where you''re headed, which defeats the whole purpose.

The main light positions are sidelights (red for port, green for starboard, each visible through 112.5° either side of the bow), a masthead light (white, shining forward through 225°) and a stern light (white, shining aft through 135°). Together, the masthead and stern lights cover the full 360° in white; on vessels under 12 metres, these two can be combined into a single all-round white light. Anchor lights are all-round white, visible through the full 360°, and should be positioned where they can best be seen.', null, 1);
  select id into v_module_id from modules where sort_order = 4;
  if v_module_id is null then raise exception 'module sort_order % not found', 4; end if;
  insert into lessons (module_id, title, content, video_url, sort_order) values (v_module_id, 'Matching lights to your vessel', 'What lights you need to show depends on your vessel''s length and whether it''s under power or sail. As a rough guide: motor boats under 7 metres travelling at 7 knots or less need a visible all-round white light and, if possible, sidelights. Motor boats under 12 metres need sidelights plus either an all-round white light, or a masthead light and stern light. Larger vessels (12–20 metres) need a masthead light with separate or combined sidelights and stern light.

Sailing boats underway under sail show sidelights and a stern light (combined or separate depending on size); if motoring, they must show the same lights as a motor boat. A sailing boat under 7 metres, or one being rowed, that can''t carry proper lights should at least have an electric torch or lantern ready to show a white light in time to prevent a collision.

At anchor, vessels under 50 metres show a single all-round white light, positioned so it can be seen from every direction; vessels over 50 metres show two all-round white lights, with the forward one higher than the aft one. If you''re anchored in a busy area or overnight, showing extra lights (like deck lights) and keeping a proper watch is good practice on top of the minimum requirement.', null, 2);
  select id into v_module_id from modules where sort_order = 5;
  if v_module_id is null then raise exception 'module sort_order % not found', 5; end if;
  insert into lessons (module_id, title, content, video_url, sort_order) values (v_module_id, 'Lateral marks: reading channels', 'The IALA buoyage system uses distinctive shapes, colours and light rhythms so you can tell at a glance what a navigation mark is warning you about. Lateral marks show you the port and starboard sides of a channel: red, can-shaped marks are port marks, and green, triangular marks are starboard marks.

The rule for using them depends on your direction of travel. Entering harbours or heading upstream, keep port marks on your port (left) side and starboard marks on your starboard (right) side. Leaving harbours or heading downstream, it''s reversed. A handy memory aid is "there''s some red, port, left in the bottle" for the upstream direction. If lit, port marks show red lights and starboard marks show green lights — the only marks that use those colours.

Isolated danger marks indicate a specific hazard with safe water all around it — pass well clear on any side. If lit, they show a white light flashing in groups of two, matching the two black spheres on top of the mark. Safe water marks indicate exactly that — safe water all around, often used to mark the seaward end of a channel — and if lit, show a white light, often using the Morse "A" rhythm.', null, 1);
  select id into v_module_id from modules where sort_order = 5;
  if v_module_id is null then raise exception 'module sort_order % not found', 5; end if;
  insert into lessons (module_id, title, content, video_url, sort_order) values (v_module_id, 'Cardinal marks: pass on the named side', 'Cardinal marks tell you which compass direction the safe water lies in, relative to a hazard — so you pass to the north of a North cardinal mark, the east of an East cardinal mark, and so on. Having a compass on board makes these genuinely useful rather than just decorative.

The black and yellow colour bands and the black cone-shaped topmarks follow a logical pattern: North has both cones pointing up, black at the top; South has both pointing down, black at the bottom; East has the cones pointing away from each other (up and down), black at the top and bottom; West has the cones pointing towards each other, black in the middle.

Lit cardinal marks roughly follow a clock face: continuous flashing for North (12 o''clock), three flashes for East (3 o''clock), six flashes plus one long flash for South (6 o''clock), and nine flashes for West (9 o''clock). The extra long flash on South and the continuous flash on North exist specifically so you don''t lose count in the dark.', null, 2);
  select id into v_module_id from modules where sort_order = 5;
  if v_module_id is null then raise exception 'module sort_order % not found', 5; end if;
  insert into lessons (module_id, title, content, video_url, sort_order) values (v_module_id, 'Special marks, leads and sectored lights', 'Special marks indicate a feature rather than a hazard to route around — things like traffic separation zones, spoil grounds, or aquaculture leases. They''re yellow, often with a yellow "X" topmark, and if lit, show a yellow light in a rhythm not used by cardinal, isolated danger or safe water marks.

Leads are pairs of marks that, when you line them up one directly above the other, show you the safe course through a shallow or hazardous stretch of water — commonly used for approaches to anchorages. You steer to keep the rear mark directly above the front one; if they separate, you''ve drifted off the safe line and need to correct back.

Sectored lights work on a similar principle using colour instead of alignment: a single light shows different colours across different arcs, typically white for the safe channel and red or green for the areas to avoid. If the light you''re steering by shifts from white to red or green, you need to adjust course back into the white sector — and always check the chart for exactly what a sectored light means, since the details vary by location.', null, 3);
  select id into v_module_id from modules where sort_order = 6;
  if v_module_id is null then raise exception 'module sort_order % not found', 6; end if;
  insert into lessons (module_id, title, content, video_url, sort_order) values (v_module_id, 'Engine, electrical and fuel care', 'Poor motor maintenance alone accounts for a huge share of the calls marine rescue groups respond to each year — most breakdowns are preventable with a bit of routine attention. Have your motor serviced by a specialist at least once a year even if you barely use it, since a proper service catches things like water pump wear that you won''t notice yourself. If you use your motor hard, get the gearbox oil changed every three months.

Electrical systems most often fail through corrosion, so keep terminals and connectors clean, spray them with a corrosion-retardant, and check your navigation lights work even if you only ever plan to be out in daylight. Batteries deserve regular attention too: use a genuine marine battery suited to your motor, keep it secured in a ventilated container, keep terminals clean and tight, and top up cells with distilled water where applicable.

Fuel is a major fire and breakdown risk. Regularly inspect fuel tanks, valves, pumps and lines for corrosion and leaks, and do a "sniff test" every time you board — if you smell fuel, find the problem before you start the motor. Keep tanks topped up and closed when not in use to reduce condensation, and replace fuel that''s been sitting for a long period, since water tends to build up in old fuel.', null, 1);
  select id into v_module_id from modules where sort_order = 6;
  if v_module_id is null then raise exception 'module sort_order % not found', 6; end if;
  insert into lessons (module_id, title, content, video_url, sort_order) values (v_module_id, 'A simple maintenance routine', 'A good routine covers four timeframes: pre-trip, post-trip, monthly and yearly. Before every trip, check the vessel for obvious flaws, check engine oil and coolant levels, make sure the bilges are dry, and test the steering. After every trip, flush the engine with fresh water, inspect for rubbish or stray metal items (especially in aluminium boats, where it can cause corrosion), and protect fuel tanks and lines from the elements.

Monthly checks are a good time to look over safety gear for deterioration, check flares and EVDS are in date, and test any bilge pump. Yearly, service the motor as the manufacturer recommends (or sooner if needed), replace gearbox oil, check anodes for erosion, and inspect through-hull fittings, hoses and clamps for corrosion or wear.

Propellers deserve their own check: carry a spare if you can, keep the prop clean and free of dings, and pull it off periodically to check for wrapped fishing line — line caught around the shaft can destroy the gearbox seal and let water in, eventually wrecking the gearbox.', null, 2);
  select id into v_module_id from modules where sort_order = 7;
  if v_module_id is null then raise exception 'module sort_order % not found', 7; end if;
  insert into lessons (module_id, title, content, video_url, sort_order) values (v_module_id, 'What you need to carry, and lifejackets', 'What safety equipment you must carry depends on where you operate (protected waters — rivers, lakes, estuaries and within 400 metres of shore — versus unprotected waters beyond that) and whether your vessel is registrable. The requirements are a minimum, though — it''s on you as skipper to judge whether extra equipment is needed for your trip.

Whatever you carry, you need to actually know where it''s stowed, how to use it, and when it expires. Keep gear accessible (not locked away in a cupboard), stow flares in a dry, waterproof, accessible spot, and check expiry dates regularly — flares, EPIRBs, PLBs, EVDS, fire extinguishers and inflatable lifejackets all have dates that matter.

Lifejackets must be AS 4758 or ISO 12402 approved and suited to the wearer''s weight. Level 100-and-above jackets are required on registrable vessels and give the highest buoyancy, with head and neck support and a face-up floating position. Level 50 and 50S jackets are approved for non-registrable vessels, PWCs and sailboards, but don''t have head and neck support. Wearing requirements (not just carrying) apply in specific situations — smaller vessels, children under 12, and anyone on a PWC — so check the wearing table for your vessel and waters. Practise putting a lifejacket on in the dark and in the water occasionally: it''s harder than you''d think.', null, 1);
  select id into v_module_id from modules where sort_order = 7;
  if v_module_id is null then raise exception 'module sort_order % not found', 7; end if;
  insert into lessons (module_id, title, content, video_url, sort_order) values (v_module_id, 'Flares, EVDS and distress beacons', 'If you operate in unprotected waters (beyond 400 metres from shore), you must carry visual distress signals: either two hand-held red flares plus two hand-held orange flares, or an electronic visual distress signal (EVDS) carried instead, provided you also carry a GPS-enabled EPIRB or PLB. Orange smoke flares are day-only and burn about 60 seconds; red hand-held flares work day or night and burn about 45 seconds with a sighting range of several kilometres at night; EVDS units last far longer (around 20 hours) but are only meant to help rescuers home in once they''re already close to an EPIRB or PLB signal.

A distress beacon — a GPS-enabled EPIRB or PLB — is required beyond 400 metres from shore. EPIRBs are designed to float and operate for at least 48 hours; PLBs must be worn by a person on board and operate for a minimum of 24 hours. Both must be registered with AMSA (free and simple online), and you should be able to show proof of registration if asked. If either is accidentally activated, turn it off immediately and notify AMSA, WA Water Police, or your local marine rescue group.

Never use a flare or beacon except in a genuine emergency — false distress signals carry severe penalties and can tie up rescue resources needed elsewhere.', null, 2);
  select id into v_module_id from modules where sort_order = 7;
  if v_module_id is null then raise exception 'module sort_order % not found', 7; end if;
  insert into lessons (module_id, title, content, video_url, sort_order) values (v_module_id, 'Marine radios and making a distress call', 'A marine radio is essential safety equipment, and it''s required if you go more than 4 nautical miles from shore in unprotected waters — a mobile phone is a useful backup but cannot replace it, partly because other vessels can''t hear a phone call and partly because a radio is far easier for search and rescue to locate. VHF is the most common choice: the emergency and calling channel is 16, with channel 67 as a supplementary distress channel.

There are three levels of urgency in radio calls. "Mayday" is used only when a vessel is in grave and imminent danger and needs immediate assistance — state your position, your problem, and the number of people on board (the "3 Ps"), repeating until answered. "Pan Pan" is used when the situation is urgent but not immediately life-threatening — a mechanical breakdown or a medical issue, for example. "Securite" (say-cure-i-tay) is used to broadcast an important safety or navigational warning, not a personal emergency.

Logging on and off with a marine rescue group, or telling a responsible person your plans, is genuinely one of the most important safety habits you can build — it''s serious enough that it''s tested in the practical assessment. Give them the vessel''s details, your departure time and location, destination, trip intentions, number of people aboard, fuel carried, and your estimated time of return — then make sure you actually contact them again when you''re back, so a search doesn''t get triggered unnecessarily.', null, 3);
  select id into v_module_id from modules where sort_order = 7;
  if v_module_id is null then raise exception 'module sort_order % not found', 7; end if;
  insert into lessons (module_id, title, content, video_url, sort_order) values (v_module_id, 'Bailers, fire extinguishers and anchors', 'A bailer or bilge pump isn''t legally required, but it''s recommended for every vessel — even a bucket with two metres of rope attached is a genuinely useful piece of safety gear, for bailing and for fighting small fires. If you fit an electric bilge pump, it should have an indicator showing when it''s running, and its intake should be protected by a strainer to stop it clogging.

Fire extinguishers aren''t mandatory either, but they''re recommended for any vessel with an inboard engine or cooking, heating or cooling equipment that uses flame. Dry powder is the most common all-round type. Check the extinguisher''s gauge is in the green, and give a dry powder extinguisher an occasional shake to stop the powder compacting inside.

An anchor and enough line to suit the depths you operate in is also recommended. The choice of anchor design is up to you (Danforth, plough, admiralty pattern and others all have their strengths), but the rule of thumb for how much line to pay out — the "scope" — is at least five times the water depth in calm conditions, more like seven to nine times in fresh or moderate conditions. Anchoring is prohibited in channels, near submarine cables, and is discouraged in mooring areas where you could foul other vessels'' ground tackle.', null, 4);
  select id into v_module_id from modules where sort_order = 8;
  if v_module_id is null then raise exception 'module sort_order % not found', 8; end if;
  insert into lessons (module_id, title, content, video_url, sort_order) values (v_module_id, 'Trip planning: vessel, fuel and crew', 'Good planning starts before you leave the ramp. Make sure your vessel is actually suitable for the trip you have in mind — not every hull, size and design is meant for open, exposed water — and run through your usual pre-trip motor checks.

Fuel planning follows a simple rule: carry about 50% more fuel than you expect to use, split as 25% for the trip out, 25% for the return, and 50% held in reserve. Work out your vessel''s fuel consumption in litres per hour by dividing litres used by hours run on a typical trip, then multiply that rate by your planned voyage time to get a baseline figure — then add the safety margin on top.

Passengers and crew need consideration too: has everyone been on this kind of trip before, is it appropriate for their age, is anyone prone to seasickness, and does anyone have a medical condition you should know about? Give everyone a safety briefing covering what to do in an emergency, what safety equipment is carried, where it''s stowed, and how it works. Pack for the conditions — it''s always colder on the water than it looks from shore — and carry more fresh water than you think you''ll need, since dehydration compounds every other problem.', null, 1);
  select id into v_module_id from modules where sort_order = 8;
  if v_module_id is null then raise exception 'module sort_order % not found', 8; end if;
  insert into lessons (module_id, title, content, video_url, sort_order) values (v_module_id, 'Stability and loading your vessel', 'Stability is how readily your vessel returns upright after being pushed over by wind, waves or shifting weight. The key concept is the centre of gravity (G) — the balance point of the vessel, its load and crew combined. Move weight up (say, people climbing onto a flybridge) and G rises, making the vessel more "tender" — slow to return upright and more prone to capsizing. Move weight down and G drops, making the vessel "stiffer" and more stable, though a very stiff vessel can also be an uncomfortable, jerky ride.

Warning signs of an unstable vessel include a long, slow roll and reluctance to return upright — different from a list, which is simply leaning because weight is unevenly distributed on one side. If you notice these signs, the fix is to lower G by moving weight down and, ideally, reducing total load.

Correct loading matters just as much: keep your total load within the vessel''s rated capacity (check the Australian Builders Plate if fitted), stow heavy items low and evenly, and secure anything that could shift — loose scuba cylinders, for example, are heavy enough to cause real damage if they roll around. Water sloshing around inside the hull (free surface effect) can also seriously undermine stability, out of proportion to how much water is actually there, so keep bilges dry.

For vessels without an ABP or capacity guide, a rough rule is: 2 people for vessels under 3 metres, rising to about 7 people for a 5.5–6 metre vessel — adjusted down in poor conditions or when carrying more gear.', null, 2);
  select id into v_module_id from modules where sort_order = 8;
  if v_module_id is null then raise exception 'module sort_order % not found', 8; end if;
  insert into lessons (module_id, title, content, video_url, sort_order) values (v_module_id, 'Weather, tides and reading the conditions', 'Before any trip, the Bureau of Meteorology recommends five checks: current warnings for your area, conditions affecting navigation and comfort, wind trends, wave conditions, and the timing of the next high and low tide. The Bureau''s website and MarineLite pages are the most current sources; VHF channels 16 and 67, and various HF frequencies, carry scheduled broadcasts too.

Learn to read a synoptic (weather map) chart in broad strokes: isobars packed close together mean stronger wind, and systems rotate clockwise around lows and anti-clockwise around highs in the southern hemisphere. Watch for squalls (sudden wind increases, often with a direction change, that die away again) and gusts (brief spikes 30–40% above the average). Strong wind warnings cover 25–33 knots, gale warnings 34–47 knots, and storm warnings 48 knots or more — no vessel should be at sea within several hundred nautical miles of a cyclone.

Out on the water, keep watching for signs the forecast might be wrong: dropping temperature, a rising swell, cloud building up, a falling barometer, or a wind shift. If conditions turn, have a backup plan — moving inside a river, reef or island system rather than pushing on outside — and don''t hesitate to put lifejackets on early if things are deteriorating.

Tides matter for both navigation and simply getting your boat off the ramp, especially in areas with a big tidal range. Chart depths are measured from "chart datum" — roughly the lowest water level the tide is likely to fall to — so your actual depth at any time is the charted depth plus the tide height at that moment. Strong or prolonged wind, and low or high pressure systems, can also push the actual tide away from the predicted figures.', null, 3);
  select id into v_module_id from modules where sort_order = 9;
  if v_module_id is null then raise exception 'module sort_order % not found', 9; end if;
  insert into lessons (module_id, title, content, video_url, sort_order) values (v_module_id, 'Capsize, sinking and grounding', 'Capsizing is a leading cause of boating deaths, and it''s usually driven by a combination of factors: overloading or poor load distribution, broaching in a following sea, free surface effect from water sloshing in the hull, poor driving technique, being caught by breaking waves near a reef, or wind and waves pushing from one side while people are, say, hauling craypots.

If your vessel capsizes, the priority is safety, not the boat. If you can, right the vessel and bail it out — genuinely difficult with a larger boat — but if you can''t, get as much of everyone as possible up onto the hull rather than staying in the water, which helps conserve body heat. Stay with the vessel; it''s far easier to spot from the air or from a rescuing vessel than a person alone in the water, and don''t attempt to swim ashore unless it''s very close and clearly safe to land.

Most trailer boats have flotation and rarely sink outright, but larger vessels without flotation can go down quickly, so keep essentials — lifejackets, an emergency kit — quickly accessible. Before abandoning a sinking vessel, try to send a Mayday and activate your EPIRB, and don''t remove clothing — if anything, put more on.

Running aground is common and usually avoidable. If it happens, check on your passengers first, then assess the damage: is the vessel leaking, and if it''s outboard or stern-drive powered, can you lift the leg to check the propeller? The best prevention is simply knowing your planned route, using a chart, understanding what the navigation marks mean, and slowing down whenever you''re unsure of your position or a mark''s identity.', null, 1);
  select id into v_module_id from modules where sort_order = 9;
  if v_module_id is null then raise exception 'module sort_order % not found', 9; end if;
  insert into lessons (module_id, title, content, video_url, sort_order) values (v_module_id, 'Fire and breakdown', 'Fire prevention beats firefighting every time. LP gas and petrol fires are especially dangerous because they''re essentially explosions rather than ordinary fires. The most common causes are overheated galley equipment, faulty wiring, poor engine-room housekeeping (rags near hot exhaust components), leaking fuel or gas lines, and poor refuelling technique — which is exactly why the refuelling precautions in the Rules and Regulations module matter.

If a fire does start: raise the alarm and do a head count, make a radio call or use your EPIRB/PLB if needed, get someone in charge of the safety gear, close off any enclosed space to starve the fire of air, cut fuel and gas lines, and fight the fire with an extinguisher, fire blanket, water buckets, or by throwing burning items overboard if that''s genuinely the safest option. Keep watching the area even after a fire appears out — they can restart.

Breakdowns are far more often the motor simply refusing to start than anything failing mid-run. A basic troubleshooting routine covers the kill switch, fuel supply, air vents, fuel lines, priming bulb, choke, carburettor air intake, cranking speed and battery connections, spark plugs and fuses. If you can''t get the motor going again, anchor if you can to hold your position bow-into-the-sea, and call marine rescue — a breakdown alone isn''t normally a Mayday or Pan Pan situation unless you''re drifting into danger.', null, 2);
  select id into v_module_id from modules where sort_order = 9;
  if v_module_id is null then raise exception 'module sort_order % not found', 9; end if;
  insert into lessons (module_id, title, content, video_url, sort_order) values (v_module_id, 'First aid, seasickness and hypothermia', 'A vessel brings together knives, fishing gear, marine stingers and engine spaces — plenty of ways to get hurt — so a first aid course and a well-stocked, waterproof, clearly marked first aid kit are worth having. Seasickness is best managed preventatively: take any regular medication on time, avoid greasy food and alcohol before and during the trip, sit low and near the stern (the most stable part of the vessel), and stay in the open air. If it strikes anyway, getting underway again often helps more than sitting still, and keep sipping water to avoid dehydration.

Hypothermia is a serious, life-threatening drop in core body temperature, made worse and faster by cold water immersion and wet clothing. Watch for a drowsy, cold-to-touch presentation, a faint or slow pulse, shallow breathing, confusion or slurred speech, and dilated pupils.

If someone is in the water, getting them out — or at least partly out, by climbing onto a capsized hull — helps enormously, since a lifejacket alone only slows heat loss. Two positions help conserve heat while waiting for rescue: HELP (Heat Escape Lessening Position), where an individual draws their legs up and arms in tight to the chest; and the Huddle, where a group clusters together, chest to chest, arms around each other.

Treating hypothermia means preventing further heat loss and gradually rewarming: get the person out of the cold, protect them from wind, remove wet clothing if practical, and warm them with dry blankets or skin-to-skin contact — focusing on the head, neck, chest and groin rather than rubbing or massaging the limbs. Don''t give alcohol, don''t let them walk around, and get medical help as soon as you can.', null, 3);
  select id into v_module_id from modules where sort_order = 10;
  if v_module_id is null then raise exception 'module sort_order % not found', 10; end if;
  insert into lessons (module_id, title, content, video_url, sort_order) values (v_module_id, 'What to expect on assessment day', 'The practical assessment is done on the water with an approved RST assessor and takes around 30 minutes, though it can run longer if several people are being assessed together. You''ll skipper the vessel while the assessor watches and gives you directions — dock here, simulate a man overboard there — but you''re still the skipper throughout, so if you believe a manoeuvre the assessor suggests is unsafe, you should not attempt it.

You need to successfully demonstrate at least 56 of the 62 assessment criteria — six or fewer wrong is a pass. If you fail to demonstrate more than six criteria, the assessment stops and you''ll need to book another attempt on another day. At any point, unsafe skippering that puts the vessel, passengers or other water users at immediate risk results in instant failure.

If you don''t understand an instruction, say so — the assessor can repeat it, though they can''t coach you on how to skipper once the assessment has started. You''ll get feedback at the end regardless of the result, which is genuinely useful for improving your skippering. You can use a vessel supplied by your assessor, or your own registered recreational vessel, provided it complies with the WA Marine Act 1982 and can perform all the required tasks.', null, 1);
  select id into v_module_id from modules where sort_order = 10;
  if v_module_id is null then raise exception 'module sort_order % not found', 10; end if;
  insert into lessons (module_id, title, content, video_url, sort_order) values (v_module_id, 'The eleven tasks, in brief', 'The assessment covers eleven tasks, most of which map directly onto everyday, sensible boating practice rather than anything exotic. Task 1 (operating safely within the rules) is assessed continuously throughout, rather than as a standalone step.

You''ll be asked to: check your mooring or berthing lines and equipment and secure the vessel (Task 2); give a safety briefing covering the required safety equipment and wearing rules, and confirm everyone understood it (Task 3); run through pre-start checks and start the motor safely (Task 4); log a voyage plan with a responsible person, covering the vessel''s details, departure time and place, destination, intentions, people aboard, fuel carried, and expected return time (Task 5); depart a berth safely, allowing for wind and current (Task 6); recover a simulated person overboard (Task 7); fix your position using a transit — two landmarks lined up — and hold a course along it for 30 seconds (Task 8); bring the vessel to a controlled stop from about 5 knots within two boat lengths (Task 9); navigate back to a berth and secure the vessel alongside it (Task 10); and finally, log off with your responsible person to confirm you''ve returned safely (Task 11).

None of this is about split-second reflexes — it''s about demonstrating that you plan ahead, communicate clearly, and handle the vessel with the same steady attention you''d give to driving a car.', null, 2);
  select id into v_module_id from modules where sort_order = 11;
  if v_module_id is null then raise exception 'module sort_order % not found', 11; end if;
  insert into lessons (module_id, title, content, video_url, sort_order) values (v_module_id, 'About the mock assessment', 'The mock assessment draws a full-length practice exam from the same question bank used throughout your modules, mixing questions from all eight theory categories: rules and regulations, collision avoidance, navigation lights, IALA buoyage, maintenance, safety equipment, safe operations, and emergencies.

It''s designed to give you a realistic feel for the real thing — including the same 34-out-of-40 pass mark used in the actual DTMI theory assessment — so you can gauge whether you''re genuinely ready to book your assessment, or whether there are a few topics worth another look first. Use your results here as a guide for where to focus your remaining study, not as a guarantee of how the real assessment will go — question wording and difficulty will differ.', null, 1);
  select id into v_module_id from modules where sort_order = 2;
  if v_module_id is null then raise exception 'module sort_order % not found', 2; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'When operating a motor boat near a person in the water, the maximum speed you must not exceed within 50 metres is:', '4 knots', '6 knots', '8 knots', '10 knots', 'c', 'normal');
  select id into v_module_id from modules where sort_order = 2;
  if v_module_id is null then raise exception 'module sort_order % not found', 2; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'Within 15 metres of a vessel that is underway, what is the maximum speed limit?', '4 knots', '7 knots', '8 knots', '10 knots', 'c', 'normal');
  select id into v_module_id from modules where sort_order = 2;
  if v_module_id is null then raise exception 'module sort_order % not found', 2; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'What is the maximum speed limit within a mooring area or boat haven?', '4 knots', '7 knots', '8 knots', '10 knots', 'c', 'normal');
  select id into v_module_id from modules where sort_order = 2;
  if v_module_id is null then raise exception 'module sort_order % not found', 2; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'Which of the following boating accidents must be reported to authorities?', 'All accidents, no matter how minor.', 'Only accidents involving motor boats or water skiers.', 'Accidents resulting in serious injury or death, or that leave the vessel unseaworthy or unsafe.', 'Only accidents involving property damage over $1,000.', 'c', 'normal');
  select id into v_module_id from modules where sort_order = 2;
  if v_module_id is null then raise exception 'module sort_order % not found', 2; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'Which vessels are generally required to be registered?', 'Only vessels fitted with an engine of 5 hp or more.', 'All recreational vessels that are, or can be, fitted with an engine, other than a tender.', 'All recreational vessels over 3.1 metres fitted with an engine.', 'No vessels are required to be registered.', 'b', 'normal');
  select id into v_module_id from modules where sort_order = 2;
  if v_module_id is null then raise exception 'module sort_order % not found', 2; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'A dive flag (a white flag with a diagonal blue stripe) seen on the water means:', 'Dangerous cargo is on board — keep well away.', 'A diver is below — keep 50 metres clear, or travel at the slowest possible speed with a good lookout for people in the water.', 'Shallow water ahead — proceed with caution.', 'A vessel is aground — keep clear.', 'b', 'normal');
  select id into v_module_id from modules where sort_order = 2;
  if v_module_id is null then raise exception 'module sort_order % not found', 2; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'An RST entitles the holder to skipper:', 'Vessels under 8 metres in length only.', 'All recreational vessels.', 'All commercial vessels.', 'All recreational and commercial vessels.', 'b', 'normal');
  select id into v_module_id from modules where sort_order = 2;
  if v_module_id is null then raise exception 'module sort_order % not found', 2; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'Within 50 metres of a jetty, wharf or the shore, the maximum speed limit is:', '8 knots', '6 knots', '10 knots', 'There is no speed limit.', 'a', 'normal');
  select id into v_module_id from modules where sort_order = 2;
  if v_module_id is null then raise exception 'module sort_order % not found', 2; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'An RST holder under the age of 16 is restricted to operating a vessel:', 'That is less than 4 metres in length.', 'With a motor under 6 hp.', 'During daylight hours and at a speed of less than 8 knots.', 'All of the above.', 'c', 'normal');
  select id into v_module_id from modules where sort_order = 3;
  if v_module_id is null then raise exception 'module sort_order % not found', 3; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'You have right of way and an approaching motor boat doesn''t seem to be taking action to prevent a collision. What should you do?', 'Speed up so you can get past in time.', 'Exercise caution and take whatever avoiding action is necessary.', 'Maintain your course and speed because you have right of way.', 'Let off an internationally recognised distress signal.', 'b', 'normal');
  select id into v_module_id from modules where sort_order = 3;
  if v_module_id is null then raise exception 'module sort_order % not found', 3; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'What does keeping a good lookout actually involve?', 'Looking straight ahead.', 'Looking forward and to each side.', 'Looking behind you.', 'Using sight, hearing and all other available means.', 'd', 'normal');
  select id into v_module_id from modules where sort_order = 3;
  if v_module_id is null then raise exception 'module sort_order % not found', 3; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'You are overtaking another vessel. What must you do?', 'Overtake on the starboard (right) side only.', 'Overtake on the port (left) side only.', 'Keep well clear of the vessel you are overtaking, on either side.', 'No special action is required.', 'c', 'normal');
  select id into v_module_id from modules where sort_order = 3;
  if v_module_id is null then raise exception 'module sort_order % not found', 3; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'When travelling upstream in a narrow channel or river, where should you keep your vessel?', 'On the port (left-hand) side.', 'On the starboard (right-hand) side.', 'In the middle of the channel.', 'On either side, whichever is safe.', 'b', 'normal');
  select id into v_module_id from modules where sort_order = 3;
  if v_module_id is null then raise exception 'module sort_order % not found', 3; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'What sound signal means ''I am operating astern propulsion''?', 'Three short blasts.', 'Two short blasts.', 'One short blast.', 'One prolonged blast.', 'a', 'normal');
  select id into v_module_id from modules where sort_order = 3;
  if v_module_id is null then raise exception 'module sort_order % not found', 3; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'Two vessels are approaching each other as shown, one directly ahead and slightly to the right of the other. Which vessel must give way?', 'The vessel with the other boat on its starboard (right) side.', 'The vessel with the other boat on its port (left) side.', 'Neither — they should both hold course until one gives way.', 'Whichever vessel is travelling faster.', 'a', 'normal');
  select id into v_module_id from modules where sort_order = 4;
  if v_module_id is null then raise exception 'module sort_order % not found', 4; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'What lights are required on a motor boat under 12 metres in length when underway at night or in reduced visibility?', 'Sidelights and a green masthead light.', 'Two all-round white lights.', 'Red and green sidelights only, with no other light.', 'Red and green sidelights, plus either an all-round white light or a masthead light and stern light.', 'd', 'normal');
  select id into v_module_id from modules where sort_order = 5;
  if v_module_id is null then raise exception 'module sort_order % not found', 5; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'What kind of navigation mark has two black spheres, one above the other, as its topmark?', 'A port lateral mark.', 'A starboard lateral mark.', 'A safe water mark.', 'An isolated danger mark.', 'd', 'normal');
  select id into v_module_id from modules where sort_order = 5;
  if v_module_id is null then raise exception 'module sort_order % not found', 5; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'A cardinal mark has lost its topmark. The colour bands on the pole, from top to bottom, are black, yellow, black. What type of cardinal mark is it?', 'West cardinal.', 'East cardinal.', 'North cardinal.', 'South cardinal.', 'b', 'normal');
  select id into v_module_id from modules where sort_order = 6;
  if v_module_id is null then raise exception 'module sort_order % not found', 6; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'How often should the motor on your vessel be serviced?', 'Before each time you use the vessel.', 'Every four months.', 'At least once a year.', 'Once every two years.', 'c', 'normal');
  select id into v_module_id from modules where sort_order = 6;
  if v_module_id is null then raise exception 'module sort_order % not found', 6; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'Before you go on a boating trip, you should:', 'Test navigation lights.', 'Check bilges are clean and dry.', 'Check steering.', 'All of the above.', 'd', 'easy');
  select id into v_module_id from modules where sort_order = 6;
  if v_module_id is null then raise exception 'module sort_order % not found', 6; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'Why should you replace old fuel after a long period of inactivity?', 'Your vessel won''t reach top speed.', 'The oil will settle on the bottom of the tank.', 'The octane level will reduce over time.', 'Water is likely to have built up in it.', 'd', 'normal');
  select id into v_module_id from modules where sort_order = 6;
  if v_module_id is null then raise exception 'module sort_order % not found', 6; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'Where should batteries in a vessel be located?', 'In a ventilated container.', 'In a sealed container.', 'As low as possible in the bilge.', 'On deck, exposed to the elements.', 'a', 'normal');
  select id into v_module_id from modules where sort_order = 6;
  if v_module_id is null then raise exception 'module sort_order % not found', 6; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'If your vessel is fitted with an LP gas system, how often should it be serviced?', 'Before each trip.', 'After each trip.', 'Monthly.', 'Yearly.', 'd', 'normal');
  select id into v_module_id from modules where sort_order = 7;
  if v_module_id is null then raise exception 'module sort_order % not found', 7; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'Where should safety equipment such as flares, EVDS and lifejackets be stowed on a vessel?', 'In readily accessible positions, protected from the sea and weather.', 'In locked compartments.', 'Away from passengers, so they can''t accidentally damage them.', 'Anywhere on board — location doesn''t matter.', 'a', 'normal');
  select id into v_module_id from modules where sort_order = 7;
  if v_module_id is null then raise exception 'module sort_order % not found', 7; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'What safety equipment MUST be carried on a registrable vessel operating in unprotected waters, more than 4 nautical miles from the coast?', 'Two orange and two red hand-held flares, or EVDS.', 'A GPS-enabled EPIRB or PLB.', 'An HF or VHF marine radio.', 'All of the above.', 'd', 'hard');
  select id into v_module_id from modules where sort_order = 7;
  if v_module_id is null then raise exception 'module sort_order % not found', 7; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'Fire extinguishers are recommended to be carried on vessels that:', 'Are propelled by an inboard motor, or have cooking, heating or cooling equipment that uses flame.', 'Are propelled by an outboard motor.', 'Do not carry a fire blanket.', 'Are propelled by an electric motor.', 'a', 'normal');
  select id into v_module_id from modules where sort_order = 7;
  if v_module_id is null then raise exception 'module sort_order % not found', 7; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'When anchoring a vessel, you should consider:', 'The length of anchor line you''ll need.', 'How close other vessels are.', 'Whether the vessel might drift.', 'All of the above.', 'd', 'easy');
  select id into v_module_id from modules where sort_order = 7;
  if v_module_id is null then raise exception 'module sort_order % not found', 7; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'How many lifejackets must be carried on board a registrable vessel in unprotected waters?', 'One for each person on board.', 'Four.', 'Six.', 'At least one.', 'a', 'normal');
  select id into v_module_id from modules where sort_order = 7;
  if v_module_id is null then raise exception 'module sort_order % not found', 7; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'Other than using your radio in a distress situation, what is the most effective way of attracting attention at night?', 'Waving your arms up and down.', 'Letting off an orange smoke flare.', 'Using an EVDS or a red hand-held flare.', 'All of the above are equally effective.', 'c', 'normal');
  select id into v_module_id from modules where sort_order = 7;
  if v_module_id is null then raise exception 'module sort_order % not found', 7; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'When should you activate your EPIRB or PLB?', 'As soon as the motor cuts out and won''t restart.', 'Only where human life is in grave and imminent danger.', 'Any time you run out of fuel.', 'All of the above.', 'b', 'hard');
  select id into v_module_id from modules where sort_order = 7;
  if v_module_id is null then raise exception 'module sort_order % not found', 7; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'When must an approved marine band radio be carried?', 'On all vessels, on all waters.', 'On all registrable vessels operating beyond 4 nautical miles from shore.', 'On all non-registrable vessels operating beyond 4 nautical miles from shore.', 'On all vessels operating in unprotected waters, regardless of distance.', 'b', 'normal');
  select id into v_module_id from modules where sort_order = 7;
  if v_module_id is null then raise exception 'module sort_order % not found', 7; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'What do the words ''Pan Pan'' indicate when said at the start of a radio message?', 'A very urgent message follows, concerning the safety of a vessel or person, but it is not a grave and imminent danger.', 'A vessel is in grave and imminent danger.', 'An important navigational warning is about to be announced.', 'All of the above.', 'a', 'normal');
  select id into v_module_id from modules where sort_order = 8;
  if v_module_id is null then raise exception 'module sort_order % not found', 8; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'As part of your trip plan you should ensure:', 'Your vessel is suitable for the trip.', 'The weather and tides are favourable.', 'All your safety gear and extras are on board, in good shape and within reach.', 'All of the above.', 'd', 'easy');
  select id into v_module_id from modules where sort_order = 8;
  if v_module_id is null then raise exception 'module sort_order % not found', 8; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'How much additional fuel is recommended to carry for a boating trip, over and above what you expect to use?', '10% more than you expect to use.', '20% more than you expect to use.', '50% more than you expect to use.', '100% more than you expect to use.', 'c', 'normal');
  select id into v_module_id from modules where sort_order = 8;
  if v_module_id is null then raise exception 'module sort_order % not found', 8; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'Which is the most up-to-date source of weather forecasts?', 'The Bureau of Meteorology.', 'The newspaper.', 'Last night''s television news.', 'AM/FM radio.', 'a', 'easy');
  select id into v_module_id from modules where sort_order = 8;
  if v_module_id is null then raise exception 'module sort_order % not found', 8; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'Which wind warning indicates the average wind speed is expected to be 25 to 33 knots?', 'Strong wind warning.', 'Gale warning.', 'Storm warning.', 'Sea breeze.', 'a', 'normal');
  select id into v_module_id from modules where sort_order = 8;
  if v_module_id is null then raise exception 'module sort_order % not found', 8; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'Before undertaking a recreational boating trip, when should you tell relatives, friends or local authorities your travel plans and estimated arrival or return time?', 'Only when bad weather is forecast.', 'Only if travelling overnight.', 'On every occasion.', 'Only when going boating alone.', 'c', 'easy');
  select id into v_module_id from modules where sort_order = 8;
  if v_module_id is null then raise exception 'module sort_order % not found', 8; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'When loading your vessel with passengers and equipment for a day''s outing, you should:', 'Distribute the load evenly in the vessel.', 'Ensure adequate freeboard for the conditions and any unexpected deterioration in weather.', 'Keep passenger numbers within the recommended limit.', 'All of the above.', 'd', 'normal');
  select id into v_module_id from modules where sort_order = 8;
  if v_module_id is null then raise exception 'module sort_order % not found', 8; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'If a vessel fills with water and has basic flotation, it will:', 'Sink straight away.', 'Have enough flotation to prevent the vessel and its maximum load from sinking.', 'Take three hours to sink.', 'Stay well above the water.', 'b', 'normal');
  select id into v_module_id from modules where sort_order = 8;
  if v_module_id is null then raise exception 'module sort_order % not found', 8; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'In the southern hemisphere, a low pressure system rotates in which direction?', 'Clockwise.', 'Anti-clockwise.', 'Always north.', 'Vertically.', 'b', 'hard');
  select id into v_module_id from modules where sort_order = 8;
  if v_module_id is null then raise exception 'module sort_order % not found', 8; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'Which of the following can be a sign of approaching bad weather?', 'A wind shift.', 'An increase in swell.', 'Cloud building up.', 'All of the above.', 'd', 'easy');
  select id into v_module_id from modules where sort_order = 9;
  if v_module_id is null then raise exception 'module sort_order % not found', 9; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'Your vessel capsizes 4 nautical miles from the mainland shore. In most circumstances, it is best to:', 'Swim away from the vessel.', 'Try swimming to the shore as a group.', 'Send the strongest swimmer to get help.', 'Stay with the vessel.', 'd', 'normal');
  select id into v_module_id from modules where sort_order = 9;
  if v_module_id is null then raise exception 'module sort_order % not found', 9; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'Most vessel groundings can be avoided by:', 'Planning your trips using a chart.', 'Knowing what navigation marks look like and mean.', 'Slowing down if you are unsure of a situation.', 'All of the above.', 'd', 'easy');
  select id into v_module_id from modules where sort_order = 9;
  if v_module_id is null then raise exception 'module sort_order % not found', 9; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'You are out in a motor boat in calm weather and the motor cuts out unexpectedly. What should you do first?', 'Fire flares.', 'Radio Mayday.', 'Drop the anchor and assess your options.', 'Swim for shore.', 'c', 'normal');
  select id into v_module_id from modules where sort_order = 9;
  if v_module_id is null then raise exception 'module sort_order % not found', 9; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'Fuel vapour will not leave a compartment without assistance because:', 'Fuel vapour is the same weight as air.', 'Fuel vapour is lighter than air.', 'Fuel vapour is heavier than air.', 'All of the above.', 'c', 'hard');
  select id into v_module_id from modules where sort_order = 9;
  if v_module_id is null then raise exception 'module sort_order % not found', 9; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'After a period of being exposed to cold water, the most likely effect on the body will be:', 'Hunger.', 'Hypothermia.', 'Dehydration.', 'Thirst.', 'b', 'normal');
  select id into v_module_id from modules where sort_order = 9;
  if v_module_id is null then raise exception 'module sort_order % not found', 9; end if;
  insert into questions (module_id, question_text, answer_a, answer_b, answer_c, answer_d, correct_answer, difficulty) values (v_module_id, 'Who is responsible for the safety of everyone on board a recreational vessel?', 'The owner or their representative.', 'The most experienced person on board.', 'Any qualified person.', 'The skipper.', 'd', 'easy');
end $$;
