import { Skeleton, SkeletonScreen } from "@/components/ui/Skeleton";

/**
 * Covers everything the real flow renders once the cart has hydrated: the
 * fulfillment toggle, the step rail, then the order column beside the summary.
 */
export function CheckoutSkeleton() {
  return (
    <SkeletonScreen label="Loading checkout">
      <div className="flex justify-center">
        <Skeleton shape="circle" className="h-13 w-80" />
      </div>

      <div className="mt-5 flex items-center gap-2">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="flex flex-1 items-center gap-2">
            <div className="flex items-center gap-2.5 px-1 py-2">
              <Skeleton shape="circle" className="size-7 flex-none" />
              <Skeleton className="hidden h-3.5 w-24 sm:block" />
            </div>
            {i < 2 && <Skeleton className="h-0.5 max-w-15 flex-1" />}
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col items-start gap-12 lg:flex-row">
        <div className="w-full min-w-0 flex-1">
          <Skeleton className="mb-2 h-7 w-48" />
          <Skeleton className="mb-6 h-3.5 w-72" />

          <ul className="mb-5 flex flex-col gap-4">
            {Array.from({ length: 3 }, (_, i) => (
              <li
                key={i}
                className="border-hairline bg-surface flex items-center gap-4 rounded-[20px] border-2 p-4"
              >
                <Skeleton shape="block" className="size-18 flex-none" />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton shape="circle" className="h-9 w-28 flex-none" />
              </li>
            ))}
          </ul>
        </div>

        <div className="border-hairline bg-surface w-full rounded-3xl border-2 p-6 lg:w-80 lg:flex-none">
          <Skeleton className="mb-5 h-5 w-32" />
          <div className="mb-5 flex flex-col gap-3.5">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3.5 w-16" />
              </div>
            ))}
          </div>
          <Skeleton shape="circle" className="h-12 w-full" />
        </div>
      </div>
    </SkeletonScreen>
  );
}
