import Link from "next/link";

import { Badge } from "@/components/badge";
import type { SyncedTrackedProblem } from "@/lib/types";

export function SyncedProblemRow({
  problem,
}: {
  problem: SyncedTrackedProblem;
}) {
  return (
    <Link
      href={`/problems/${problem.slug}`}
      className="grid gap-4 rounded-[1.5rem] border border-slate-200 p-4 transition hover:border-sky-300 hover:bg-sky-50/40 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_auto]"
    >
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold text-slate-950">{problem.title}</h3>
          <Badge>{problem.difficulty}</Badge>
          <Badge tone={problem.status === "accepted" ? "good" : "warn"}>
            {problem.status}
          </Badge>
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Topics unavailable from recent submissions.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={problem.latestStatus === "Accepted" ? "good" : "warn"}>
          Latest: {problem.latestStatus}
        </Badge>
        <Badge>Review notes unavailable</Badge>
      </div>

      <div className="text-sm leading-6 text-slate-600 md:text-right">
        <p>Latest submitted</p>
        <p className="font-medium text-slate-900">{problem.latestSubmittedAt.slice(0, 16)}</p>
      </div>
    </Link>
  );
}
