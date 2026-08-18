"use client";

import { useMemo, useState } from "react";
import { RestaurantCard } from "./RestaurantCard";
import {
  FilterBar,
  NO_FILTERS,
  activeFilterCount,
  type Filters,
} from "./FilterBar";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { CheckIcon } from "@/components/icons";
import { CUISINE_FILTERS, SORT_OPTIONS, type SortOption } from "@/lib/data";
import { cn } from "@/lib/cn";
import type { PriceLevel, Restaurant } from "@/lib/types";

const PRICE_LEVELS: PriceLevel[] = ["₦", "₦₦", "₦₦₦"];

/** Lower bound of "15-25 min". */
function minMinutes(restaurant: Restaurant) {
  return parseInt(restaurant.deliveryTime, 10);
}

/** Upper bound of "15-25 min", falling back to the lower one. */
function maxMinutes(restaurant: Restaurant) {
  const parts = restaurant.deliveryTime.match(/\d+/g) ?? [];
  return Number(parts[parts.length - 1] ?? 0);
}

function matchesCuisine(restaurant: Restaurant, filter: string) {
  if (filter === "All") return true;
  if (filter === "Fast food") return restaurant.cuisineKey === "Fast";
  if (filter === "Shawarma") return restaurant.cuisineKey === "Middle";
  return restaurant.cuisine.toLowerCase().includes(filter.toLowerCase());
}

/** Handles kitchens that close after midnight, e.g. 11:00–00:00. */
function isOpenNow(restaurant: Restaurant, hour: number) {
  const { opensAt, closesAt } = restaurant;
  return closesAt > opensAt
    ? hour >= opensAt && hour < closesAt
    : hour >= opensAt || hour < closesAt;
}

interface RestaurantBrowserProps {
  restaurants: Restaurant[];
}

export function RestaurantBrowser({ restaurants }: RestaurantBrowserProps) {
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [cuisine, setCuisine] = useState<string>("All");
  const [sort, setSort] = useState<SortOption>("Recommended");
  const [prices, setPrices] = useState<PriceLevel[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);

  const results = useMemo(() => {
    const hour = new Date().getHours();

    const filtered = restaurants.filter((restaurant) => {
      if (!matchesCuisine(restaurant, cuisine)) return false;
      if (prices.length > 0 && !prices.includes(restaurant.priceLevel)) return false;
      if (filters.discounts && !restaurant.promo) return false;
      if (filters.openNow && !isOpenNow(restaurant, hour)) return false;
      if (filters.pickup && !restaurant.pickup) return false;
      if (filters.under30 && maxMinutes(restaurant) > 30) return false;
      if (filters.rating !== "any" && restaurant.rating < Number(filters.rating))
        return false;
      if (filters.deliveryFee === "free" && restaurant.deliveryFee !== 0) return false;
      if (filters.deliveryFee === "under500" && restaurant.deliveryFee >= 500)
        return false;
      // Grub Pass is a delivery-fee subscription, so free-delivery kitchens
      // are the ones it applies to.
      if (filters.grubPass && restaurant.deliveryFee !== 0) return false;
      return true;
    });

    switch (sort) {
      case "Rating":
        return [...filtered].sort((a, b) => b.rating - a.rating);
      case "Delivery time":
        return [...filtered].sort((a, b) => minMinutes(a) - minMinutes(b));
      case "Distance":
        return [...filtered].sort((a, b) => a.address.localeCompare(b.address));
      default:
        return filtered;
    }
  }, [restaurants, cuisine, sort, prices, filters]);

  function togglePrice(level: PriceLevel) {
    setPrices((current) =>
      current.includes(level)
        ? current.filter((p) => p !== level)
        : [...current, level],
    );
  }

  function clearEverything() {
    setFilters(NO_FILTERS);
    setCuisine("All");
    setPrices([]);
  }

  const anyFilterActive =
    activeFilterCount(filters) > 0 || cuisine !== "All" || prices.length > 0;

  return (
    <>
      <p className="text-fg-subtle mb-6 text-sm">
        <span className="text-fg font-extrabold tabular-nums">{results.length}</span>{" "}
        {results.length === 1 ? "place" : "places"} delivering to you right now
      </p>

      <div className="mb-4">
        <FilterBar
          filters={filters}
          onChange={setFilters}
          onOpenAll={() => setPanelOpen((open) => !open)}
        />
      </div>

      <div className="rail-clean mb-4 flex gap-2.5 overflow-x-auto pb-1">
        {CUISINE_FILTERS.map((filter) => (
          <Chip
            key={filter}
            active={cuisine === filter}
            onClick={() => setCuisine(filter)}
          >
            {filter}
          </Chip>
        ))}
      </div>

      {/* "All Filters" reveals sort and price rather than hiding them in a
          permanent sidebar, which matches how the pill row reads. */}
      {panelOpen && (
        <div className="border-hairline bg-surface mb-6 grid gap-6 rounded-3xl border-2 p-6 sm:grid-cols-2">
          <div>
            <h2 className="text-fg mb-3.5 text-sm font-extrabold">Sort by</h2>
            <div className="flex flex-col gap-1.5">
              {SORT_OPTIONS.map((option) => {
                const selected = sort === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSort(option)}
                    aria-pressed={selected}
                    className={cn(
                      "flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-colors duration-150",
                      selected ? "bg-surface-alt text-fg" : "text-fg-muted hover:bg-surface-3",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-5 flex-none items-center justify-center rounded-full text-white",
                        selected ? "bg-primary" : "bg-hairline",
                      )}
                    >
                      {selected && <CheckIcon size={11} />}
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-fg mb-3.5 text-sm font-extrabold">Price</h2>
            <div className="flex gap-2">
              {PRICE_LEVELS.map((level) => {
                const selected = prices.includes(level);
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => togglePrice(level)}
                    aria-pressed={selected}
                    className={cn(
                      "flex-1 rounded-2xl border-2 py-2.5 text-[13px] font-extrabold transition-colors duration-150",
                      selected
                        ? "border-primary bg-surface-alt text-fg"
                        : "border-surface-alt bg-surface-3 text-fg-muted hover:border-primary",
                    )}
                  >
                    {level}
                  </button>
                );
              })}
            </div>

            {anyFilterActive && (
              <button
                type="button"
                onClick={clearEverything}
                className="text-primary hover:text-primary-light mt-4 text-[13px] font-extrabold transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      )}

      {results.length > 0 ? (
        <div className="grid gap-9 sm:grid-cols-[repeat(auto-fill,minmax(min(100%,360px),1fr))]">
          {results.map((restaurant, index) => (
            <RestaurantCard
              key={restaurant.slug}
              restaurant={restaurant}
              index={index}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          variant="search"
          title="No restaurants found"
          description="Try adjusting your filters or search a different area."
          action={
            <Button variant="outline" onClick={clearEverything}>
              Clear filters
            </Button>
          }
        />
      )}
    </>
  );
}
