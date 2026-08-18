import { SiteHeader } from "@/components/layout/SiteHeader";
import { AppFooter } from "@/components/layout/SiteFooter";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { OrderList } from "@/components/orders/OrderList";
import { restaurantRepository } from "@/lib/data";

export const metadata = {
  title: "Your orders · Grub Box",
};

export default async function OrdersPage() {
  const restaurants = await restaurantRepository.list();
  const covers = Object.fromEntries(
    restaurants.map((restaurant) => [restaurant.slug, restaurant.cover]),
  );

  return (
    <>
      <SiteHeader variant="app" />

      <main className="mx-auto w-full max-w-[900px] flex-1 px-6 pt-2 pb-24 lg:px-14">
        <Breadcrumbs
          trail={[{ label: "Home", href: "/" }, { label: "Your orders" }]}
        />

        <h1 className="font-display text-fg mb-1.5 text-[32px]">Your orders</h1>
        <p className="text-fg-subtle mb-7 text-sm">
          Track, review, and reorder from your order history
        </p>

        <OrderList covers={covers} />
      </main>

      <AppFooter />
    </>
  );
}
