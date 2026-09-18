const FAQS = [
  { q: "Who needs an RST?", a: "Anyone operating most recreational powered vessels in Western Australian waters needs a Recreational Skipper's Ticket. Check Transport WA's website for the exact vessel/situation rules." },
  { q: "Do I need boating experience?", a: "No — the course is designed for complete beginners as well as experienced boaters brushing up before their assessment." },
  { q: "How long do I get access?", a: "Portal access is lifetime — including the reference library, after you complete the course." },
  { q: "Can I study before booking?", a: "Yes. Assessment booking is completely separate from enrolling — study at your own pace and book when you're ready." },
  { q: "What happens in the practical assessment?", a: "Our instructor will train you on the day at one of our RST locations, teaching you thoroughly how to complete all of the skills needed, then you will be assessed against the RST requirements." },
  { q: "What happens after I pass?", a: "For online studies, you receive your certificate with a QR verification code, and keep lifetime access to the reference library. After passing your actual RST assessment, the instructor will issue you with a temporary RST immediately, then your card will be sent out by DOT after processing." },
];

export default function FaqPage() {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-heading text-3xl font-bold text-wcmt-navy">
          Frequently Asked Questions
        </h1>
        <dl className="mt-8 space-y-6">
          {FAQS.map((item) => (
            <div key={item.q}>
              <dt className="font-heading font-semibold text-wcmt-navy">{item.q}</dt>
              <dd className="mt-1 text-sm text-slate-600">{item.a}</dd>
            </div>
          ))}
        </dl>

        {/*
          Added 18 September 2026, per Scott: he wants a way to be reached
          directly on here for anyone who genuinely needs it, but kept
          deliberately low-key (small, muted, at the very bottom, no
          button/CTA styling) — he'd rather people keep browsing the site
          than this becoming a first port of call and generating a lot of
          sales calls. The homepage's "Request Callback" button (see
          RequestCallbackForm.tsx) is the intended main contact path.
        */}
        <div className="mt-10 border-t border-slate-200 pt-6 text-center">
          <p className="text-xs text-slate-400">
            Still have a question? You can reach Scotty directly on{" "}
            <a href="tel:+61408927905" className="underline hover:text-wcmt-coastal">
              0408 927 905
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
