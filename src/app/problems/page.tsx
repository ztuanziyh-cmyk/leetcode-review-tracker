import { PageShell } from "@/components/page-shell";
import { ProblemsOverview } from "@/components/problems-overview";

export default function ProblemsPage() {
  return (
    <PageShell
      eyebrow="Problem Bank"
      title="Tracked problems"
      description="A tracked problem list that now prefers locally synced submission-derived problems when available, while preserving the mock review model as fallback."
    >
      <ProblemsOverview />
    </PageShell>
  );
}
