import { RestaurantCard } from "./RestaurantCard";
import { DishCard } from "./DishCard";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { pluralize } from "@/lib/format";
import type { SearchResults } from "@/lib/data";

export function SearchResultsView({ results }: { results: SearchResults }) {
  const { query, dishes, restaurants } = results;
  const total = dishes.length + restaurants.length;

  if (total === 0) {
    return (
      <EmptyState
        variant="search"
        title="No matches found"
        description={`Nothing matched “${query}”. Try a dish name like “jollof”, or a restaurant.`}
        action={<ButtonLink href="/browse">Browse food</ButtonLink>}
      />
    );
  }

  return (
    <div className="flex flex-col gap-12">
      {dishes.length > 0 && (
        <section>
          <h2 className="font-display text-fg mb-1 text-2xl">Dishes</h2>
          <p className="text-fg-subtle mb-5 text-sm">
            {dishes.length} {pluralize(dishes.length, "dish", "dishes")} matching
            &ldquo;{query}&rdquo;
          </p>

          <ul className="grid gap-4 lg:grid-cols-2">
            {dishes.map((hit) => (
              <DishCard key={hit.item.id} hit={hit} />
            ))}
          </ul>
        </section>
      )}

      {restaurants.length > 0 && (
        <section>
          <h2 className="font-display text-fg mb-1 text-2xl">Restaurants</h2>
          <p className="text-fg-subtle mb-5 text-sm">
            {restaurants.length} {pluralize(restaurants.length, "restaurant")}{" "}
            matching &ldquo;{query}&rdquo;
          </p>

          <ul className="grid gap-9 sm:grid-cols-[repeat(auto-fill,minmax(min(100%,360px),1fr))]">
            {restaurants.map((restaurant, index) => (
              <li key={restaurant.slug}>
                <RestaurantCard restaurant={restaurant} index={index} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
