/**
 * Hand-written types matching supabase/migrations/0001_core_schema.sql.
 *
 * Once the Supabase project exists, replace this file by running:
 *   npx supabase gen types typescript --project-id <your-project-ref> > src/types/database.ts
 * That generates types directly from the live schema, so it never drifts
 * from what's actually in the database. This file is a stand-in until then.
 */

export type ProfileRole = "student" | "instructor" | "admin";
export type CourseStatus = "active" | "completed" | "withdrawn";
export type OrderStatus = "pending" | "paid" | "refunded" | "cancelled" | "failed";
export type BookingStatus = "booked" | "cancelled" | "attended" | "no_show";

export interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  mobile: string | null;
  date_of_birth: string | null;
  role: ProfileRole;
  sms_consent: boolean;
  marketing_consent: boolean;
  consent_recorded_at: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  profile_id: string;
  assessment_ready: boolean;
  readiness_score: number;
  course_status: CourseStatus;
  identity_verified: boolean;
  identity_document_path: string | null;
  identity_verified_by: string | null;
  identity_verified_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  slug: string;
  stripe_product_id: string | null;
  stripe_price_id: string | null;
  name: string;
  description: string | null;
  price_cents: number;
  // True for products whose final price depends on which
  // assessment_location is picked at checkout (travel surcharge) — see
  // AssessmentLocation.travel_surcharge_multiplier.
  requires_location: boolean;
  featured: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AssessmentLocation {
  id: string;
  name: string;
  address: string | null;
  // Number of surcharge units (see settings.travel_surcharge_unit_cents)
  // added to a location-priced product's base price for this location.
  // 0 = standard/home base (Perth metro).
  travel_surcharge_multiplier: number;
  active: boolean;
}

export interface Order {
  id: string;
  profile_id: string;
  product_id: string;
  amount_cents: number;
  status: OrderStatus;
  stripe_session_id: string | null;
  coupon_code: string | null;
  // Which location's surcharge (if any) this order's amount_cents was
  // based on. Null for products that don't require a location.
  assessment_location_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: number;
  title: string;
  description: string | null;
  sort_order: number;
  active: boolean;
}

export interface Lesson {
  id: number;
  module_id: number;
  title: string;
  content: string | null;
  video_url: string | null;
  attachments: unknown[];
  sort_order: number;
  active: boolean;
}

export interface QuestionPublic {
  id: number;
  module_id: number;
  question_text: string;
  answer_a: string;
  answer_b: string;
  answer_c: string;
  answer_d: string;
  difficulty: "easy" | "normal" | "hard";
}

export interface StudentProgress {
  id: string;
  student_id: string;
  module_id: number;
  percentage_complete: number;
  completed: boolean;
  quiz_score: number | null;
  updated_at: string;
}

export interface AssessmentSlot {
  id: string;
  location_id: string;
  instructor_id: string | null;
  assessment_date: string;
  assessment_time: string;
  capacity: number;
  booked_count: number;
  active: boolean;
}

export interface AssessmentBooking {
  id: string;
  student_id: string;
  slot_id: string;
  status: BookingStatus;
  booked_at: string;
}

export interface ReferenceArticle {
  id: number;
  title: string;
  category: string;
  search_keywords: string | null;
  content: string | null;
  attachments: unknown[];
  active: boolean;
}

export interface Bookmark {
  id: string;
  profile_id: string;
  article_id: number;
  saved_at: string;
}

// WCMT's own record that a student completed the in-person assessment —
// not the government RST licence itself. See submission_status: WCMT
// completes the paperwork and sends it to NWTIS (the RTO), who submit it
// to WA Transport for the actual licence. That handoff is manual; this
// field just tracks where a case sits in it, it doesn't trigger anything.
export type CertificateSubmissionStatus = "completed" | "sent_to_nwtis" | "licence_confirmed";

export interface Certificate {
  id: string;
  student_id: string;
  issued_by: string | null;
  certificate_number: string;
  completion_date: string;
  certificate_url: string | null;
  verification_code: string;
  submission_status: CertificateSubmissionStatus;
  sent_to_nwtis_at: string | null;
  licence_confirmed_at: string | null;
  issued_at: string;
}
