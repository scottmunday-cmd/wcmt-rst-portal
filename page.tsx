import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const HOW_IT_WORKS = ["Enrol", "Learn", "Practice", "Assess", "Lifetime Access"];

const PRODUCTS = [
  { name: "RST Student Portal", price: "$195", blurb: "Online training, practice quizzes, mock exams, and lifetime reference library access." },
  { name: "Assessment Only", price: "$100", blurb: "Already confident? Book the practical assessment on its own." },
  { name: "Training + Assessment Bundle", price: "$275", blurb: "The Student Portal and assessment booking together." },
  { name: "Private Tuition", price: "$450", blurb: "One-on-one instruction for a tailored pace." },
];

export default function HomePage() {
  return (
    <>
      <section className="bg-gradient-to-b from-wcmt-navy to-wcmt-ocean px-6 py-20 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-4xl font-bold sm:text-5xl">
            Learn Online. Boat Safely. Pass With Confidence.
          </h1>
          <p className="mt-4 text-lg text-slate-200">
            Everything you need for your WA Recreational Skipper&apos;s Ticket —
            online training, assessment booking, and a lifetime reference library.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <ButtonLink href="/register" variant="primary">Start Learning</ButtonLink>
            <ButtonLink href="/assessment" variant="outline" className="border-white text-white hover:bg-white hover:text-wcmt-navy">
              Book Assessment
            </ButtonLink>
            <ButtonLink href="/faq" variant="outline" className="border-white text-white hover:bg-white hover:text-wcmt-navy">
              Request Callback
            </ButtonLink>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-heading text-2xl font-bold text-wcmt-navy">
            How It Works
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step} className="text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-wcmt-coastal font-heading font-bold text-white">
                  {i + 1}
                </div>
                <p className="mt-2 text-sm font-medium text-wcmt-navy">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-heading text-2xl font-bold text-wcmt-navy">
            Courses &amp; Pricing
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            Prices and availability are managed by WCMT and may change —
            current pricing is always shown at checkout.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.map((product) => (
              <Card key={product.name} className="flex flex-col">
                <h3 className="font-heading font-semibold text-wcmt-navy">{product.name}</h3>
                <p className="mt-1 font-heading text-2xl font-bold text-wcmt-orange">{product.price}</p>
                <p className="mt-2 flex-1 text-sm text-slate-600">{product.blurb}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
