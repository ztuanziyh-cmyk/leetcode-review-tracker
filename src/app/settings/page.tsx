import { PageShell } from "@/components/page-shell";
import { SettingsOverview } from "@/components/settings-overview";

export default function SettingsPage() {
  return (
    <PageShell
      eyebrow="Settings"
      title="Local data backup"
      description="Back up, restore, or clear the LeetCode Review Tracker data stored locally in this browser."
    >
      <SettingsOverview />
    </PageShell>
  );
}
