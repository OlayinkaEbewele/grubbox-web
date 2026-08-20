import { SiteHeader } from "@/components/layout/SiteHeader";
import { AppFooter } from "@/components/layout/SiteFooter";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FavouritesView } from "@/components/favourites/FavouritesView";
import { restaurantRepository } from "@/lib/data";

export const metadata = {
  title: "Your favourites · Grub Box",
};

export default async function FavouritesPage() {
  const restaurants = await restaurantRepository.list();

  return (
    <>
      <SiteHeader variant="app" />

      <main className="shell max-w-page flex-1 pt-page-top pb-page-bottom">
        <Breadcrumbs
          trail={[{ label: "Home", href: "/" }, { label: "Your favourites" }]}
        />

        <h1 className="font-display text-fg mb-2 text-[32px]">Your favourites</h1>
        <p className="text-fg-subtle mb-8 text-sm">
          The places you&rsquo;ve saved, ready to reorder
        </p>

        <FavouritesView restaurants={restaurants} />
      </main>

      <AppFooter />
    </>
  );
}
