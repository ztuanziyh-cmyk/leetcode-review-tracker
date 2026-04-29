import { Card } from "@/components/card";
import { PageShell } from "@/components/page-shell";
import { ProblemRow } from "@/components/problem-row";
import { getProblemsList } from "@/lib/review-logic";

export default function ProblemsPage() {
  const problems = getProblemsList();
  const lowConfidenceCount = problems.filter(
    (problem) => problem.reviewNote && problem.reviewNote.confidence <= 2,
  ).length;

  return (
    <PageShell
      eyebrow="Problem Bank"
      title="Tracked problems"
      description="A mock-data-first list of solved, attempted, and review-ready LeetCode problems. Filters are presented as Phase 1 UI scaffolding."
      actions={
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          {problems.length} tracked • {lowConfidenceCount} fragile
        </div>
      }
    >
      <Card
        title="Filter snapshot"
        subtitle="Phase 1 keeps these controls static while the data model and layout settle."
      >
        <div className="flex flex-wrap gap-2 text-sm text-slate-700">
          <span className="rounded-full bg-slate-100 px-3 py-2">Difficulty: All</span>
          <span className="rounded-full bg-slate-100 px-3 py-2">Topic: All</span>
          <span className="rounded-full bg-slate-100 px-3 py-2">Confidence: 1-5</span>
          <span className="rounded-full bg-slate-100 px-3 py-2">Review status: Any</span>
          <span className="rounded-full bg-sky-100 px-3 py-2 text-sky-800">
            Sorted by next review
          </span>
        </div>
      </Card>

      <div className="space-y-4">
        {problems.map((problem) => (
          <ProblemRow key={problem.slug} problem={problem} />
        ))}
      </div>
    </PageShell>
  );
}
