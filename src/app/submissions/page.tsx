import { Card } from "@/components/card";
import { PageShell } from "@/components/page-shell";
import { SubmissionRow } from "@/components/submission-row";
import { getRecentSubmissions } from "@/lib/review-logic";

export default function SubmissionsPage() {
  const submissions = getRecentSubmissions();
  const acceptedCount = submissions.filter((submission) => submission.status === "Accepted").length;

  return (
    <PageShell
      eyebrow="Activity Feed"
      title="Recent submissions"
      description="A reverse chronological view of recent LeetCode attempts. The page is intentionally simple in Phase 1, but the data model is already shaped for filtering and trend analysis."
      actions={
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          {acceptedCount} accepted • {submissions.length - acceptedCount} misses
        </div>
      }
    >
      <Card title="Submission timeline" subtitle="Mixed outcomes are useful because they feed future weak-topic and daily review logic.">
        <div className="space-y-3">
          {submissions.map((submission) => (
            <SubmissionRow
              key={submission.id}
              submission={submission}
              problem={submission.problem}
            />
          ))}
        </div>
      </Card>
    </PageShell>
  );
}
