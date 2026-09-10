-- Settled with Scott 10 September 2026:
-- 1. Confirmed real prices: Study Only $50 (unchanged), RST Assessment $300
--    (unchanged), Private Tuition $500 (was $450 — the placeholder from
--    0003/seed data). Only private-tuition's price_cents actually changes
--    here.
-- 2. Confirmed "RST Assessement" was a typo — corrects to "RST Assessment"
--    everywhere it's stored. This is the only place the name lives for the
--    site itself (the homepage/admin pull product.name straight from this
--    table) — but Stripe's own Checkout page shows Stripe's own product
--    name for that product (set via price_data.product = stripe_product_id
--    in /api/checkout), which is separate from this table. Rename the
--    product in the Stripe dashboard too (Product catalog -> RST
--    Assessement -> edit name) or the checkout page itself will still show
--    the old spelling.

update products
set price_cents = 50000
where slug = 'private-tuition';

update products
set name = 'RST Assessment'
where slug = 'assessment';
