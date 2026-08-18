import { SiteHeader } from "@/components/layout/SiteHeader";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { OrderTracking } from "@/components/orders/OrderTracking";

export const metadata = {
  title: "Track your order · Grub Box",
};

export default async function OrderTrackingPage({
  params,
}: PageProps<"/orders/[id]/tracking">) {
  const { id } = await params;
  return (
    <>
      <SiteHeader variant="app" />

      <div className="shell max-w-app pt-page-top">
        <Breadcrumbs
          trail={[
            { label: "Home", href: "/" },
            { label: "Your orders", href: "/orders" },
            { label: `#${id}` },
            { label: "Tracking" },
          ]}
        />
      </div>
      <OrderTracking orderId={id} />
    </>
  );
}
