-- Owner booking-alert SMS, requested by Scott 19 September 2026 — he had
-- no way to know a student had booked/paid other than manually checking
-- the Bookings page. Reuses the exact same sendSms()/sms_templates
-- machinery as the existing student-facing booking_confirmation and
-- assessment_reminder_48h texts (see 0011_sms_reminders.sql) and the
-- OWNER_MOBILE_NUMBER env var already added for /api/callback-request
-- (0012_callback_requests.sql) — no new configuration needed if that's
-- already set.
--
-- This is a genuinely separate concern from booking_confirmation: that one
-- is gated on the STUDENT's own sms_consent (it's a text to their phone);
-- this one goes to Scott regardless of the student's consent, because it's
-- Scott's own business notification, not a marketing/reminder text to a
-- customer. See the Stripe webhook's checkout.session.completed handler
-- for where this fires.
--
-- Run after 0001-0012.

insert into sms_templates (template_name, message_body, active) values
  (
    'owner_new_booking',
    'New booking: {{student_name}} just paid for {{product_name}}. {{details}}',
    true
  )
on conflict (template_name) do nothing;
