import { SiteHeader } from "@/components/layout/SiteHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { RestaurantDetailSkeleton } from "@/components/restaurant/RestaurantSkeletons";

export default function Loading() {
  return (
    <>
      <SiteHeader variant="app" sticky />

      <div className="shell max-w-app pt-page-top">
        <Skeleton className="mb-4 h-3.5 w-64" />
      </div>

      <main className="shell max-w-app flex-1 pb-cart-clearance">
        <RestaurantDetailSkeleton />
      </main>
    </>
  );
}
