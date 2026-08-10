import { PageHeader } from "@/components/patterns/page-header";

const ARTICLES = [
  { date: "Jan 2026", title: "Havyn Villa expands to five new cities across Nigeria" },
  { date: "Nov 2025", title: "Introducing AI-powered support for every guest and host" },
  { date: "Sep 2025", title: "How Havyn Villa verifies every host before they list" },
];

export default function NewsroomPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Newsroom"
        title="News & updates"
        description="Announcements, product updates, and press coverage from Havyn Villa."
      />
      <div className="mx-auto max-w-3xl px-6 py-10 space-y-3">
        {ARTICLES.map((a) => (
          <div key={a.title} className="rounded-2xl border border-line p-4">
            <p className="text-xs text-ink-muted">{a.date}</p>
            <p className="mt-1 text-sm font-medium text-ink">{a.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}