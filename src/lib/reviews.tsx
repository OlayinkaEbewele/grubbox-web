"use client";

import { useCallback } from "react";
import { createPersistentStore, useHydrated, useStore } from "@/lib/store";

const STORAGE_KEY = "grubbox.reviews.v1";

export interface Review {
  orderId: string;
  restaurantSlug: string;
  /** 1–5. */
  rating: number;
  /** Quick-pick tags, e.g. "Food was hot". */
  tags: string[];
  comment: string;
  submittedAt: string;
}

/** Keyed by order id — one review per order. */
type Reviews = Record<string, Review>;

const NONE: Reviews = {};

function isReviews(value: unknown): value is Reviews {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const reviewStore = createPersistentStore(STORAGE_KEY, NONE, isReviews);

/** Tags offered under the stars. Kept short so the row wraps at most twice. */
export const REVIEW_TAGS = [
  "Food was hot",
  "Arrived early",
  "Well packaged",
  "Order was correct",
  "Friendly rider",
  "Great value",
] as const;

interface ReviewsValue {
  reviews: Reviews;
  hydrated: boolean;
  reviewFor(orderId: string): Review | null;
  submit(review: Omit<Review, "submittedAt">): void;
}

export function useReviews(): ReviewsValue {
  const reviews = useStore(reviewStore);
  const hydrated = useHydrated();

  const submit = useCallback((review: Omit<Review, "submittedAt">) => {
    reviewStore.update((current) => ({
      ...current,
      [review.orderId]: { ...review, submittedAt: new Date().toISOString() },
    }));
  }, []);

  return {
    reviews,
    hydrated,
    reviewFor: (orderId) => reviews[orderId] ?? null,
    submit,
  };
}
