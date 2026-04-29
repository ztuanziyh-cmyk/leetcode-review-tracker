import Link from "next/link";

import { Badge } from "@/components/badge";
import { Card } from "@/components/card";
import { PageShell } from "@/components/page-shell";
import { getDailyReviewItems } from "@/lib/review-logic";

export default function ReviewPage() {
  const reviewItems = getDailyReviewItems();
  const completedCount = reviewItems.filter((item) => item.completed).length;

  return (
    <PageShell
      eyebrow="Daily Queue"
      title="Today&apos;s review list"
      description="A generated queue that prioritizes overdue items, low confidence, recent misses, and weak-topic pressure. Interactions stay read-only in Phase 1."
      actions={
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          {completedCount} completed • {reviewItems.length - completedCount} remaining
        </div>
      }
    >
      <Card title="Priority rules" subtitle="Initial scoring is transparent so the list feels explainable, not arbitrary.">
        <div className="flex flex-wrap gap-2 text-sm text-slate-700">
          <span className="rounded-full bg-slate-100 px-3 py-2">+5 overdue review</span>
          <span className="rounded-full bg-slate-100 px-3 py-2">+4 confidence 1-2</span>
          <span className="rounded-full bg-slate-100 px-3 py-2">+3 latest non-accepted</span>
          <span className="rounded-full bg-slate-100 px-3 py-2">+2 weak topic overlap</span>
          <span className="rounded-full bg-slate-100 px-3 py-2">+1 recurring mistake type</span>
        </div>
      </Card>

      <div className="space-y-4">
        {reviewItems.map((item) => (
          <Card key={item.id}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/problems/${item.problem.slug}`}
                    className="text-lg font-semibold tracking-tight text-slate-950 hover:text-sky-700"
                  >
                    {item.problem.title}
                  </Link>
                  <Badge>{item.problem.difficulty}</Badge>
                  <Badge tone={item.completed ? "good" : "warn"}>
                    {item.completed ? "Reviewed" : "Pending"}
                  </Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.problem.topics.join(" • ")}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.reasons.map((reason) => (
                    <Badge key={reason}>{reason}</Badge>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.5rem] bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <p className="font-medium text-slate-950">Priority {item.priorityScore}</p>
                <p className="mt-1">Next review {item.reviewNote?.nextReviewAt?.slice(0, 10)}</p>
                <p className="mt-1">Confidence {item.reviewNote?.confidence ?? "—"} / 5</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
