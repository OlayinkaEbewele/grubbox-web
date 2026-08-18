import { SiteHeader } from "@/components/layout/SiteHeader";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { OrderConfirmation } from "@/components/orders/OrderConfirmation";

export const metadata = {
  title: "Order confirmed · Grub Box",
};

export default async function OrderConfirmationPage({
  params,
}: PageProps<"/orders/[id]/confirmation">) {
  const { id } = await params;
  return (
    <>
      <SiteHeader variant="app" />

      <div className="mx-auto w-full max-w-[1000px] px-6 pt-4 lg:px-14">
        <Breadcrumbs
          trail={[
            { label: "Home", href: "/" },
            { label: "Your orders", href: "/orders" },
            { label: `#${id}` },
            { label: "Confirmation" },
          ]}
        />
      </div>
      <OrderConfirmation orderId={id} />
    </>
  );
}
