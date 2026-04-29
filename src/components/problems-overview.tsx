"use client";

import { Card } from "@/components/card";
import { DataSourceBadge } from "@/components/data-source-badge";
import { ProblemRow } from "@/components/problem-row";
import { SyncedProblemRow } from "@/components/synced-problem-row";
import { deriveTrackedProblemsFromSync } from "@/lib/local-synced-problems";
import { getProblemsList } from "@/lib/review-logic";
import { useLocalSyncResult } from "@/lib/use-local-sync-result";

const fallbackProblems = getProblemsList();

export function ProblemsOverview() {
  const storedSync = useLocalSyncResult();
  const syncedProblems = deriveTrackedProblemsFromSync(storedSync?.data);
  const usingLiveData = syncedProblems.length > 0;
  const lowConfidenceCount = fallbackProblems.filter(
    (problem) => problem.reviewNote && problem.reviewNote.confidence <= 2,
  ).length;

  return (
    <div className="space-y-6">
      <Card
        title="Filter snapshot"
        subtitle="The list prefers synced local submissions when available, while filters remain static in this phase."
      >
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
          <DataSourceBadge live={usingLiveData} />
          <span className="rounded-full bg-slate-100 px-3 py-2">Difficulty: All</span>
          <span className="rounded-full bg-slate-100 px-3 py-2">Topic: All</span>
          <span className="rounded-full bg-slate-100 px-3 py-2">Confidence: 1-5</span>
          <span className="rounded-full bg-slate-100 px-3 py-2">Review status: Any</span>
          <span className="rounded-full bg-slate-100 px-3 py-2">
            {usingLiveData
              ? `${syncedProblems.length} tracked from sync`
              : `${fallbackProblems.length} tracked • ${lowConfidenceCount} fragile`}
          </span>
          <span className="rounded-full bg-sky-100 px-3 py-2 text-sky-800">
            {usingLiveData ? "Sorted by latest submitted" : "Sorted by next review"}
          </span>
        </div>
      </Card>

      <div className="space-y-4">
        {usingLiveData
          ? syncedProblems.map((problem) => (
              <SyncedProblemRow key={problem.slug} problem={problem} />
            ))
          : fallbackProblems.map((problem) => (
              <ProblemRow key={problem.slug} problem={problem} />
            ))}
      </div>
    </div>
  );
}
