"use client";

import { Badge } from "@/components/badge";
import { Card } from "@/components/card";
import { DataSourceBadge } from "@/components/data-source-badge";
import { ProblemRow } from "@/components/problem-row";
import { getSyncedTrackedProblemDetail } from "@/lib/local-synced-problems";
import { useLocalSyncResult } from "@/lib/use-local-sync-result";
import type { getProblemDetail } from "@/lib/review-logic";

type MockProblemDetail = ReturnType<typeof getProblemDetail>;

type ProblemDetailContentProps = {
  slug: string;
  mockDetail: MockProblemDetail;
};

function formatSyncTimestamp(timestamp: string) {
  return new Date(Number(timestamp) * 1000).toISOString().slice(0, 16);
}

export function ProblemDetailContent({
  slug,
  mockDetail,
}: ProblemDetailContentProps) {
  const storedSync = useLocalSyncResult();
  const syncedDetail = getSyncedTrackedProblemDetail(storedSync?.data, slug);

  if (mockDetail) {
    const { problem, reviewNote, submissions, relatedProblems, confidenceLabel } = mockDetail;

    return (
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
    );
  }

  if (syncedDetail) {
    return (
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.85fr)]">
        <div className="space-y-6">
          <Card
            title="Synced problem metadata"
            subtitle="Derived from recent public LeetCode submissions stored locally."
          >
            <div className="space-y-4 text-sm text-slate-700">
              <DataSourceBadge live />
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="font-medium text-slate-500">Difficulty</dt>
                  <dd className="mt-1">Unknown</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-500">Tracked status</dt>
                  <dd className="mt-1">{syncedDetail.problem.status}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-500">Latest status</dt>
                  <dd className="mt-1">{syncedDetail.problem.latestStatus}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-500">Latest submitted</dt>
                  <dd className="mt-1">{syncedDetail.problem.latestSubmittedAt.slice(0, 16)}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="font-medium text-slate-500">Topics</dt>
                  <dd className="mt-1">Unavailable from recent submissions.</dd>
                </div>
              </dl>
            </div>
          </Card>

          <Card title="Recent synced submissions" subtitle="Only fields exposed by the public sync are shown here.">
            <div className="space-y-3">
              {syncedDetail.submissions.map((submission) => (
                <div
                  key={`${submission.titleSlug}-${submission.timestamp}-${submission.lang}`}
                  className="flex flex-col gap-2 rounded-[1.5rem] border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{submission.statusDisplay}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {formatSyncTimestamp(submission.timestamp)} • {submission.lang}
                    </p>
                  </div>
                  <p className="text-sm text-slate-600">{submission.titleSlug}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card
            title="Review note"
            subtitle="Review fields are not available yet for synced-only problems."
          >
            <p className="text-sm leading-7 text-slate-600">
              This detail page is derived from the latest local sync preview. Difficulty, topics,
              and manual review notes will remain empty until a fuller tracked-problem model is
              added.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <Card
      title="Problem not found"
      subtitle="No matching mock problem or locally synced submission was found for this slug."
    >
      <p className="text-sm leading-7 text-slate-600">
        If this problem came from a live sync, open `/sync` and run a sync again to refresh the
        locally stored recent submissions.
      </p>
    </Card>
  );
}
