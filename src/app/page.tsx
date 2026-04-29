import Link from "next/link";

import { Badge } from "@/components/badge";
import { Card } from "@/components/card";
import { PageShell } from "@/components/page-shell";
import { StatCard } from "@/components/stat-card";
import { SubmissionRow } from "@/components/submission-row";
import { TopicMeter } from "@/components/topic-meter";
import { getDashboardData } from "@/lib/review-logic";

export default function Home() {
  const data = getDashboardData();

  return (
    <PageShell
      eyebrow="Dashboard"
      title="Review workflow snapshot"
      description="A focused home view for today’s queue, recent activity, and the weak spots that should drive the next review session."
      actions={
        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <p className="font-medium text-slate-950">@{data.userProfile.username}</p>
          <p className="mt-1">Last synced {data.userProfile.lastSyncedAt?.slice(0, 10)}</p>
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Solved total"
          value={data.userProfile.totalSolved ?? 0}
          detail={`${data.userProfile.easySolved} easy • ${data.userProfile.mediumSolved} medium • ${data.userProfile.hardSolved} hard`}
        />
        <StatCard
          label="Tracked reviews"
          value={data.reviewTrackedCount}
          detail="Problems with confidence, pattern, and takeaway notes."
        />
        <StatCard
          label="Today’s queue"
          value={data.todayReviewCount}
          detail={`${data.overdueCount} items are already overdue for review.`}
        />
        <StatCard
          label="Current streak"
          value={data.userProfile.streakDays ?? 0}
          detail="Days with recent solving or review activity."
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Card title="Daily review preview" subtitle="Highest-priority items should be one click away.">
          <div className="space-y-3">
            {data.weakTopics.slice(0, 3).map((topic) => (
              <TopicMeter key={topic.topic} {...topic} />
            ))}
          </div>
          <Link
            href="/review"
            className="mt-5 inline-flex rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Open daily review
          </Link>
        </Card>

        <Card title="Sync profile" subtitle="Public username sync is mocked for this phase.">
          <div className="space-y-4 text-sm text-slate-700">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <p className="font-medium text-slate-950">{data.userProfile.displayName}</p>
              <p className="mt-1">@{data.userProfile.username}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="good">Public sync only</Badge>
              <Badge>No auth</Badge>
              <Badge>No API calls yet</Badge>
            </div>
            <p className="leading-7">
              The first implementation treats sync data as seeded local fixtures so the UI and
              review model can stabilize before networking and persistence are introduced.
            </p>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Card title="Recent submissions" subtitle="Latest attempts feed the review queue.">
          <div className="space-y-3">
            {data.recentSubmissions.map((submission) => (
              <SubmissionRow
                key={submission.id}
                submission={submission}
                problem={submission.problem}
              />
            ))}
          </div>
        </Card>

        <Card title="Weak topic watchlist" subtitle="Topics with low confidence and recent misses rise first.">
          <div className="space-y-4">
            {data.weakTopics.map((topic) => (
              <TopicMeter key={topic.topic} {...topic} />
            ))}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
