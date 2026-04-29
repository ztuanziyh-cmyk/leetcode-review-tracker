import { PageShell } from "@/components/page-shell";
import { SyncPreview } from "@/components/sync-preview";

export default function SyncPage() {
  return (
    <PageShell
      eyebrow="Live Preview"
      title="LeetCode public sync"
      description="Fetch a real public LeetCode profile by username and preview the normalized data that a future persistence layer can save."
    >
      <SyncPreview />
    </PageShell>
  );
}
