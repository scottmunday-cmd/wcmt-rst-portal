-- Calendar-based assessment booking. Requested by Scott 12 September 2026:
-- students were picking a location off a plain dropdown with no idea
-- whether Scott could actually get there any time soon. The schema for a
-- proper date+location booking system was already sitting unused in
-- 0001_core_schema.sql (assessment_slots/assessment_bookings, with a
-- capacity trigger already enforcing no overbooking) — nothing had ever
-- been built on top of it. This migration wires it up:
--   * products.requires_slot marks which product now goes through the
--     slot calendar instead of the plain location dropdown (assessment
--     only — private-tuition keeps the existing dropdown-and-pay flow).
--   * orders.assessment_slot_id records which slot an order paid for.
--   * assessment_bookings.order_id links a reserved seat back to the
--     order that reserved it, so a cancelled/expired checkout can release
--     the seat again (see src/app/api/checkout/route.ts,
--     src/app/(marketing)/checkout/cancel/page.tsx, and the
--     checkout.session.expired handler in the Stripe webhook).
--   * assessment_slots/assessment_locations write access widens from
--     admin-only to instructor-or-admin, so Scott can manage the
--     schedule from the Instructor Portal ("instruction mode") without
--     needing an admin-role account.
--
-- Run after 0001-0008.

alter table products
  add column requires_slot boolean not null default false;

update products set requires_slot = true where slug = 'assessment';

comment on column products.requires_slot is
  'True if booking this product means picking a specific assessment_slots row (date + location + capacity) via the booking calendar, rather than just any active location. Currently only the in-person assessment.';

alter table orders
  add column assessment_slot_id uuid references assessment_slots(id) on delete set null;

comment on column orders.assessment_slot_id is
  'Which assessment_slots row this order reserved a seat in, for requires_slot products. Null for orders that aren''t slot-based.';

alter table assessment_bookings
  add column order_id uuid references orders(id) on delete set null;

comment on column assessment_bookings.order_id is
  'The order that reserved this seat, so a cancelled/expired/failed checkout can release it again (set this booking to ''cancelled'', which the fn_book_assessment_slot trigger uses to free the slot''s capacity). Null for bookings created some other way.';

create index idx_assessment_bookings_order on assessment_bookings(order_id);

-- Widen schedule management from admin-only to instructor-or-admin, so
-- Scott can add/retire dates and locations from the Instructor Portal.
-- is_instructor() already returns true for the admin role too (see
-- 0002_rls_policies.sql), so this only ever adds access, never removes it.
drop policy if exists "assessment_slots_admin_write" on assessment_slots;
create policy "assessment_slots_instructor_write" on assessment_slots
  for all using (is_instructor());

drop policy if exists "assessment_locations_admin_write" on assessment_locations;
create policy "assessment_locations_instructor_write" on assessment_locations
  for all using (is_instructor());
