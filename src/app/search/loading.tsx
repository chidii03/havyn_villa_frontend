import { ResultsGridSkeleton } from "@/components/property/results-grid-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function SearchLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-2 h-4 w-40" />
      <Skeleton className="mt-5 h-11 w-full rounded-full" />
      <div className="mt-6">
        <ResultsGridSkeleton />
      </div>
    </div>
  );
}
