import { SiteHeader } from "@/components/layout/SiteHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { OrderTrackingSkeleton } from "@/components/orders/OrderSkeletons";

export default function Loading() {
  return (
    <>
      <SiteHeader variant="app" />

      <div className="shell max-w-app pt-page-top">
        <Skeleton className="mb-4 h-3.5 w-56" />
      </div>

      <main className="shell max-w-app flex-1 pb-page-bottom">
        <OrderTrackingSkeleton />
      </main>
    </>
  );
}
