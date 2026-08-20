import { SiteHeader } from "@/components/layout/SiteHeader";
import { AppFooter } from "@/components/layout/SiteFooter";
import { Skeleton } from "@/components/ui/Skeleton";
import { OrderListSkeleton } from "@/components/orders/OrderSkeletons";

export default function Loading() {
  return (
    <>
      <SiteHeader variant="app" />

      <main className="shell max-w-narrow flex-1 pt-page-top pb-page-bottom">
        <Skeleton className="mb-4 h-3.5 w-40" />
        <Skeleton className="mb-2 h-8 w-48" />
        <Skeleton className="mb-8 h-3.5 w-72" />
        <OrderListSkeleton />
      </main>

      <AppFooter />
    </>
  );
}
