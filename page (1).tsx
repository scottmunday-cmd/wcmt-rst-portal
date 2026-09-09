const FAQS = [
  { q: "Who needs an RST?", a: "Anyone operating most recreational powered vessels in Western Australian waters needs a Recreational Skipper's Ticket. Check Transport WA's website for the exact vessel/situation rules." },
  { q: "Do I need boating experience?", a: "No — the course is designed for complete beginners as well as experienced boaters brushing up before their assessment." },
  { q: "How long do I get access?", a: "Portal access is lifetime — including the reference library, after you complete the course." },
  { q: "Can I study before booking?", a: "Yes. Assessment booking is completely separate from enrolling — study at your own pace and book when you're ready." },
  { q: "What happens in the practical assessment?", a: "An instructor assesses your on-water skills against the RST requirements at one of our locations." },
  { q: "What happens after I pass?", a: "You receive your certificate with a QR verification code, and keep lifetime access to the reference library." },
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
      </div>
    </section>
  );
}
