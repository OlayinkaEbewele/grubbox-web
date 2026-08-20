import { SiteHeader } from "@/components/layout/SiteHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { CheckoutSkeleton } from "@/components/checkout/CheckoutSkeleton";

export default function Loading() {
  return (
    <>
      <SiteHeader variant="app" />

      <div className="shell max-w-app pt-page-top">
        <Skeleton className="mb-4 h-3.5 w-56" />
      </div>

      <div className="shell max-w-app pb-page-bottom">
        <CheckoutSkeleton />
      </div>
    </>
  );
}
