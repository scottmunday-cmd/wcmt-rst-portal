import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";

// Shown once between a student finishing checkout and landing on the
// dashboard (linked from /checkout/success), and always reachable again
// from the student nav ("How it Works") for anyone who wants a refresher.
// Purpose per Scotty: get students studying for the theory test before
// assessment day, and give them a quick guide to how the study portal works.
const STEPS = [
  {
    title: "Work through each module",
    detail:
      "Click into a module, read through the lesson content, and use the Listen button if you'd rather have it read out to you.",
  },
  {
    title: "Complete the quiz",
    detail:
      "Every module ends with a short quiz — finish it to check the information has actually sunk in before you move on.",
  },
  {
    title: "Repeat until all modules are done",
    detail: "Work through the modules in order — each one builds on the last.",
  },
  {
    title: "Practice exams",
    detail:
      "Once you've finished the modules, move on to the practice exams. They're very similar to your assessment on the day — keep sitting them until you're consistently acing it.",
  },
];

export default function WelcomePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <h1 className="font-heading text-2xl font-bold text-wcmt-navy">
          Well done on completing your booking!
        </h1>
        <p className="mt-1 text-sm text-wcmt-coastal">
          That&apos;s the first step towards your Skipper&apos;s Ticket.
        </p>
      </div>

      <Card>
        <p className="text-sm leading-relaxed text-slate-700">
          The next step is to study for your theory test. Your theory test is
          held first on your assessment day, and you can&apos;t move onto the
          practical test before it&apos;s passed. Not only that — learning the
          theory well will give you all the information you need to boat
          safely once you&apos;re a qualified skipper!
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          Without adequate study, the theory test can be the hardest part of
          getting your Skipper&apos;s Ticket. Don&apos;t worry though — we&apos;ve got
          you covered with our easy-to-use study guide on the next page.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          Have fun studying, and if anything doesn&apos;t make sense, please
          feel free to reach out.
        </p>
      </Card>

      <Card>
        <h2 className="font-heading font-semibold text-wcmt-navy">How the study guide works</h2>
        <ol className="mt-4 space-y-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-wcmt-navy text-xs font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-wcmt-navy">{step.title}</p>
                <p className="mt-0.5 text-sm leading-snug text-slate-600">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <div className="flex flex-wrap justify-center gap-3">
        <ButtonLink href="/modules" variant="primary">
          Start with Module 1
        </ButtonLink>
        <ButtonLink href="/dashboard" variant="outline">
          Go to Dashboard
        </ButtonLink>
      </div>
    </div>
  );
}
