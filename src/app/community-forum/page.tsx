import { PageHeader } from "@/components/patterns/page-header";

const TOPICS = [
  { title: "Best practices for pricing during holidays", replies: 24, category: "Pricing" },
  { title: "How do you handle last-minute cancellations?", replies: 41, category: "Operations" },
  { title: "Photography tips that actually increase bookings", replies: 18, category: "Listings" },
  { title: "Sharing my first-year hosting numbers", replies: 63, category: "General" },
];

export default function CommunityForumPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Hosting"
        title="Community forum"
        description="Connect with other Havyn Villa hosts, ask questions, and share what's working for you."
      />
      <div className="mx-auto max-w-3xl px-6 py-10 space-y-3">
        {TOPICS.map((topic) => (
          <div key={topic.title} className="flex items-center justify-between rounded-2xl border border-line p-4">
            <div>
              <p className="text-xs font-medium text-brand">{topic.category}</p>
              <p className="mt-1 text-sm font-medium text-ink">{topic.title}</p>
            </div>
            <span className="shrink-0 text-xs text-ink-muted">{topic.replies} replies</span>
          </div>
        ))}
        <p className="pt-4 text-center text-sm text-ink-muted">
          Forum discussions are illustrative — connect this page to your real community platform when it's ready.
        </p>
      </div>
    </div>
  );
}