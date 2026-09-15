import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { ProfileSettingsForm } from "@/components/ProfileSettingsForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("mobile, sms_consent")
    .eq("id", userData.user.id)
    .single<{ mobile: string | null; sms_consent: boolean }>();

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="font-heading text-2xl font-bold text-wcmt-navy">Settings</h1>
      <Card>
        <h2 className="font-heading font-semibold text-wcmt-navy">SMS Notifications</h2>
        <p className="mt-1 text-sm text-slate-600">
          Add your mobile number to receive a text when your booking is confirmed, and a
          reminder 2 days before your assessment.
        </p>
        <div className="mt-4">
          <ProfileSettingsForm
            initialMobile={profile?.mobile ?? null}
            initialSmsConsent={profile?.sms_consent ?? false}
          />
        </div>
      </Card>
    </div>
  );
}
