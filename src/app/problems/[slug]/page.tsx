import { notFound } from "next/navigation";

import { Badge } from "@/components/badge";
import { Card } from "@/components/card";
import { PageShell } from "@/components/page-shell";
import { ProblemRow } from "@/components/problem-row";
import { getProblemDetail } from "@/lib/review-logic";

type ProblemDetailPageProps = {
  params: Promise<{ slug: string }>;
};

function difficultyTone(difficulty: "Easy" | "Medium" | "Hard") {
  if (difficulty === "Easy") {
    return "easy";
  }
  if (difficulty === "Medium") {
    return "medium";
  }
  return "hard";
}

export default async function ProblemDetailPage({ params }: ProblemDetailPageProps) {
  const { slug } = await params;
  const detail = getProblemDetail(slug);

  if (!detail) {
    notFound();
  }

  const { problem, reviewNote, submissions, relatedProblems, confidenceLabel } = detail;

  return (
    <PageShell
      eyebrow="Problem Review"
      title={problem.title}
      description="Imported problem metadata and manual review fields are shown side by side. Editing is deferred; this phase establishes the structure and information density."
      actions={
        <div className="flex flex-wrap gap-2">
          <Badge tone={difficultyTone(problem.difficulty)}>{problem.difficulty}</Badge>
          <Badge>{problem.status}</Badge>
        </div>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(20rem,0.9fr)]">
        <div className="space-y-6">
          <Card title="Problem metadata" subtitle="Imported from the mock LeetCode dataset.">
            <dl className="grid gap-4 text-sm text-slate-700 sm:grid-cols-2">
              <div>
                <dt className="font-medium text-slate-500">Topics</dt>
                <dd className="mt-1 leading-6">{problem.topics.join(" • ")}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Acceptance rate</dt>
                <dd className="mt-1">{problem.acceptanceRate}%</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">First solved</dt>
                <dd className="mt-1">{problem.firstSolvedAt?.slice(0, 10)}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Last solved</dt>
                <dd className="mt-1">{problem.lastSolvedAt?.slice(0, 10)}</dd>
              </div>
            </dl>
          </Card>

          <Card title="Recent submissions" subtitle="Most recent activity for this single problem.">
            <div className="space-y-3">
              {submissions.length ? (
                submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex flex-col gap-2 rounded-[1.5rem] border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">{submission.status}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {submission.submittedAt.slice(0, 16)} • {submission.language}
                      </p>
                    </div>
                    <p className="text-sm text-slate-600">
                      {submission.runtimeMs
                        ? `${submission.runtimeMs} ms • ${submission.memoryMb} MB`
                        : "No runtime or memory captured"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-600">No submissions yet in the mock dataset.</p>
              )}
            </div>
          </Card>

          <Card title="Related review candidates" subtitle="Nearby problems that share overlapping topics.">
            <div className="space-y-3">
              {relatedProblems.map((relatedProblem) => (
                <ProblemRow key={relatedProblem.slug} problem={relatedProblem} />
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Review note" subtitle="Manual metadata that drives the review workflow.">
            {reviewNote ? (
              <div className="space-y-5 text-sm text-slate-700">
                <div className="flex flex-wrap gap-2">
                  <Badge tone="good">{confidenceLabel}</Badge>
                  <Badge>{reviewNote.mistakeType}</Badge>
                  <Badge>{reviewNote.pattern}</Badge>
                </div>
                <div>
                  <p className="font-medium text-slate-500">Summary</p>
                  <p className="mt-2 leading-7">{reviewNote.summary}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-500">Key takeaway</p>
                  <p className="mt-2 leading-7">{reviewNote.keyTakeaway}</p>
                </div>
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="font-medium text-slate-500">Confidence</dt>
                    <dd className="mt-1">{reviewNote.confidence} / 5</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-slate-500">Review count</dt>
                    <dd className="mt-1">{reviewNote.reviewCount}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-slate-500">Last reviewed</dt>
                    <dd className="mt-1">{reviewNote.lastReviewedAt?.slice(0, 10)}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-slate-500">Next review</dt>
                    <dd className="mt-1">{reviewNote.nextReviewAt?.slice(0, 10)}</dd>
                  </div>
                </dl>
              </div>
            ) : (
              <p className="text-sm leading-7 text-slate-600">
                No review note exists yet. Phase 1 exposes the shape of the note model without
                adding editing interactions.
              </p>
            )}
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
