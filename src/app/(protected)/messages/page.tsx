import { EmptyState } from "@/components/patterns/empty-state";

export default function MessagesPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <h1 className="font-display text-2xl font-semibold text-ink">Messages</h1>
      <div className="mt-8">
        <EmptyState
          icon="chatCircle"
          title="No conversations yet"
          description="Guest ↔ host messaging per booking/property lands with prompt 16."
        />
      </div>
    </div>
  );
}
