import { SiteHeader } from "@/components/layout/SiteHeader";
import { AppFooter } from "@/components/layout/SiteFooter";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { RestaurantBrowser } from "@/components/restaurant/RestaurantBrowser";
import { SearchResultsView } from "@/components/restaurant/SearchResultsView";
import { restaurantRepository } from "@/lib/data";

export const metadata = {
  title: "Browse food · Grub Box",
};

export default async function BrowseFoodPage({
  searchParams,
}: PageProps<"/browse">) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";

  const results = query ? await restaurantRepository.searchAll(query) : null;
  const restaurants = results ? [] : await restaurantRepository.list();

  return (
    <>
      <SiteHeader variant="app" initialQuery={query} />

      <main className="shell max-w-page flex-1 pt-page-top pb-page-bottom">
        <Breadcrumbs
          trail={[
            { label: "Home", href: "/" },
            ...(query
              ? [{ label: "Browse food", href: "/browse" }, { label: `“${query}”` }]
              : [{ label: "Browse food" }]),
          ]}
        />

        <h1 className="font-display text-fg mb-2 text-[32px]">
          {query ? `Results for “${query}”` : "Browse food"}
        </h1>

        {results ? (
          <div className="pt-4">
            <SearchResultsView results={results} />
          </div>
        ) : (
          <RestaurantBrowser restaurants={restaurants} />
        )}
      </main>

      <AppFooter />
    </>
  );
}
