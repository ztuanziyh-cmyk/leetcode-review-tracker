import { PageShell } from "@/components/page-shell";
import { SubmissionsOverview } from "@/components/submissions-overview";

export default function SubmissionsPage() {
  return (
    <PageShell
      eyebrow="Activity Feed"
      title="Recent submissions"
      description="A reverse chronological view of recent LeetCode attempts. The page is intentionally simple in Phase 1, but the data model is already shaped for filtering and trend analysis."
    >
      <SubmissionsOverview />
    </PageShell>
  );
}
