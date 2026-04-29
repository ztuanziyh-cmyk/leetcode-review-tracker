"use client";

import { useState } from "react";

import { Badge } from "@/components/badge";
import { Card } from "@/components/card";
import { StatCard } from "@/components/stat-card";
import type { LeetCodeSyncResult } from "@/lib/leetcode";

const DEFAULT_USERNAME = "Graphql";

function formatTimestamp(timestamp: string) {
  const date = new Date(Number(timestamp) * 1000);

  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function statusTone(status: string) {
  if (status === "Accepted") {
    return "good";
  }
  if (status === "Wrong Answer" || status === "Runtime Error") {
    return "bad";
  }
  return "warn";
}

export function SyncPreview() {
  const [username, setUsername] = useState(DEFAULT_USERNAME);
  const [result, setResult] = useState<LeetCodeSyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/leetcode/sync?username=${encodeURIComponent(username)}`,
        {
          method: "GET",
        },
      );

      const payload = (await response.json()) as
        | { data: LeetCodeSyncResult }
        | { error: string };

      if (!response.ok || !("data" in payload)) {
        setResult(null);
        setError("error" in payload ? payload.error : "Sync failed.");
        return;
      }

      setResult(payload.data);
    } catch {
      setResult(null);
      setError("Unable to reach the sync endpoint.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card
        title="Public username sync"
        subtitle="This fetches live public profile data from LeetCode GraphQL without login, cookies, or local persistence."
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">LeetCode username</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="e.g. Graphql"
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Syncing..." : "Sync preview"}
            </button>
            <p className="text-sm text-slate-600">
              Try `Graphql` or any public LeetCode username.
            </p>
          </div>
        </form>
      </Card>

      {error ? (
        <Card title="Sync error">
          <p className="text-sm leading-7 text-rose-700">{error}</p>
        </Card>
      ) : null}

      {result ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total solved"
              value={result.totalSolved}
              detail={`${result.easySolved} easy • ${result.mediumSolved} medium • ${result.hardSolved} hard`}
            />
            <StatCard
              label="Ranking"
              value={result.ranking ?? "—"}
              detail="Live public ranking from LeetCode profile data."
            />
            <StatCard
              label="Recent submissions"
              value={result.recentSubmissions.length}
              detail="Returned from the public recent submission list when available."
            />
            <StatCard
              label="Profile name"
              value={result.realName || result.username}
              detail={`Username: ${result.username}`}
            />
          </div>

          <Card title="Result summary" subtitle="This is the live payload normalized for the app.">
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              {result.userAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={result.userAvatar}
                  alt={`${result.username} avatar`}
                  className="h-16 w-16 rounded-2xl border border-slate-200 object-cover"
                />
              ) : null}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-semibold tracking-tight text-slate-950">
                    {result.realName || result.username}
                  </h3>
                  <Badge tone="good">@{result.username}</Badge>
                </div>
                <p className="text-sm leading-7 text-slate-600">
                  The sync preview is live but read-only. It does not update mock pages or save
                  anything to a database yet.
                </p>
              </div>
            </div>
          </Card>

          <Card
            title="Recent submissions preview"
            subtitle="The public feed can contain accepted and non-accepted attempts."
          >
            <div className="space-y-3">
              {result.recentSubmissions.length ? (
                result.recentSubmissions.slice(0, 12).map((submission) => (
                  <div
                    key={`${submission.titleSlug}-${submission.timestamp}-${submission.lang}`}
                    className="grid gap-3 rounded-[1.5rem] border border-slate-200 p-4 md:grid-cols-[minmax(0,1.4fr)_auto_auto] md:items-center"
                  >
                    <div>
                      <p className="text-base font-semibold text-slate-950">{submission.title}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {submission.titleSlug} • {formatTimestamp(submission.timestamp)}
                      </p>
                    </div>
                    <Badge tone={statusTone(submission.statusDisplay)}>
                      {submission.statusDisplay}
                    </Badge>
                    <p className="text-sm text-slate-600">{submission.lang}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-7 text-slate-600">
                  No recent public submissions were returned for this user.
                </p>
              )}
            </div>
          </Card>
        </>
      ) : null}
    </div>
  );
}
