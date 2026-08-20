import { SiteHeader } from "@/components/layout/SiteHeader";
import { AppFooter } from "@/components/layout/SiteFooter";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { OrderDetail } from "@/components/orders/OrderDetail";

export const metadata = {
  title: "Order details · Grub Box",
};

export default async function OrderDetailPage({
  params,
}: PageProps<"/orders/[id]">) {
  const { id } = await params;

  return (
    <>
      <SiteHeader variant="app" />

      <div className="shell max-w-narrow pt-page-top">
        <Breadcrumbs
          trail={[
            { label: "Home", href: "/" },
            { label: "Your orders", href: "/orders" },
            { label: `#${id}` },
          ]}
        />
      </div>

      <OrderDetail orderId={id} />

      <AppFooter />
    </>
  );
}
