import { Skeleton } from "@/components/ui/skeleton";

/** Route-level `loading.tsx` fallback — skeleton, never a spinner (see project guidance). */
export function ResultsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>
          <Skeleton className="aspect-square w-full rounded-xl" />
          <Skeleton className="mt-2 h-4 w-3/4" />
          <Skeleton className="mt-1.5 h-4 w-1/2" />
          <Skeleton className="mt-1.5 h-4 w-1/3" />
        </div>
      ))}
    </div>
  );
}
