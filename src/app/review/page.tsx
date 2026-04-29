import { PageShell } from "@/components/page-shell";
import { ReviewOverview } from "@/components/review-overview";

export default function ReviewPage() {
  return (
    <PageShell
      eyebrow="Daily Queue"
      title="Today&apos;s review list"
      description="The review queue now includes locally saved problem notes with due dates, while preserving the seeded fallback queue when no local notes are due."
    >
      <ReviewOverview />
    </PageShell>
  );
}
