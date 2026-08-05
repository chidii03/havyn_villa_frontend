import { EmptyState } from "@/components/patterns/empty-state";
import { cn } from "@/lib/utils";
import { PropertyCard, type PropertyCardData } from "./property-card";

export function ResultsGrid({
  properties,
  hoveredId,
  onHoverChange,
}: {
  properties: PropertyCardData[];
  hoveredId?: string | null;
  onHoverChange?: (id: string | null) => void;
}) {
  if (properties.length === 0) {
    return (
      <EmptyState
        icon="search"
        title="No stays match your search"
        description="Try adjusting your dates, price range, category, or filters."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {properties.map((property) => (
        <div
          key={property.id}
          onMouseEnter={() => onHoverChange?.(property.id)}
          onMouseLeave={() => onHoverChange?.(null)}
          className={cn(
            "rounded-xl transition-shadow",
            hoveredId === property.id && "shadow-sm",
          )}
        >
          <PropertyCard property={property} />
        </div>
      ))}
    </div>
  );
}
