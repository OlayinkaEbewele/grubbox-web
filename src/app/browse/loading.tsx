import { SiteHeader } from "@/components/layout/SiteHeader";
import { AppFooter } from "@/components/layout/SiteFooter";
import { Skeleton } from "@/components/ui/Skeleton";
import { RestaurantGridSkeleton } from "@/components/restaurant/RestaurantSkeletons";

/**
 * The header and footer are rendered per page rather than in the layout, so
 * every fallback repeats them — otherwise the chrome blinks out on navigation
 * and the whole screen appears to reload.
 */
export default function Loading() {
  return (
    <>
      <SiteHeader variant="app" />

      <main className="shell max-w-page flex-1 pt-page-top pb-page-bottom">
        <Skeleton className="mb-4 h-3.5 w-44" />
        <Skeleton className="mb-6 h-8 w-56" />
        <RestaurantGridSkeleton />
      </main>

      <AppFooter />
    </>
  );
}
