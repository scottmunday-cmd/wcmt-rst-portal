# West Coast Marine Training — Off-Page SEO Action Plan

Prepared 21 October 2026. On-page work (titles, meta descriptions, structured data, sitemap, robots.txt) is done and live in the codebase. This covers everything that happens *outside* the website — the things Google and prospective students see about WCMT elsewhere, which matter just as much for ranking, especially for local "near me" searches.

I checked what's already out there for West Coast Marine Training before writing this, and couldn't find an existing Google Business Profile, directory listings, or reviews for the business under that name — so most of this is starting from zero, which also means there's real upside here.

## Priority 1 — do these first

**1. Claim and fully build out a Google Business Profile.**
This is the single highest-impact thing on this list. It's what puts WCMT in the Google Maps "pack" and local search results for things like "RST course near me" or "boat licence Two Rocks" — and it's free. Go to [business.google.com](https://business.google.com) and claim/create a listing:
- Business name: West Coast Marine Training (exactly as it appears on the site — consistency matters)
- Category: primary category something like "Boat tour agency" or "School" won't quite fit — look for "Sailing school" or add "Boating course" / "Marine training" as a custom category if available
- Service area: set Two Rocks as the base, and add the areas served (Hillarys, Mandurah, Rockingham, through to Port Hedland) as a service-area business rather than a single storefront, since you train at multiple locations
- Phone, website link (westcoastmarinetraining.com.au), hours
- Photos: the Blue Bull, you running a session, students with their certificates (you already have the certificate-pass photos used on the site — reuse a couple here)
- A Google Posts update now and then (e.g. "Bookings open for [month]") keeps the profile active, which Google rewards
- Once live, every single verification/text should get a very short, casual review request — see Priority 2

**2. Get listed on Transport WA's own RST assessment providers page.**
I checked the current list ([transport.wa.gov.au/imarine/recreational-skippers-ticket-assessment-providers.asp](https://www.transport.wa.gov.au/imarine/recreational-skippers-ticket-assessment-providers.asp)) and WCMT doesn't currently appear on it — the Perth metro providers listed are Alliance Boat Training, Australian Boat Schools, Australian Boating College, Maritime Training School, North West Training & Inspection Services, and Skills Strategies. If WCMT is an approved assessment provider and this is just an oversight, getting added is worth more than almost anything else on this list — it's a direct link from a .gov.au page, it's exactly the page people check before booking, and your competitors are all on it. If WCMT isn't currently a formally approved provider in its own right (e.g. you assess under a partner's approval), this one may not apply — you'd know that better than I would, worth a quick check either way.

**3. List on the free niche directories that already rank for this.**
Two Australian boating-course directories turned up repeatedly in my research, both already listing your competitors, both apparently free:
- [edumaritime.net/western-australia](https://www.edumaritime.net/western-australia) — lists WA boat schools by suburb (I saw competitors listed under Maylands and Munster). There's apparently a standing offer of free listings for training centres — see [this mysailing.com.au piece](https://mysailing.com.au/free-marketing-exposure-for-marine-training-centres/) for how that works.
- [nauticed.org/sailing-schools/Australia/Western-Australia](https://www.nauticed.org/sailing-schools/Australia/Western-Australia) — international sailing/powerboating school directory with a WA section.

## Priority 2 — reviews

Google reviews are both a ranking factor and the thing a prospective student actually reads before booking. With the SMS system already wired up (ClickSend, used for assessment reminders — see `src/lib/sms.ts`), the cheapest way to get a steady stream of reviews is to text a short Google review link to every student right after they pass their practical assessment, while the win is fresh. That's a genuinely small code change if you want it (one more SMS trigger alongside the existing reminder one) — just say the word and I can wire it up once the Google Business Profile exists and has a review link to send.

Aim for reviews mentioning "Recreational Skipper's Ticket" or "RST" naturally in the text where honest — Google does weight review content, not just the star rating.

## Priority 3 — general local citations

Standard Australian business directories. Low effort each, and consistency of your business name/address/phone across all of them (exact same formatting every time) is what actually matters for the ranking benefit — inconsistent listings are worse than no listings:
- True Local
- Yellow Pages Australia
- Hotfrog
- StartLocal
- Bing Places (Microsoft's equivalent of Google Business Profile — often skipped, still worth the five minutes)
- Facebook Business Page (also doubles as a review channel and a place to post photos/updates)

## Priority 4 — backlinks from relevant WA sites

These take longer and are more opportunistic, but each one is worth significantly more than a directory listing because they come from sites actually relevant to boating in WA:
- Local yacht/boating clubs in your service area (Royal Freshwater Bay Yacht Club and similar clubs run powerboat courses themselves but often link out to recommended RST providers for members who just want the ticket, not a club membership)
- Marine chandleries, boat dealerships, or marina operators in Two Rocks, Hillarys, Mandurah — a lot of these have a "local services" or "useful links" page and are happy to cross-promote with a local trainer
- Your BHP tug-master training background is a genuinely good local news angle ("Pilbara tug master trains WA boaties in his spare time" is a real human-interest story) — a mention or interview in a local WA paper (Community News group papers covering the northern suburbs, or a Pilbara outlet given the BHP connection) would be a strong, fairly natural backlink if you're ever up for a short interview

## What I didn't do and why

Everything above needs either a Google account login, phone verification, or outreach to a third party — none of which I can do on your behalf. I've researched and prioritized it so you (or whoever handles your marketing) can work through it without having to figure out where to start. Happy to help draft the actual listing copy/descriptions for any of these once you're ready to set them up, or to wire up the post-assessment review-request text once the Google Business Profile exists.
