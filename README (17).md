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
4. **Create matching Products and Prices in Stripe** (Products → Add
   product) for the four rows seeded into the `products` table, then
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

## A note on this scaffold

The three SQL files in `supabase/migrations/` have actually been run
against a real PostgreSQL 16 database (with a stand-in for Supabase's
`auth` schema) as part of building this — including the new-user signup
trigger, the assessment-booking capacity trigger under a simulated double
booking, and the quiz-answer view/grading function under the
`authenticated` role. All of it behaved as designed; one bug (a view
setting that would have silently broken the answer-hiding mechanism) was
caught this way and fixed before you ever saw it.

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
