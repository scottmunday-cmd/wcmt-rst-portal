# West Coast Marine Training — RST Student Portal

Next.js 15 + Supabase + Stripe + ClickSend. See the **Technical Build Pack**
document (in your Claude conversation) for the full architecture, schema
rationale, and phased build plan — this README is just the "how do I get
this running" version.

## What this portal certifies (and what it doesn't)

Confirmed 9 September 2026: the online portal — modules, quizzes, mock
exams, the readiness score — is study and preparation only, with no
official standing. The actual RST outcome always requires the student to
meet in person for the practical assessment. A `certificates` row only
ever gets created by staff (admin/instructor), and only after that
in-person meeting — never automatically from online completion. Keep this
boundary visible in any new copy: "ready for assessment" and "certified"
are different states, and nothing student-facing should blur them.

A `certificates` row is WCMT's own record that the assessment was
completed — not the government boat licence. The real chain: WCMT
completes the paperwork -> sends it to NWTIS (the RTO) -> NWTIS submits it
to WA Transport -> WA Transport issues the actual licence, with NWTIS
holding the records on their end. That handoff is manual and stays manual
for now — nothing in this app submits anything to NWTIS or WA Transport.
`certificates.submission_status` just tracks where a case sits in that
external process for staff's own visibility.

## First-time setup

1. **Install dependencies** (needs Node.js 20+):
   ```
   npm install
   ```
2. **Create `.env.local`** from the template and fill in the values from
   your Supabase and Stripe dashboards (see the account setup guide):
   ```
   cp .env.example .env.local
   ```
3. **Run the database migrations** against your Supabase project, in
   order, using the SQL editor in the Supabase dashboard (Project →
   SQL Editor → New query → paste → Run):
   - `supabase/migrations/0001_core_schema.sql`
   - `supabase/migrations/0002_rls_policies.sql`
   - `supabase/migrations/0003_seed_reference_data.sql`
   - `supabase/migrations/0004_update_products.sql`
   - `supabase/migrations/0005_location_travel_surcharge.sql`
   - `supabase/migrations/0006_wire_stripe_and_promote_bundle.sql`
   - `supabase/migrations/0007_correct_prices_and_spelling.sql`
   - `supabase/migrations/0008_content_paywall.sql`
4. **Create matching Products and Prices in Stripe** (Products → Add
   product) for the three rows seeded into the `products` table, then
   paste each `stripe_product_id`/`stripe_price_id` into that row from
   the Supabase Table Editor.
5. **Run it locally**:
   ```
   npm run dev
   ```
   then open http://localhost:3000.

## Deploying

Push this repository to GitHub, then import it in Vercel (New Project →
Import Git Repository). Add the same environment variables from
`.env.local` in Vercel's Project Settings → Environment Variables — once
for the Preview environment (Stripe test mode, staging Supabase project)
and once for Production (Stripe live mode, production Supabase project).

After the first deploy, add the Stripe webhook endpoint (Stripe dashboard
→ Developers → Webhooks → Add endpoint) pointing at
`https://<your-domain>/api/stripe/webhook`, subscribed to at least
`checkout.session.completed` and `price.updated`, then copy its signing
secret into `STRIPE_WEBHOOK_SECRET`.

## Location-based pricing

The **In-Person Assessment** and **Private Tuition** products cost more at
locations further from Perth metro. Each row in `assessment_locations` has
a `travel_surcharge_multiplier` (0 for Perth metro locations); the actual
surcharge is that multiplier times the `travel_surcharge_unit_cents`
setting ($50 by default). `/api/checkout` computes the final price from
these at the moment someone buys — nothing is hardcoded, and nothing in
Stripe needs to change when you add a location or change the surcharge.

**To add a new regional location** (e.g. Jurien Bay, Denham): Supabase →
Table Editor → `assessment_locations` → insert a row with the name and a
`travel_surcharge_multiplier` (1 = one $50 unit, 2 = two units, and so on
— there's no formula, just whatever reflects the travel). No code change,
no migration, no redeploy needed.

**To change the $50 unit itself**: Table Editor → `settings` → edit the
`travel_surcharge_unit_cents` row (in cents, so `5000` = $50). Every
location's surcharge scales immediately since they only store a
multiplier.

## Content paywall

Found during Scott's first live checkout test (11 September 2026): modules,
lessons, the reference library and quiz questions were readable by *any*
signed-up account, paid or not — nothing anywhere actually checked payment
status. `0008_content_paywall.sql` fixes this at the database level (a
`has_paid_access()` function wired into the RLS policies for those tables,
requiring at least one `orders` row with `status = 'paid'`), and
`src/app/(student)/layout.tsx` mirrors it with a friendly "you haven't
purchased a course yet" screen instead of pages that would otherwise just
look empty. Staff (`admin`/`instructor` role) always have access. The
`src/app/admin` and `src/app/instructor` layouts also picked up a real
login/role check at the same time — they had none before; the underlying
tables were still RLS-protected, but the page shell itself rendered for
anyone.

## Checkout success/cancel pages

`/api/checkout` has always redirected to `/checkout/success` and
`/checkout/cancel` after Stripe, but those two pages were never actually
built — a completed real payment was hitting a 404. They now exist under
`src/app/(marketing)/checkout/`. Success reads the `session_id` Stripe
appends to the URL and looks up that order (RLS-scoped, so a customer can
only ever see their own); since the webhook that flips an order to "paid"
can land a moment after the redirect, the page handles "still pending"
gracefully rather than assuming paid.

## A note on this scaffold

The five SQL files in `supabase/migrations/` have actually been run
against a real PostgreSQL 16 database (with a stand-in for Supabase's
`auth` schema) as part of building this — including the new-user signup
trigger, the assessment-booking capacity trigger under a simulated double
booking, the quiz-answer view/grading function under the `authenticated`
role, and (0004/0005) the revised product lineup and location-surcharge
columns. All of it behaved as designed; one bug (a view setting that would
have silently broken the answer-hiding mechanism) was caught this way and
fixed before you ever saw it.

The Next.js/TypeScript application code has not been through the same
level of testing: the sandbox this was built in blocks the npm registry,
so `npm install` couldn't be run here to do a real `next build`. Every
`.ts`/`.tsx` file has been checked for syntax errors, and the code follows
standard, current Next.js 15 App Router and Supabase SSR conventions
throughout — but the *first* real compile check will be `npm install` on
your machine or Vercel's build step. If that surfaces an error, paste it
back and it's a quick fix.

One specific spot flagged in the code itself: `src/lib/stripe.ts` pins a
Stripe API version string that may not match whatever `stripe` version npm
resolves — if the build fails there, TypeScript's error message names the
exact string it wants.

## Project structure & content

See the Technical Build Pack for the full folder layout and the "Content
migration plan" for how to bulk-import the 11 modules' lessons and quiz
questions via spreadsheet rather than typing them into an admin screen.
