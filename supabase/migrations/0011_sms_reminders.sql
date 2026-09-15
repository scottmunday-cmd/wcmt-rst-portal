-- SMS reminders/booking confirmations, requested by Scott 15 September
-- 2026. The schema already had mobile/sms_consent on profiles and unused
-- sms_templates/sms_logs tables (see 0001_core_schema.sql) — nothing had
-- ever been built on top of them, and fn_handle_new_user() never actually
-- stored a mobile number even though the column existed (the register
-- form never collected one either — fixed separately in
-- src/app/(auth)/register/page.tsx, plus a new /settings page for
-- existing students to add theirs after the fact). This migration:
--   1. Updates fn_handle_new_user() to also store `mobile` from signup
--      metadata, alongside the fields it already stored.
--   2. Adds assessment_bookings.reminder_sent_at, so the 48-hours-before
--      reminder cron (src/app/api/cron/assessment-reminders/route.ts) has
--      an unambiguous per-booking flag to check/set — sms_logs alone
--      can't dedupe cleanly since it has no booking/slot reference.
--   3. Seeds the two message templates into sms_templates (booking
--      confirmation, 48h assessment reminder) with {{placeholders}} —
--      src/lib/sms.ts reads these rather than hardcoding the wording, so
--      Scott can reword them later the same way lesson content gets
--      updated (a SQL script run in the Supabase SQL editor), without
--      needing a code change. Falls back to a built-in default if a
--      template is ever missing/inactive.
--
-- Run after 0001-0010.

create or replace function fn_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name, mobile, sms_consent, consent_recorded_at)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.raw_user_meta_data ->> 'mobile',
    coalesce((new.raw_user_meta_data ->> 'sms_consent')::boolean, false),
    now()
  );

  insert into public.students (profile_id) values (new.id);

  return new;
end;
$$;

alter table assessment_bookings
  add column reminder_sent_at timestamptz;

comment on column assessment_bookings.reminder_sent_at is
  'Set once the 48-hours-before-assessment SMS reminder has been sent for this booking, so the reminder cron never sends it twice. Null = not sent yet (or booking isn''t "booked"/doesn''t need one).';

insert into sms_templates (template_name, message_body, active) values
  (
    'booking_confirmation',
    'Hi {{first_name}}, thanks for booking {{product_name}} with West Coast Marine Training! {{details}} Reply STOP to opt out of SMS.',
    true
  ),
  (
    'assessment_reminder_48h',
    'Hi {{first_name}}, reminder: your RST Assessment is coming up in 2 days — {{date}} at {{time}}, {{location}}. See you there! — West Coast Marine Training. Reply STOP to opt out.',
    true
  )
on conflict (template_name) do nothing;
