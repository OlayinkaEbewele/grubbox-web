import { SiteHeader } from "@/components/layout/SiteHeader";
import { AppFooter } from "@/components/layout/SiteFooter";
import { Skeleton } from "@/components/ui/Skeleton";
import { RestaurantGridSkeleton } from "@/components/restaurant/RestaurantSkeletons";

export default function Loading() {
  return (
    <>
      <SiteHeader variant="app" />

      <main className="shell max-w-page flex-1 pt-page-top pb-page-bottom">
        <Skeleton className="mb-4 h-3.5 w-44" />
        <Skeleton className="mb-2 h-8 w-56" />
        <Skeleton className="mb-8 h-3.5 w-72" />
        <RestaurantGridSkeleton count={3} />
      </main>

      <AppFooter />
    </>
  );
}
