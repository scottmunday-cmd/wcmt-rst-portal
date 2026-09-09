-- WCMT RST Portal — Row Level Security
-- Run after 0001_core_schema.sql. Matches the "Row-level security" section
-- of the Technical Build Pack.

alter table profiles enable row level security;
alter table students enable row level security;
alter table instructors enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table payments enable row level security;
alter table coupons enable row level security;
alter table assessment_locations enable row level security;
alter table assessment_slots enable row level security;
alter table assessment_bookings enable row level security;
alter table modules enable row level security;
alter table lessons enable row level security;
alter table questions enable row level security;
alter table student_progress enable row level security;
alter table mock_exams enable row level security;
alter table achievements enable row level security;
alter table reference_articles enable row level security;
alter table search_logs enable row level security;
alter table bookmarks enable row level security;
alter table sms_templates enable row level security;
alter table sms_logs enable row level security;
alter table enquiries enable row level security;
alter table certificates enable row level security;
alter table settings enable row level security;
alter table audit_log enable row level security;

-- ============================================================
-- Helper functions
-- ============================================================

create or replace function is_admin()
returns boolean language sql stable security definer as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function is_instructor()
returns boolean language sql stable security definer as $$
  select exists (select 1 from profiles where id = auth.uid() and role in ('instructor', 'admin'));
$$;

create or replace function current_student_id()
returns uuid language sql stable security definer as $$
  select id from students where profile_id = auth.uid();
$$;

-- ============================================================
-- High-risk tables: identity, financial, compliance
-- ============================================================

create policy "profiles_select" on profiles
  for select using (id = auth.uid() or is_admin() or is_instructor());
create policy "profiles_self_update" on profiles
  for update using (id = auth.uid());
create policy "profiles_admin_all" on profiles
  for all using (is_admin());

create policy "students_select" on students
  for select using (profile_id = auth.uid() or is_admin() or is_instructor());
create policy "students_admin_write" on students
  for all using (is_admin());

create policy "orders_select" on orders
  for select using (profile_id = auth.uid() or is_admin());
create policy "orders_admin_write" on orders
  for all using (is_admin());

create policy "payments_select" on payments
  for select using (
    exists (select 1 from orders o where o.id = payments.order_id
            and (o.profile_id = auth.uid() or is_admin()))
  );
-- No insert/update policy for `authenticated` — payments are written only
-- by the Stripe webhook handler, which uses the service-role key and
-- bypasses RLS entirely.

create policy "bookings_select" on assessment_bookings
  for select using (student_id = current_student_id() or is_admin() or is_instructor());
create policy "bookings_insert" on assessment_bookings
  for insert with check (student_id = current_student_id());
create policy "bookings_update" on assessment_bookings
  for update using (student_id = current_student_id() or is_admin());

create policy "progress_all" on student_progress
  for all using (student_id = current_student_id() or is_admin() or is_instructor())
  with check (student_id = current_student_id() or is_admin());

create policy "bookmarks_all" on bookmarks
  for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

create policy "certificates_select" on certificates
  for select using (
    exists (select 1 from students s where s.id = certificates.student_id and s.profile_id = auth.uid())
    or is_admin() or is_instructor()
  );
create policy "certificates_admin_write" on certificates
  for all using (is_admin() or is_instructor());

create policy "settings_admin_only" on settings for all using (is_admin());
create policy "audit_log_admin_read" on audit_log for select using (is_admin());
-- audit_log has no insert policy for any client role — rows are written
-- only by SECURITY DEFINER trigger functions and server-side code using
-- the service role.

create policy "instructors_select" on instructors
  for select using (profile_id = auth.uid() or is_admin() or is_instructor());
create policy "instructors_admin_write" on instructors
  for all using (is_admin());

-- ============================================================
-- Content tables: public/student read active rows, staff full access
-- ============================================================

create policy "modules_read_active" on modules
  for select using (active = true or is_admin() or is_instructor());
create policy "modules_admin_write" on modules
  for all using (is_admin());

create policy "lessons_read_active" on lessons
  for select using (active = true or is_admin() or is_instructor());
create policy "lessons_admin_write" on lessons
  for all using (is_admin());

create policy "reference_articles_read_active" on reference_articles
  for select using (active = true or is_admin() or is_instructor());
create policy "reference_articles_admin_write" on reference_articles
  for all using (is_admin());

create policy "assessment_locations_read_active" on assessment_locations
  for select using (active = true or is_admin() or is_instructor());
create policy "assessment_locations_admin_write" on assessment_locations
  for all using (is_admin());

create policy "assessment_slots_read_active" on assessment_slots
  for select using (active = true or is_admin() or is_instructor());
create policy "assessment_slots_admin_write" on assessment_slots
  for all using (is_admin());

create policy "products_read_active" on products
  for select using (active = true or is_admin());
create policy "products_admin_write" on products
  for all using (is_admin());

-- ============================================================
-- Own-rows-only tables
-- ============================================================

create policy "achievements_own_select" on achievements
  for select using (student_id = current_student_id() or is_admin() or is_instructor());
create policy "achievements_admin_write" on achievements
  for all using (is_admin());

create policy "mock_exams_own_select" on mock_exams
  for select using (student_id = current_student_id() or is_admin() or is_instructor());
create policy "mock_exams_own_insert" on mock_exams
  for insert with check (student_id = current_student_id());

create policy "search_logs_own_insert" on search_logs
  for insert with check (profile_id = auth.uid());
create policy "search_logs_admin_read" on search_logs
  for select using (is_admin());

-- ============================================================
-- Staff-only tables
-- ============================================================

create policy "sms_templates_admin_all" on sms_templates for all using (is_admin());
create policy "sms_templates_instructor_read" on sms_templates for select using (is_instructor());

create policy "sms_logs_admin_all" on sms_logs for all using (is_admin());

create policy "coupons_admin_all" on coupons for all using (is_admin());

-- ============================================================
-- Public contact form
-- ============================================================

create policy "enquiries_public_insert" on enquiries
  for insert with check (true);
create policy "enquiries_staff_read" on enquiries
  for select using (is_admin() or is_instructor());

-- ============================================================
-- Quiz answer protection
-- ============================================================

-- Deliberately NOT security_invoker: this view has to run with the view
-- owner's privileges so it can read the underlying `questions` table on
-- the caller's behalf, even though `authenticated` has no direct grant on
-- `questions` (revoked below). That's the whole mechanism — the view
-- exposes selected columns without exposing the table.
create view questions_public as
  select id, module_id, question_text, answer_a, answer_b, answer_c, answer_d, difficulty
  from questions
  where active = true;

grant select on questions_public to authenticated;
revoke select on questions from authenticated;

create policy "questions_admin_only" on questions for all using (is_admin());

create or replace function grade_quiz_answer(p_question_id bigint, p_selected text)
returns boolean
language sql
security definer
as $$
  select correct_answer = p_selected from questions where id = p_question_id;
$$;

grant execute on function grade_quiz_answer(bigint, text) to authenticated;
