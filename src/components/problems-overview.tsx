"use client";

import { useState } from "react";

import { Card } from "@/components/card";
import { DataSourceBadge } from "@/components/data-source-badge";
import { ProblemRow } from "@/components/problem-row";
import { SyncedProblemRow } from "@/components/synced-problem-row";
import { getReviewNoteSummary } from "@/lib/local-review-notes";
import { deriveTrackedProblemsFromSync } from "@/lib/local-synced-problems";
import { getProblemsList } from "@/lib/review-logic";
import { useLocalReviewNotes } from "@/lib/use-local-review-notes";
import { useLocalSyncResult } from "@/lib/use-local-sync-result";

const fallbackProblems = getProblemsList();
const sortOptions = [
  "Latest submitted",
  "Title A-Z",
  "Difficulty",
  "Confidence low to high",
  "Next review date",
] as const;

const difficultyOrder: Record<string, number> = {
  Easy: 0,
  Medium: 1,
  Hard: 2,
  Unknown: 3,
};

export function ProblemsOverview() {
  const storedSync = useLocalSyncResult();
  const localReviewNotes = useLocalReviewNotes();
  const syncedProblems = deriveTrackedProblemsFromSync(storedSync?.data);
  const usingLiveData = syncedProblems.length > 0;
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [topicFilter, setTopicFilter] = useState("All");
  const [reviewStateFilter, setReviewStateFilter] = useState("All");
  const [confidenceFilter, setConfidenceFilter] = useState("All");
  const [mistakeTypeFilter, setMistakeTypeFilter] = useState("All");
  const [patternFilter, setPatternFilter] = useState("All");
  const [sortBy, setSortBy] =
    useState<(typeof sortOptions)[number]>("Latest submitted");

  const sourceProblems = usingLiveData ? syncedProblems : fallbackProblems;
  const enrichedProblems = sourceProblems.map((problem) => {
    const reviewSummary = getReviewNoteSummary(
      localReviewNotes[problem.slug],
      "reviewNote" in problem ? problem.reviewNote : undefined,
    );

    return {
      problem,
      reviewSummary,
      searchText: `${problem.title} ${problem.slug}`.toLowerCase(),
      latestSubmittedAt:
        "latestSubmittedAt" in problem
          ? problem.latestSubmittedAt
          : (problem.latestSubmission?.submittedAt ?? problem.lastSolvedAt ?? ""),
      difficulty: problem.difficulty,
      topics: problem.topics,
    };
  });

  const availableTopics = [...new Set(enrichedProblems.flatMap((item) => item.topics))].sort();
  const availableMistakeTypes = [
    ...new Set(
      enrichedProblems
        .map((item) => item.reviewSummary.mistakeType)
        .filter((value) => value),
    ),
  ].sort();
  const availablePatterns = [
    ...new Set(
      enrichedProblems
        .map((item) => item.reviewSummary.pattern)
        .filter((value) => value),
    ),
  ].sort();

  const filteredProblems = enrichedProblems
    .filter((item) =>
      search ? item.searchText.includes(search.trim().toLowerCase()) : true,
    )
    .filter((item) =>
      difficultyFilter === "All" ? true : item.difficulty === difficultyFilter,
    )
    .filter((item) =>
      topicFilter === "All" ? true : item.topics.includes(topicFilter),
    )
    .filter((item) =>
      reviewStateFilter === "All"
        ? true
        : item.reviewSummary.reviewState === reviewStateFilter,
    )
    .filter((item) => {
      if (confidenceFilter === "All") {
        return true;
      }
      if (confidenceFilter === "Missing") {
        return item.reviewSummary.confidence === null;
      }
      return String(item.reviewSummary.confidence ?? "") === confidenceFilter;
    })
    .filter((item) =>
      mistakeTypeFilter === "All"
        ? true
        : item.reviewSummary.mistakeType === mistakeTypeFilter,
    )
    .filter((item) =>
      patternFilter === "All" ? true : item.reviewSummary.pattern === patternFilter,
    )
    .sort((left, right) => {
      if (sortBy === "Title A-Z") {
        return left.problem.title.localeCompare(right.problem.title);
      }

      if (sortBy === "Difficulty") {
        return (
          difficultyOrder[left.difficulty] - difficultyOrder[right.difficulty] ||
          left.problem.title.localeCompare(right.problem.title)
        );
      }

      if (sortBy === "Confidence low to high") {
        return (
          (left.reviewSummary.confidence ?? 99) -
            (right.reviewSummary.confidence ?? 99) ||
          left.problem.title.localeCompare(right.problem.title)
        );
      }

      if (sortBy === "Next review date") {
        return (
          (left.reviewSummary.nextReviewDate || "9999-99-99").localeCompare(
            right.reviewSummary.nextReviewDate || "9999-99-99",
          ) || left.problem.title.localeCompare(right.problem.title)
        );
      }

      return (
        right.latestSubmittedAt.localeCompare(left.latestSubmittedAt) ||
        left.problem.title.localeCompare(right.problem.title)
      );
    });

  function resetFilters() {
    setSearch("");
    setDifficultyFilter("All");
    setTopicFilter("All");
    setReviewStateFilter("All");
    setConfidenceFilter("All");
    setMistakeTypeFilter("All");
    setPatternFilter("All");
    setSortBy("Latest submitted");
  }

  return (
    <div className="space-y-6">
      <Card
        title="Search, filters, and sorting"
        subtitle="The list prefers synced local submissions when available and falls back to the built-in sample set otherwise."
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <DataSourceBadge live={usingLiveData} />
            <p className="text-sm text-slate-600">
              Showing {filteredProblems.length} of {enrichedProblems.length} problems
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Reset filters
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title or slug"
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />

            <select
              value={difficultyFilter}
              onChange={(event) => setDifficultyFilter(event.target.value)}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            >
              {["All", "Easy", "Medium", "Hard", "Unknown"].map((option) => (
                <option key={option} value={option}>
                  Difficulty: {option}
                </option>
              ))}
            </select>

            <select
              value={topicFilter}
              onChange={(event) => setTopicFilter(event.target.value)}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            >
              <option value="All">Topic: All</option>
              {availableTopics.map((topic) => (
                <option key={topic} value={topic}>
                  Topic: {topic}
                </option>
              ))}
            </select>

            <select
              value={reviewStateFilter}
              onChange={(event) => setReviewStateFilter(event.target.value)}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            >
              {["All", "New", "Need Review", "Reviewing", "Mastered"].map((option) => (
                <option key={option} value={option}>
                  Review state: {option}
                </option>
              ))}
            </select>

            <select
              value={confidenceFilter}
              onChange={(event) => setConfidenceFilter(event.target.value)}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            >
              {["All", "1", "2", "3", "4", "5", "Missing"].map((option) => (
                <option key={option} value={option}>
                  Confidence: {option}
                </option>
              ))}
            </select>

            <select
              value={mistakeTypeFilter}
              onChange={(event) => setMistakeTypeFilter(event.target.value)}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            >
              <option value="All">Mistake type: All</option>
              {availableMistakeTypes.map((mistakeType) => (
                <option key={mistakeType} value={mistakeType}>
                  Mistake type: {mistakeType}
                </option>
              ))}
            </select>

            <select
              value={patternFilter}
              onChange={(event) => setPatternFilter(event.target.value)}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            >
              <option value="All">Pattern: All</option>
              {availablePatterns.map((pattern) => (
                <option key={pattern} value={pattern}>
                  Pattern: {pattern}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as (typeof sortOptions)[number])
              }
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            >
              {sortOptions.map((option) => (
                <option key={option} value={option}>
                  Sort: {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {filteredProblems.length ? (
        <div className="space-y-4">
          {filteredProblems.map((item) =>
            usingLiveData ? (
              <SyncedProblemRow
                key={item.problem.slug}
                problem={item.problem}
                localReviewNote={localReviewNotes[item.problem.slug]}
              />
            ) : (
              <ProblemRow
                key={item.problem.slug}
                problem={item.problem}
                localReviewNote={localReviewNotes[item.problem.slug]}
              />
            ),
          )}
        </div>
      ) : (
        <Card title="No matching problems" subtitle="Try broadening the filters or resetting them.">
          <p className="text-sm leading-7 text-slate-600">
            No problems match the current search, filter, and sort settings.
          </p>
        </Card>
      )}
    </div>
  );
}
