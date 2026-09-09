-- WCMT RST Portal — core schema
-- Matches the "Database schema" section of the Technical Build Pack.
-- Run this against a fresh Supabase project before 0002_rls_policies.sql.

create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- ============================================================
-- Identity, roles & consent
-- ============================================================

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  first_name text,
  last_name text,
  mobile text,
  date_of_birth date,
  role text not null default 'student' check (role in ('student', 'instructor', 'admin')),
  sms_consent boolean not null default false,
  marketing_consent boolean not null default false,
  consent_recorded_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table students (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  assessment_ready boolean not null default false,
  readiness_score integer not null default 0,
  course_status text not null default 'active'
    check (course_status in ('active', 'completed', 'withdrawn')),
  identity_verified boolean not null default false,
  identity_document_path text,
  identity_verified_by uuid references profiles(id) on delete set null,
  identity_verified_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table instructors (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  qualification_number text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Creates a profiles row automatically whenever someone signs up via
-- Supabase Auth, using the metadata passed from the register page.
create or replace function fn_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name, sms_consent, consent_recorded_at)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    coalesce((new.raw_user_meta_data ->> 'sms_consent')::boolean, false),
    now()
  );

  insert into public.students (profile_id) values (new.id);

  return new;
end;
$$;

create trigger trg_handle_new_user
after insert on auth.users
for each row execute function fn_handle_new_user();

-- ============================================================
-- Commerce
-- ============================================================

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  stripe_product_id text,
  stripe_price_id text,
  name text not null,
  description text,
  price_cents integer not null,
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete restrict,
  product_id uuid not null references products(id) on delete restrict,
  amount_cents integer not null,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'refunded', 'cancelled', 'failed')),
  stripe_session_id text,
  coupon_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete restrict,
  stripe_payment_intent text,
  amount_cents integer not null,
  payment_status text not null
    check (payment_status in ('pending', 'succeeded', 'failed', 'refunded')),
  refunded_amount_cents integer,
  refunded_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_percent integer check (discount_percent between 1 and 100),
  expires_at date,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Assessment booking & capacity integrity
-- ============================================================

create table assessment_locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  active boolean not null default true
);

create table assessment_slots (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references assessment_locations(id) on delete restrict,
  instructor_id uuid references instructors(id) on delete set null,
  assessment_date date not null,
  assessment_time time not null,
  capacity integer not null default 8,
  booked_count integer not null default 0,
  active boolean not null default true
);

create table assessment_bookings (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  slot_id uuid not null references assessment_slots(id) on delete restrict,
  status text not null default 'booked'
    check (status in ('booked', 'cancelled', 'attended', 'no_show')),
  booked_at timestamptz not null default now()
);

create or replace function fn_book_assessment_slot()
returns trigger
language plpgsql
security definer
as $$
declare
  v_capacity integer;
  v_booked integer;
begin
  if tg_op = 'INSERT' then
    select capacity, booked_count into v_capacity, v_booked
    from assessment_slots where id = new.slot_id for update;

    if v_booked >= v_capacity then
      raise exception 'Assessment slot % is fully booked', new.slot_id using errcode = 'P0001';
    end if;

    update assessment_slots set booked_count = booked_count + 1 where id = new.slot_id;

  elsif tg_op = 'UPDATE' then
    if old.status <> 'cancelled' and new.status = 'cancelled' then
      update assessment_slots set booked_count = greatest(booked_count - 1, 0) where id = new.slot_id;
    elsif old.status = 'cancelled' and new.status <> 'cancelled' then
      select capacity, booked_count into v_capacity, v_booked
      from assessment_slots where id = new.slot_id for update;
      if v_booked >= v_capacity then
        raise exception 'Assessment slot % is fully booked', new.slot_id using errcode = 'P0001';
      end if;
      update assessment_slots set booked_count = booked_count + 1 where id = new.slot_id;
    end if;

  elsif tg_op = 'DELETE' then
    update assessment_slots set booked_count = greatest(booked_count - 1, 0) where id = old.slot_id;
  end if;

  return coalesce(new, old);
end;
$$;

create trigger trg_book_assessment_slot
before insert or update or delete on assessment_bookings
for each row execute function fn_book_assessment_slot();

-- ============================================================
-- Learning content & progress
-- ============================================================

create table modules (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  sort_order integer not null,
  active boolean not null default true
);

create table lessons (
  id bigint generated always as identity primary key,
  module_id bigint not null references modules(id) on delete cascade,
  title text not null,
  content text,
  video_url text,
  attachments jsonb not null default '[]'::jsonb,
  sort_order integer not null,
  active boolean not null default true
);

create table questions (
  id bigint generated always as identity primary key,
  module_id bigint not null references modules(id) on delete cascade,
  question_text text not null,
  answer_a text not null,
  answer_b text not null,
  answer_c text not null,
  answer_d text not null,
  correct_answer text not null check (correct_answer in ('a', 'b', 'c', 'd')),
  difficulty text not null default 'normal' check (difficulty in ('easy', 'normal', 'hard')),
  active boolean not null default true
);

