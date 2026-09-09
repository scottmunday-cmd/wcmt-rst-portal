-- Seed data that has to exist before content import or bookings can work.
-- Safe to run once against a fresh project; re-running will error on the
-- unique constraints rather than duplicate rows.

insert into modules (title, sort_order) values
  ('Introduction', 1),
  ('Rules & Regulations', 2),
  ('Collision Avoidance', 3),
  ('Navigation Lights', 4),
  ('IALA Buoyage', 5),
  ('Maintenance', 6),
  ('Safety Equipment', 7),
  ('Safe Operations', 8),
  ('Emergencies', 9),
  ('Practical Assessment', 10),
  ('Mock Assessment', 11);

insert into assessment_locations (name) values
  ('Fremantle'),
  ('Hillarys'),
  ('Mandurah'),
  ('Rockingham'),
  ('Mobile Assessment');

insert into products (slug, name, description, price_cents, featured) values
  ('portal', 'RST Student Portal', 'Online training, progress tracking, practice quizzes, mock exams, and lifetime reference library.', 19500, true),
  ('assessment', 'Assessment Only', 'Book the practical assessment on its own.', 10000, false),
  ('bundle', 'Training + Assessment Bundle', 'The Student Portal and assessment booking together.', 27500, true),
  ('private-tuition', 'Private Tuition', 'One-on-one instruction for a tailored pace.', 45000, false);

-- These have no stripe_product_id / stripe_price_id yet — that's expected.
-- The admin who first opens /admin/products needs to create matching
-- Products and Prices in the Stripe dashboard (test mode on staging, live
-- mode on production) and paste the ids in, per the README.
