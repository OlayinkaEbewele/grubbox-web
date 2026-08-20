import { Skeleton, SkeletonScreen } from "@/components/ui/Skeleton";

/** Identity block, the three stat tiles, the two card columns, settings rows. */
export function ProfileSkeleton() {
  return (
    <SkeletonScreen label="Loading your profile">
      <div className="mb-5 flex flex-wrap items-start gap-4.5">
        <Skeleton shape="circle" className="size-19 flex-none" />

        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-3.5 w-72" />
          <Skeleton className="h-3 w-60" />
        </div>

        <Skeleton shape="circle" className="h-11 w-32 flex-none" />
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="border-hairline bg-surface flex items-center gap-3.5 rounded-[20px] border-2 px-5 py-4.5"
          >
            <Skeleton shape="block" className="size-10 flex-none" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-2.5 w-24" />
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }, (_, column) => (
          <div
            key={column}
            className="border-hairline bg-surface rounded-3xl border-2 p-6"
          >
            <div className="mb-4.5 flex items-center justify-between">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="flex flex-col gap-3.5">
              {Array.from({ length: 2 }, (_, row) => (
                <div
                  key={row}
                  className="bg-surface-3 flex items-center gap-3 rounded-2xl p-3.5"
                >
                  <Skeleton shape="block" className="size-9 flex-none" />
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-hairline bg-surface overflow-hidden rounded-3xl border-2">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className="border-hairline flex items-center gap-3.5 border-b px-5.5 py-4.5 last:border-b-0"
          >
            <Skeleton shape="block" className="size-9 flex-none" />
            <Skeleton className="h-3.5 w-40" />
          </div>
        ))}
      </div>
    </SkeletonScreen>
  );
}
