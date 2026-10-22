import { Card } from "@/components/ui/Card";
import { TestSmsForm } from "@/components/admin/TestSmsForm";

export default function AdminTestSmsPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold text-wcmt-navy">Test SMS</h1>
      <p className="text-sm text-slate-600">
        Sends a real text via ClickSend using the live template from{" "}
        <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">sms_templates</code> — this is
        exactly what a student would receive, so it&apos;s a true preview of wording, links and
        message length before anyone else sees it.
      </p>
      <Card className="max-w-xl">
        <TestSmsForm />
      </Card>
    </div>
  );
}
