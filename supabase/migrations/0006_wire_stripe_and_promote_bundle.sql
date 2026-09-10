-- Two things settled with Scott 10 September 2026:
-- 1. Wires in the real Stripe product/price IDs from the test-mode account
--    he actually created (names on his Stripe dashboard: "Private Tuition",
--    "RST Assessement", "Study Only" — kept as typed; see the note on the
--    "Assessement" spelling in chat, fix here if he confirms it should be
--    "Assessment").
-- 2. Marks the assessment package as `featured` so the homepage can
--    promote it as the better-value option — it already includes full
--    online content access on top of the required in-person assessment,
--    which is also worth calling out explicitly in the description (the
--    "lifetime reference library after certification" point specifically).
--
-- price_cents is NOT touched here — still the $50/$300/$450 placeholders
-- from 0004 until Scott confirms the actual current prices in his Stripe
-- account, which may have changed slightly. Run 0007 (once written) for
-- that — don't hand-edit price_cents without also creating a matching
-- Stripe Price, or the two will disagree (see "Stripe integration" in the
-- Technical Build Pack).

update products
set name = 'RST Assessement',
    stripe_product_id = 'prod_VEPZb1r7D68YJe',
    stripe_price_id = 'price_1UDwk4HMXgobjAX5fuQkReDy',
    featured = true,
    description = 'Your required in-person theory test and practical assessment, done in one appointment — this is the step that actually leads to your licence application (see the README for how that works). Includes full access to the online study content, and it stays yours as a reference library for life once you''re certified.'
where slug = 'assessment';

update products
set name = 'Study Only',
    stripe_product_id = 'prod_VEPVVJrFSZ3qSa',
    stripe_price_id = 'price_1UDwgYHMXgobjAX5I50qcX6T',
    featured = false
where slug = 'portal';

update products
set name = 'Private Tuition',
    stripe_product_id = 'prod_VEPaQD27sXH0Df',
    stripe_price_id = 'price_1UDwliHMXgobjAX5Y1UoWSl0',
    featured = false
where slug = 'private-tuition';
