import { Skeleton, SkeletonScreen } from "@/components/ui/Skeleton";

/** One order row: cover, title block, price column, then the button footer. */
function OrderRowSkeleton() {
  return (
    <li className="border-hairline bg-surface rounded-3xl border-2 px-5.5 py-5">
      <div className="mb-3.5 flex items-center gap-4">
        <Skeleton shape="block" className="size-14 flex-none" />

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-3 w-56" />
        </div>

        <div className="flex flex-none flex-col items-end gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton shape="circle" className="h-6 w-24" />
        </div>
      </div>

      <div className="border-hairline flex gap-2.5 border-t pt-3.5">
        <Skeleton shape="circle" className="h-9.5 flex-1" />
        <Skeleton shape="circle" className="h-9.5 flex-1" />
        <Skeleton shape="circle" className="size-10.5 flex-none" />
      </div>
    </li>
  );
}

export function OrderListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <SkeletonScreen label="Loading your orders">
      <div className="mb-6 flex gap-2.5">
        <Skeleton shape="circle" className="h-10.5 w-28" />
        <Skeleton shape="circle" className="h-10.5 w-24" />
      </div>

      <ul className="flex flex-col gap-4">
        {Array.from({ length: count }, (_, i) => (
          <OrderRowSkeleton key={i} />
        ))}
      </ul>
    </SkeletonScreen>
  );
}

/**
 * The confirmation screen is a centred column, so the skeleton is too — the
 * check badge, the headline, and the receipt card underneath it.
 */
export function OrderConfirmationSkeleton() {
  return (
    <SkeletonScreen
      label="Loading your order confirmation"
      className="flex flex-col items-center"
    >
      <Skeleton shape="circle" className="mb-7 size-24" />
      <Skeleton className="mb-3 h-8 w-64" />
      <Skeleton className="mb-2 h-3.5 w-full max-w-100" />
      <Skeleton className="mb-8 h-3.5 w-full max-w-80" />

      <div className="border-hairline bg-surface mb-6 w-full rounded-3xl border-2 p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-2.5 w-24" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton shape="circle" className="h-6 w-20" />
        </div>

        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <Skeleton className="h-3.5 w-36" />
              <Skeleton className="h-3.5 w-16" />
            </div>
          ))}
        </div>
      </div>

      <Skeleton shape="circle" className="h-12 w-full max-w-70" />
    </SkeletonScreen>
  );
}

/** Map on the left, rider and timeline column on the right. */
export function OrderTrackingSkeleton() {
  return (
    <SkeletonScreen
      label="Loading order tracking"
      className="flex w-full flex-col items-start gap-8 lg:flex-row"
    >
      <div className="w-full min-w-0 flex-1">
        <Skeleton shape="block" className="h-[520px] w-full rounded-[28px]" />
      </div>

      <div className="flex w-full flex-col gap-5 lg:max-w-90">
        <div className="border-hairline bg-surface rounded-3xl border-2 p-6">
          <div className="mb-5 flex items-center gap-3.5">
            <Skeleton shape="circle" className="size-12 flex-none" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex items-center gap-3.5">
                <Skeleton shape="circle" className="size-6 flex-none" />
                <Skeleton className="h-3.5 flex-1" />
              </div>
            ))}
          </div>
        </div>

        <div className="border-hairline bg-surface rounded-3xl border-2 p-6">
          <Skeleton className="mb-4 h-4 w-28" />
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3.5 w-14" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </SkeletonScreen>
  );
}

/** Order receipt: header, restaurant row, items card, totals, actions. */
export function OrderDetailSkeleton() {
  return (
    <SkeletonScreen label="Loading order">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2.5">
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-3.5 w-64" />
        </div>
        <Skeleton shape="circle" className="h-7 w-24 flex-none" />
      </div>

      <div className="border-hairline bg-surface mb-5 flex items-center gap-4 rounded-3xl border-2 p-5">
        <Skeleton shape="block" className="size-14 flex-none" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-3 w-56" />
        </div>
        <Skeleton shape="circle" className="h-9 w-28 flex-none" />
      </div>

      <div className="border-hairline bg-surface mb-5 rounded-3xl border-2 p-6">
        <Skeleton className="mb-4 h-4 w-20" />
        <div className="mb-5 flex flex-col gap-3.5">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex items-center gap-3.5">
              <Skeleton shape="block" className="size-7 flex-none" />
              <Skeleton className="h-3.5 flex-1" />
              <Skeleton className="h-3.5 w-16 flex-none" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2.5">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex justify-between gap-4">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-14" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3.5">
        <Skeleton shape="circle" className="h-12 min-w-40 flex-1" />
        <Skeleton shape="circle" className="h-12 min-w-40 flex-1" />
      </div>
    </SkeletonScreen>
  );
}
