-- Request Callback button, requested by Scott 18 September 2026. The
-- homepage's "Request Callback" button had no function — it just linked to
-- /faq. It now opens a small name/mobile form (RequestCallbackForm.tsx)
-- that posts to /api/callback-request, which logs the lead here and texts
-- Scott directly via ClickSend (src/lib/sms.ts) so he finds out right away
-- instead of having to check a dashboard.
--
-- enquiries.email has been required since 0001_core_schema.sql, but a
-- callback request deliberately only collects a name and mobile number —
-- the whole point is "call me", not "fill out a form" — so it never has an
-- email to store. Making the column nullable lets this reuse the existing
-- (until now unused) enquiries table rather than adding a near-duplicate
-- one just for this.
--
-- Run after 0001-0011.

alter table enquiries
  alter column email drop not null;

comment on column enquiries.email is
  'Nullable since 0012_callback_requests.sql: a callback_request enquiry (see /api/callback-request) only collects a mobile number, not email.';
