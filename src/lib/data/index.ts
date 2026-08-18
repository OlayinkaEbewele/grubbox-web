import type { Coupon, MenuItem, PaymentMethod, Restaurant } from "@/lib/types";
import { restaurants } from "./restaurants";

/** A dish match, carrying the restaurant it belongs to so it can be linked. */
export interface DishHit {
  item: MenuItem;
  restaurant: Restaurant;
  sectionName: string;
}

export interface SearchResults {
  query: string;
  restaurants: Restaurant[];
  dishes: DishHit[];
}

/**
 * Every screen reads through this interface rather than importing the mock
 * arrays directly. Swapping in a real backend means writing one more object
 * that satisfies `RestaurantRepository` — no page or component changes.
 */
export interface RestaurantRepository {
  list(): Promise<Restaurant[]>;
  bySlug(slug: string): Promise<Restaurant | null>;
  search(query: string): Promise<Restaurant[]>;
  /** Searches dishes and restaurants together. */
  searchAll(query: string): Promise<SearchResults>;
}

const mockRepository: RestaurantRepository = {
  async list() {
    return restaurants;
  },

  async bySlug(slug: string) {
    return restaurants.find((r) => r.slug === slug) ?? null;
  },

  async search(query: string) {
    const q = query.trim().toLowerCase();
    if (!q) return restaurants;
    return restaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.cuisine.toLowerCase().includes(q) ||
        r.menu.some((section) =>
          section.items.some((item) => item.name.toLowerCase().includes(q)),
        ),
    );
  },

  async searchAll(query: string) {
    const q = query.trim().toLowerCase();
    if (!q) return { query, restaurants, dishes: [] };

    // A restaurant matches on its own name or cuisine. Matching only because
    // one of its dishes matched would duplicate what the dish list already
    // says, so those are left to the dish results.
    const matchedRestaurants = restaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q),
    );

    const dishes: DishHit[] = [];
    for (const restaurant of restaurants) {
      for (const section of restaurant.menu) {
        for (const item of section.items) {
          const matches =
            item.name.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q);
          if (matches) {
            dishes.push({ item, restaurant, sectionName: section.name });
          }
        }
      }
    }

    // Name matches are what people usually mean, so float them above
    // description-only matches.
    dishes.sort((a, b) => {
      const aName = a.item.name.toLowerCase().includes(q) ? 0 : 1;
      const bName = b.item.name.toLowerCase().includes(q) ? 0 : 1;
      return aName - bName;
    });

    return { query, restaurants: matchedRestaurants, dishes };
  },
};

export const restaurantRepository: RestaurantRepository = mockRepository;

export const CUISINE_FILTERS = [
  "All",
  "Nigerian",
  "Fast food",
  "Pizza",
  "Healthy",
  "Shawarma",
  "Desserts",
] as const;

export const SORT_OPTIONS = [
  "Recommended",
  "Rating",
  "Delivery time",
  "Distance",
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number];

export const SEARCH_SUGGESTIONS = [
  "Jollof Rice",
  "Suya",
  "Amala",
  "Pepper Soup",
  "Shawarma",
  "Pizza",
] as const;

export const COUPONS: Coupon[] = [
  { code: "BESTPRICE", percent: 8, cap: 1000 },
  { code: "GRUB10", percent: 10, cap: 800 },
  { code: "WELCOME5", percent: 5, cap: 1500 },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "card", label: "Card ending in 4242", icon: "💳" },
  { id: "cash", label: "Cash on delivery", icon: "💵" },
  { id: "wallet", label: "Grub Box Wallet · ₦12,000", icon: "👛" },
];

export const DROPOFF_PRESETS = [
  { emoji: "🚪", label: "Leave at door", text: "Please leave the order at the door." },
  { emoji: "🔔", label: "Ring bell", text: "Please ring the bell on arrival." },
  { emoji: "📞", label: "Call upon arrival", text: "Please call when you arrive." },
  { emoji: "🏢", label: "Meet at lobby", text: "I'll meet you at the building lobby." },
] as const;

export const TIP_OPTIONS = [
  { label: "No tip", percent: 0 },
  { label: "10%", percent: 10 },
  { label: "15%", percent: 15 },
  { label: "20%", percent: 20 },
] as const;

export const CHECKOUT_ADDONS = [
  { id: "addon-0", category: "Drinks & Shakes", name: "Mango Smoothie", price: 1200 },
  { id: "addon-1", category: "Drinks & Shakes", name: "Vanilla Milkshake", price: 1400 },
  { id: "addon-2", category: "Dipping Sauces", name: "Pepper Sauce", price: 300 },
  { id: "addon-3", category: "Dipping Sauces", name: "Garlic Mayo", price: 300 },
  { id: "addon-4", category: "Desserts", name: "Chin Chin Cup", price: 900 },
  { id: "addon-5", category: "Desserts", name: "Puff Puff (4pc)", price: 800 },
] as const;

export const SERVICE_FEE = 100;

export const DEFAULT_ADDRESS = {
  label: "Home · Lekki Phase 1",
  line: "12 Admiralty Way, Lekki Phase 1, Lagos",
  area: "Lekki Phase 1",
};
