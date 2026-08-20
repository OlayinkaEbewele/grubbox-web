"use client";

import { useCallback } from "react";
import { createPersistentStore, useHydrated, useStore } from "@/lib/store";

const STORAGE_KEY = "grubbox.favourites.v1";

/** Restaurant slugs, newest first. */
type Favourites = string[];

const NONE: Favourites = [];

function isFavourites(value: unknown): value is Favourites {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

const favouritesStore = createPersistentStore(STORAGE_KEY, NONE, isFavourites);

interface FavouritesValue {
  slugs: Favourites;
  /** False until the persisted list is readable — see `useHydrated`. */
  hydrated: boolean;
  isFavourite(slug: string): boolean;
  toggle(slug: string): void;
  remove(slug: string): void;
}

/**
 * Saved restaurants. The heart toggles on the restaurant page and order rows
 * used to be local `useState`, so a save vanished on reload and `/favourites`
 * had nothing to show. This is the shared source they both write to.
 */
export function useFavourites(): FavouritesValue {
  const slugs = useStore(favouritesStore);
  const hydrated = useHydrated();

  const toggle = useCallback((slug: string) => {
    favouritesStore.update((current) =>
      current.includes(slug)
        ? current.filter((s) => s !== slug)
        : [slug, ...current],
    );
  }, []);

  const remove = useCallback((slug: string) => {
    favouritesStore.update((current) => current.filter((s) => s !== slug));
  }, []);

  return {
    slugs,
    hydrated,
    isFavourite: (slug) => slugs.includes(slug),
    toggle,
    remove,
  };
}
