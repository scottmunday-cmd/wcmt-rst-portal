-- Revises the product lineup seeded in 0003, based on the actual pricing
-- Scott settled on (10 Sept 2026): a low-cost standalone content/reference
-- subscription, and a single in-person assessment package that already
-- includes that content access — rather than separate "assessment only"
-- and "bundle" tiers. Run this once, after 0001-0003, on any project that
-- already has the original four products.
--
-- Do not edit 0003 to match this — 0003 is a record of what was actually
-- run first. This file is the correction on top of it.

-- Study & Reference Access: online modules, quizzes, mock exams, and the
-- reference library on their own. Buying this does NOT include the
-- in-person theory + practical assessment — see #online-vs-in-person in
-- the Technical Build Pack. Also doubles as ongoing reference access after
-- a student is certified.
update products
set name = 'Study & Reference Access',
    description = 'Online training modules, practice quizzes, mock exams, and the reference library — study at your own pace. Doesn''t include the required in-person theory test and practical assessment, which is booked separately (or included if you choose the assessment package). Stays available afterwards as a reference library once you''re a certified skipper.',
    price_cents = 5000
where slug = 'portal';

-- In-Person Assessment: the required theory test and practical assessment,
-- done together in one appointment (see #certificate-chain) — mandatory
-- for every student regardless of how they prepared. Includes full online
-- content access, so a student doesn't need to buy Study & Reference
-- Access separately if they're going this route.
update products
set name = 'In-Person Assessment (Theory + Practical)',
    description = 'Your required in-person theory test and practical assessment, done in one appointment — this is the step that actually leads to your licence application (see the README for how that works). Includes full access to the online study and reference content too.',
    price_cents = 30000
where slug = 'assessment';

-- Superseded by the assessment package above, which now includes content
-- access at the same all-in price point.
delete from products where slug = 'bundle';

-- Private Tuition is unchanged — still a separate one-on-one option.
