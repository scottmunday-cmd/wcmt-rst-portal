-- Settled with Scott 14 September 2026: Private Tuition moves from a flat
-- $500 rate to hourly — $150/hr with a 3-hour minimum. Checkout still
-- charges one fixed amount up front (it has no metered/variable-hours
-- concept), so price_cents becomes the 3-hour minimum ($450) rather than
-- the old flat $500; any hours beyond that are settled directly with the
-- instructor on the day, same as the existing travel surcharge is settled
-- through checkout but extra time isn't. The homepage pricing card
-- (src/app/(marketing)/page.tsx) special-cases slug = 'private-tuition' to
-- display "$150/hr" + "3-hour minimum ($450)" instead of this raw
-- price_cents figure, but price_cents itself must still be the correct
-- checkout amount (the 3-hour minimum) since /api/checkout charges it
-- directly via price_data.unit_amount — see that route's comments.
--
-- Location travel surcharge (0005_location_travel_surcharge.sql) is
-- unchanged and still applies on top for regional locations.

update products
set price_cents = 45000,
    description = 'One-on-one instruction for a tailored pace — $150/hour, 3-hour minimum charged at booking. Any additional time on the day is settled directly with your instructor.'
where slug = 'private-tuition';
