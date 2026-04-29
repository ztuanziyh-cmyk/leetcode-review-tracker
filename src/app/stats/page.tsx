import { Card } from "@/components/card";
import { PageShell } from "@/components/page-shell";
import { StatCard } from "@/components/stat-card";
import { TopicMeter } from "@/components/topic-meter";
import { getStatisticsData } from "@/lib/review-logic";

export default function StatsPage() {
  const stats = getStatisticsData();

  return (
    <PageShell
      eyebrow="Signals"
      title="Statistics and weak topics"
      description="Phase 1 focuses on a readable snapshot: solved mix, review confidence, submission outcomes, and topics that most often create friction."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Solved problems"
          value={
            stats.solvedByDifficulty.Easy +
            stats.solvedByDifficulty.Medium +
            stats.solvedByDifficulty.Hard
          }
          detail="Current mock dataset size for tracked LeetCode problems."
        />
        <StatCard
          label="Accepted submissions"
          value={stats.acceptedCount}
          detail="Accepted runs included in the recent submission seed data."
        />
        <StatCard
          label="Low confidence notes"
          value={stats.confidenceBuckets.low}
          detail="Problems most likely to appear in the daily review queue."
        />
        <StatCard
          label="Non-accepted submissions"
          value={stats.nonAcceptedCount}
          detail="Wrong answer, runtime, or time-limit outcomes in the feed."
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Solved by difficulty">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.5rem] bg-emerald-50 p-4">
              <p className="text-sm text-emerald-700">Easy</p>
              <p className="mt-2 text-3xl font-semibold text-emerald-950">
                {stats.solvedByDifficulty.Easy}
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-amber-50 p-4">
              <p className="text-sm text-amber-700">Medium</p>
              <p className="mt-2 text-3xl font-semibold text-amber-950">
                {stats.solvedByDifficulty.Medium}
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-rose-50 p-4">
              <p className="text-sm text-rose-700">Hard</p>
              <p className="mt-2 text-3xl font-semibold text-rose-950">
                {stats.solvedByDifficulty.Hard}
              </p>
            </div>
          </div>
        </Card>

        <Card title="Confidence distribution">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.5rem] bg-rose-50 p-4">
              <p className="text-sm text-rose-700">Low</p>
              <p className="mt-2 text-3xl font-semibold text-rose-950">
                {stats.confidenceBuckets.low}
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-amber-50 p-4">
              <p className="text-sm text-amber-700">Medium</p>
              <p className="mt-2 text-3xl font-semibold text-amber-950">
                {stats.confidenceBuckets.medium}
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-sky-50 p-4">
              <p className="text-sm text-sky-700">High</p>
              <p className="mt-2 text-3xl font-semibold text-sky-950">
                {stats.confidenceBuckets.high}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Card title="Weak topics" subtitle="Calculated from low confidence, misses, and repeated exposure.">
          <div className="space-y-4">
            {stats.weakTopics.map((topic) => (
              <TopicMeter key={topic.topic} {...topic} />
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card title="Mistake types">
            <div className="space-y-3">
              {stats.mistakeCounts.slice(0, 6).map(([mistakeType, count]) => (
                <div key={mistakeType} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">{mistakeType}</span>
                  <span className="font-medium text-slate-950">{count}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Patterns tagged">
            <div className="space-y-3">
              {stats.patternCounts.slice(0, 6).map(([pattern, count]) => (
                <div key={pattern} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">{pattern}</span>
                  <span className="font-medium text-slate-950">{count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