-- Never expose correct_answer to the client — see questions_public below
-- and grade_quiz_answer() in 0002_rls_policies.sql.

create table student_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  module_id bigint not null references modules(id) on delete cascade,
  percentage_complete integer not null default 0 check (percentage_complete between 0 and 100),
  completed boolean not null default false,
  quiz_score integer,
  updated_at timestamptz not null default now(),
  unique (student_id, module_id)
);

-- Online practice only — no official standing. A mock exam pass does not
-- itself qualify a student for anything; it feeds the readiness score that
-- tells them (and their instructor) they're ready to book the real,
-- in-person assessment. See certificates below for what actually counts.
create table mock_exams (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  score integer not null,
  passed boolean not null,
  completed_at timestamptz not null default now()
);

create table achievements (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  badge_name text not null,
  awarded_at timestamptz not null default now()
);

-- ============================================================
-- Reference library, search & bookmarks
-- ============================================================

create table reference_articles (
  id bigint generated always as identity primary key,
  title text not null,
  category text not null,
  search_keywords text,
  content text,
  attachments jsonb not null default '[]'::jsonb,
  active boolean not null default true
);

create table search_logs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete set null,
  search_term text not null,
  searched_at timestamptz not null default now()
);

create table bookmarks (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  article_id bigint not null references reference_articles(id) on delete cascade,
  saved_at timestamptz not null default now(),
  unique (profile_id, article_id)
);

-- ============================================================
-- Communications & compliance records
-- ============================================================

create table sms_templates (
  id uuid primary key default gen_random_uuid(),
  template_name text unique not null,
  message_body text not null,
  active boolean not null default true
);

create table sms_logs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete set null,
  template_name text not null,
  message_body text not null,
  delivery_status text,
  sent_at timestamptz not null default now()
);

create table enquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  mobile text,
  enquiry_type text,
  message text,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

-- WCMT's own record that a student completed the in-person assessment —
-- NOT the government boat licence itself. Confirmed 9 September 2026, the
-- real chain is: WCMT runs the in-person assessment and completes the
-- paperwork -> sends it to NWTIS (the RTO) -> NWTIS submits to WA
-- Transport (Dept of Transport) -> WA Transport issues the actual RST
-- licence. NWTIS holds the records on their end. That handoff is manual
-- today and stays manual for now — nothing in this app submits anything
-- to NWTIS or WA Transport. submission_status is just a tracking field so
-- staff can see where each case sits in that external process; it does not
-- trigger anything.
--
-- Everything else in this schema (modules, quizzes, mock_exams, readiness
-- score) is online preparation only and has no official standing — a
-- certificate row only ever gets created by staff (see the RLS policy in
-- 0002), and only after the student has met in person for the practical
-- assessment. issued_by / completion_date is where the instructor who ran
-- that assessment records it, including confirming the student's identity
-- in person — see students.identity_verified.
create table certificates (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete restrict,
  issued_by uuid references profiles(id) on delete set null,
  certificate_number text unique not null,
  completion_date date not null,
  certificate_url text,
  verification_code text not null,
  submission_status text not null default 'completed'
    check (submission_status in ('completed', 'sent_to_nwtis', 'licence_confirmed')),
  sent_to_nwtis_at timestamptz,
  licence_confirmed_at timestamptz,
  issued_at timestamptz not null default now()
);

-- ============================================================
-- Platform settings & audit log
-- ============================================================

create table settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text unique not null,
  setting_value text
);
-- Do not store stripe_secret_key, clicksend_key, or any API credential
-- here, even encrypted. Those belong in Vercel/Supabase environment
-- variables only.

create table audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id) on delete set null,
  action text not null,
  entity_table text not null,
  entity_id text,
  before jsonb,
  after jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Shared triggers
-- ============================================================

create or replace function fn_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at before update on profiles
  for each row execute function fn_set_updated_at();
create trigger trg_products_updated_at before update on products
  for each row execute function fn_set_updated_at();
create trigger trg_orders_updated_at before update on orders
  for each row execute function fn_set_updated_at();
create trigger trg_progress_updated_at before update on student_progress
  for each row execute function fn_set_updated_at();

create or replace function fn_prevent_role_self_escalation()
returns trigger language plpgsql security definer as $$
begin
  if new.role <> old.role and not exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  ) then
    raise exception 'Only admins can change a profile role';
  end if;
  return new;
end;
$$;

create trigger trg_prevent_role_self_escalation
before update on profiles
for each row execute function fn_prevent_role_self_escalation();

-- ============================================================
-- Indexes
-- ============================================================

create index idx_profiles_role on profiles(role);
create index idx_students_profile on students(profile_id);
create index idx_progress_student on student_progress(student_id);
create index idx_bookmarks_profile on bookmarks(profile_id);
create index idx_reference_category on reference_articles(category);
create index idx_assessment_booking_student on assessment_bookings(student_id);
create index idx_assessment_slots_date on assessment_slots(assessment_date);
create index idx_orders_profile on orders(profile_id);
create index idx_audit_log_entity on audit_log(entity_table, entity_id);
