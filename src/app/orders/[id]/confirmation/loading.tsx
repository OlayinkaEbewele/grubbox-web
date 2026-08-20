import { SiteHeader } from "@/components/layout/SiteHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { OrderConfirmationSkeleton } from "@/components/orders/OrderSkeletons";

export default function Loading() {
  return (
    <>
      <SiteHeader variant="app" />

      <div className="mx-auto w-full max-w-focus px-6 pt-page-top">
        <Skeleton className="mb-4 h-3.5 w-60" />
      </div>

      <main className="mx-auto w-full max-w-focus px-6 pt-6 pb-page-bottom">
        <OrderConfirmationSkeleton />
      </main>
    </>
  );
}
