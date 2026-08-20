import { SiteHeader } from "@/components/layout/SiteHeader";
import { AppFooter } from "@/components/layout/SiteFooter";
import { Skeleton } from "@/components/ui/Skeleton";
import { OrderDetailSkeleton } from "@/components/orders/OrderSkeletons";

export default function Loading() {
  return (
    <>
      <SiteHeader variant="app" />

      <div className="shell max-w-narrow pt-page-top">
        <Skeleton className="mb-4 h-3.5 w-52" />
      </div>

      <main className="shell max-w-narrow flex-1 pb-page-bottom">
        <OrderDetailSkeleton />
      </main>

      <AppFooter />
    </>
  );
}
