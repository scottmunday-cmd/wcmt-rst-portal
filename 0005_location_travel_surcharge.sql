-- Location-based travel surcharge. Settled with Scott 10 September 2026:
-- all Perth metro locations are the standard/home base (no surcharge).
-- Regional locations (e.g. Jurien Bay, Denham — some 800km+ away) cost
-- more, in steps of one adjustable "unit" amount (default $50) rather than
-- a fully custom dollar figure per location — so a location that's twice
-- as much hassle gets multiplier 2, three times as much gets 3, and so on.
-- Applies to both the In-Person Assessment and Private Tuition products;
-- Study & Reference Access is online-only and never location-priced.
--
-- Run after 0001-0004.

-- How many "surcharge units" extra a location costs on top of a product's
-- base price. 0 = standard/home base (Fremantle, Hillarys, Mandurah,
-- Rockingham, and the generic Mobile Assessment option all default to 0
-- here — update Mobile Assessment's multiplier, or add real regional
-- locations, once you know which ones you're actually planning to run).
alter table assessment_locations
  add column travel_surcharge_multiplier integer not null default 0
    check (travel_surcharge_multiplier >= 0);

-- The dollar value of one "unit" — change this one row any time and every
-- location's surcharge scales with it automatically, since locations only
-- store a multiplier, not a dollar amount.
insert into settings (setting_key, setting_value)
values ('travel_surcharge_unit_cents', '5000')
on conflict (setting_key) do nothing;

-- Records which location's surcharge (if any) applied to a given order,
-- so the charged amount in `orders.amount_cents` is always traceable back
-- to what set it. Null for orders that aren't location-priced (Study &
-- Reference Access, or historical orders from before this migration).
alter table orders
  add column assessment_location_id uuid references assessment_locations(id) on delete set null;

comment on column assessment_locations.travel_surcharge_multiplier is
  'Number of surcharge units added to a location-priced product''s base price for bookings at this location. 0 = standard/home base. Actual dollar amount = multiplier * settings.travel_surcharge_unit_cents.';
comment on column orders.assessment_location_id is
  'Which assessment_locations row (if any) this order''s price was based on. Set at checkout for location-priced products; null otherwise.';

-- Which products actually need a location picked at checkout (so the
-- surcharge can be applied). Study & Reference Access is online-only.
alter table products
  add column requires_location boolean not null default false;

update products set requires_location = true where slug in ('assessment', 'private-tuition');

comment on column products.requires_location is
  'True if this product''s price depends on an assessment_locations pick at checkout (travel surcharge applies). False for online-only products.';
