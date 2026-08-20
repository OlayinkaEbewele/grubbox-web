"use client";

import { RestaurantCard } from "@/components/restaurant/RestaurantCard";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SignInPrompt } from "@/components/auth/SignInPrompt";
import { RestaurantGridSkeleton } from "@/components/restaurant/RestaurantSkeletons";
import { useAuth } from "@/lib/auth";
import { useFavourites } from "@/lib/favourites";
import { pluralize } from "@/lib/format";
import type { Restaurant } from "@/lib/types";

/**
 * Saved restaurants. The full catalogue arrives from the server; which of them
 * are saved is client state, so the filtering happens here rather than in the
 * page — the server has no idea who this is yet.
 */
export function FavouritesView({ restaurants }: { restaurants: Restaurant[] }) {
  const { session, hydrated: authHydrated } = useAuth();
  const { slugs, hydrated } = useFavourites();

  if (!authHydrated || !hydrated) return <RestaurantGridSkeleton count={3} />;

  if (!session) {
    return (
      <SignInPrompt
        variant="favorites"
        title="Sign in to see your favourites"
        description="Save the places you order from most and they'll be waiting here."
      />
    );
  }

  // Keep the saved order (newest first) rather than the catalogue's.
  const saved = slugs
    .map((slug) => restaurants.find((r) => r.slug === slug))
    .filter((r): r is Restaurant => Boolean(r));

  if (saved.length === 0) {
    return (
      <EmptyState
        variant="favorites"
        title="No favourites yet"
        description="Tap the heart on any restaurant and it will show up here."
        action={<ButtonLink href="/browse">Browse food</ButtonLink>}
      />
    );
  }

  return (
    <>
      <p className="text-fg-subtle mb-6 text-sm">
        <span className="text-fg font-extrabold tabular-nums">{saved.length}</span>{" "}
        saved {pluralize(saved.length, "place")}
      </p>

      <div className="grid gap-9 sm:grid-cols-[repeat(auto-fill,minmax(min(100%,360px),1fr))]">
        {saved.map((restaurant, index) => (
          <RestaurantCard
            key={restaurant.slug}
            restaurant={restaurant}
            index={index}
          />
        ))}
      </div>
    </>
  );
}
