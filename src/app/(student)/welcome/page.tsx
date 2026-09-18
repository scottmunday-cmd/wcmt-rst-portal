import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasPaidAccess } from "@/lib/access";
import { PaywallGate } from "@/components/PaywallGate";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";

// Official DTMI paperwork students may need before assessment day (see
// Module 1, "Getting ready for assessment day"). Hosted as static files
// under public/forms — these are government forms meant for applicants to
// download and use, not training content, so there's no copyright concern
// in linking them here the way there is with the workbook itself.
const FORMS = [
  {
    href: "/forms/letter-of-consent.pdf",
    title: "Letter of Consent",
    detail: "Required if you're under 18 — signed by a parent or guardian.",
  },
  {
    href: "/forms/medical-eyesight-form.pdf",
    title: "Medical & Eyesight Declaration",
    detail: "For a medical practitioner, nurse or optometrist to complete if you don't have a driver's licence, or if you have a relevant medical condition.",
  },
  {
    href: "/forms/skills-recognition.pdf",
    title: "Skills Recognition",
    detail: "If you already hold an interstate/overseas skipper's licence or other marine qualifications.",
  },
];

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

export default async function WelcomePage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) redirect("/login");

  if (!(await hasPaidAccess(supabase, userData.user.id))) {
    return <PaywallGate />;
  }

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
          practical test before it&apos;s passed. Without adequate study, the
          theory test can be the hardest part of getting your Skipper&apos;s
          Ticket.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          Don&apos;t worry though! We&apos;ve got you covered with our
          easy-to-use study guide on the next page! Aside from passing the
          test, learning the theory well will give you all the information
          you need to boat safely once you&apos;re a qualified skipper!
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          Have fun studying, and if anything doesn&apos;t make sense, please
          feel free to reach out — Scotty, 0408 927 905.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          There are some forms below you may need to complete and bring
          with you on the day — see Module 1 for details. You can always
          click back to this page from &ldquo;How it Works&rdquo; at the
          top right of the screen.
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

      <Card>
        <h2 className="font-heading font-semibold text-wcmt-navy">Forms you might need</h2>
        <p className="mt-1 text-xs text-slate-500">
          Covered in Module 1 — download and fill these in ahead of assessment day if they apply to you.
        </p>
        <div className="mt-4 space-y-2">
          {FORMS.map((form) => (
            <a
              key={form.href}
              href={form.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 hover:border-wcmt-coastal"
            >
              <div>
                <p className="text-sm font-semibold text-wcmt-navy">{form.title}</p>
                <p className="mt-0.5 text-xs leading-snug text-slate-500">{form.detail}</p>
              </div>
              <span className="shrink-0 text-xs font-semibold text-wcmt-orange">Download ↓</span>
            </a>
          ))}
        </div>
      </Card>
    </div>
  );
}
