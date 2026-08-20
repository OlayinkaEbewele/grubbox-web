import { Skeleton, SkeletonScreen } from "@/components/ui/Skeleton";

/**
 * Stand-in for a RestaurantCard: the same 220px cover, the same two-line
 * footer. Matching the real card's shape is the whole point — a skeleton that
 * settles into a different layout reads as a second load rather than the same
 * one finishing.
 */
function RestaurantCardSkeleton() {
  return (
    <div className="bg-surface overflow-hidden rounded-[28px]">
      {/* The card's own `overflow-hidden` clips this, so it needs no radius. */}
      <Skeleton shape="block" className="h-[220px] w-full" />
      <div className="px-4.5 pt-4 pb-5">
        <div className="mb-3 flex items-center justify-between">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton shape="circle" className="h-8 w-15 flex-none" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
}

/** The browse grid, on the same auto-fill track the real results use. */
export function RestaurantGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <SkeletonScreen label="Loading restaurants">
      <Skeleton className="mb-6 h-3.5 w-56" />

      <div className="mb-6 flex flex-wrap gap-2.5">
        {Array.from({ length: 7 }, (_, i) => (
          <Skeleton key={i} shape="circle" className="h-10.5 w-28" />
        ))}
      </div>

      <div className="grid gap-9 sm:grid-cols-[repeat(auto-fill,minmax(min(100%,360px),1fr))]">
        {Array.from({ length: count }, (_, i) => (
          <RestaurantCardSkeleton key={i} />
        ))}
      </div>
    </SkeletonScreen>
  );
}

/** Cover, facts strip, section tabs, and a few menu rows. */
export function RestaurantDetailSkeleton() {
  return (
    <SkeletonScreen label="Loading restaurant">
      <Skeleton shape="block" className="h-[280px] w-full rounded-[32px]" />

      <div className="border-hairline bg-surface mt-5 grid grid-cols-2 gap-5 rounded-3xl border-2 px-7 py-5 md:grid-cols-4 md:gap-0">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="h-3.5 w-24" />
          </div>
        ))}
      </div>

      <div className="border-hairline mt-4 flex gap-2.5 border-b pb-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} shape="circle" className="h-9.5 w-30 flex-none" />
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-5">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="border-hairline flex items-center gap-4.5 border-b pb-5"
          >
            <Skeleton shape="block" className="size-24 flex-none rounded-[20px]" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-full max-w-90" />
              <Skeleton className="h-3.5 w-20" />
            </div>
            <Skeleton shape="circle" className="size-10 flex-none" />
          </div>
        ))}
      </div>
    </SkeletonScreen>
  );
}
