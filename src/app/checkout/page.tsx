import { SiteHeader } from "@/components/layout/SiteHeader";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";
import { restaurantRepository } from "@/lib/data";

export const metadata = {
  title: "Checkout · Grub Box",
};

export default async function CheckoutPage() {
  const restaurants = await restaurantRepository.list();
  return (
    <>
      <SiteHeader variant="app" />

      <div className="mx-auto w-full max-w-[1100px] px-6 pt-4 lg:px-14">
        <Breadcrumbs
          trail={[
            { label: "Home", href: "/" },
            { label: "Browse food", href: "/browse" },
            { label: "Checkout" },
          ]}
        />
      </div>

      <CheckoutFlow restaurants={restaurants} />
    </>
  );
}
