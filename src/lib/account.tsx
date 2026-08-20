"use client";

import { useCallback } from "react";
import { createPersistentStore, useHydrated, useStore } from "@/lib/store";
import {
  PROFILE,
  SAVED_ADDRESSES,
  SAVED_PAYMENTS,
  type SavedAddress,
  type SavedPayment,
} from "@/lib/data/profile";
import type { Naira } from "@/lib/types";

/**
 * Addresses, payment methods, wallet and notification settings.
 *
 * These used to be read straight from the static consts in `lib/data/profile`,
 * which meant any edit screen would have been a form that changed nothing.
 * Each store seeds from that same data the first time it's read, so the
 * profile still looks populated on a fresh visit.
 */

// --- addresses -------------------------------------------------------------

const ADDRESS_KEY = "grubbox.addresses.v1";

function isAddresses(value: unknown): value is SavedAddress[] {
  return Array.isArray(value);
}

const addressStore = createPersistentStore(
  ADDRESS_KEY,
  SAVED_ADDRESSES,
  isAddresses,
);

const DEFAULT_KEY = "grubbox.address.default.v1";

const defaultAddressStore = createPersistentStore<string | null>(
  DEFAULT_KEY,
  SAVED_ADDRESSES[0]?.id ?? null,
  (value): value is string | null => value === null || typeof value === "string",
);

export interface AddressDraft {
  label: string;
  type: string;
  detail: string;
  icon: string;
}

export const ADDRESS_TYPES = ["House", "Office", "Apartment", "Other"] as const;
export const ADDRESS_ICONS = ["🏠", "🏢", "🏘️", "📍", "🏨", "🎓"] as const;

export function useAddresses() {
  const addresses = useStore(addressStore);
  const defaultId = useStore(defaultAddressStore);
  const hydrated = useHydrated();

  const add = useCallback((draft: AddressDraft) => {
    const id = `addr-${Date.now().toString(36)}`;
    addressStore.update((current) => [...current, { id, ...draft }]);
    return id;
  }, []);

  const update = useCallback((id: string, draft: AddressDraft) => {
    addressStore.update((current) =>
      current.map((a) => (a.id === id ? { ...a, ...draft } : a)),
    );
  }, []);

  const remove = useCallback((id: string) => {
    addressStore.update((current) => current.filter((a) => a.id !== id));
    // Never leave the default pointing at something that no longer exists.
    defaultAddressStore.update((current) => (current === id ? null : current));
  }, []);

  return {
    addresses,
    defaultId,
    hydrated,
    find: (id: string) => addresses.find((a) => a.id === id) ?? null,
    add,
    update,
    remove,
    setDefault: (id: string) => defaultAddressStore.set(id),
  };
}

// --- payment methods -------------------------------------------------------

const PAYMENT_KEY = "grubbox.payments.v1";

function isPayments(value: unknown): value is SavedPayment[] {
  return Array.isArray(value);
}

const paymentStore = createPersistentStore(PAYMENT_KEY, SAVED_PAYMENTS, isPayments);

/** Card art per network, so a new card doesn't land looking unstyled. */
export const CARD_NETWORKS = {
  VISA: "bg-[#1a1f71] text-white",
  MASTERCARD: "bg-[#eb001b] text-white",
  VERVE: "bg-[#00425f] text-white",
} as const;

export type CardNetwork = keyof typeof CARD_NETWORKS;

export interface PaymentDraft {
  label: string;
  detail: string;
  network: CardNetwork;
}

export function usePayments() {
  const payments = useStore(paymentStore);
  const hydrated = useHydrated();

  const add = useCallback((draft: PaymentDraft) => {
    const id = `pay-${Date.now().toString(36)}`;
    paymentStore.update((current) => [
      ...current,
      {
        id,
        kind: "card" as const,
        label: draft.label,
        detail: draft.detail,
        network: draft.network,
        badgeClass: CARD_NETWORKS[draft.network],
      },
    ]);
    return id;
  }, []);

  const update = useCallback((id: string, draft: PaymentDraft) => {
    paymentStore.update((current) =>
      current.map((p) =>
        p.id === id
          ? {
              ...p,
              label: draft.label,
              detail: draft.detail,
              network: draft.network,
              badgeClass: CARD_NETWORKS[draft.network],
            }
          : p,
      ),
    );
  }, []);

  const remove = useCallback((id: string) => {
    paymentStore.update((current) => current.filter((p) => p.id !== id));
  }, []);

  return {
    payments,
    hydrated,
    find: (id: string) => payments.find((p) => p.id === id) ?? null,
    add,
    update,
    remove,
  };
}

// --- wallet ----------------------------------------------------------------

const WALLET_KEY = "grubbox.wallet.v1";

const walletStore = createPersistentStore<Naira>(
  WALLET_KEY,
  PROFILE.walletBalance,
  (value): value is Naira => typeof value === "number",
);

export const TOP_UP_PRESETS: Naira[] = [2000, 5000, 10000, 20000];

export function useWallet() {
  const balance = useStore(walletStore);
  const hydrated = useHydrated();

  const topUp = useCallback((amount: Naira) => {
    walletStore.update((current) => current + amount);
  }, []);

  return { balance, hydrated, topUp };
}

// --- notification + privacy settings ---------------------------------------

const SETTINGS_KEY = "grubbox.settings.v1";

export interface AccountSettings {
  orderUpdates: boolean;
  promotions: boolean;
  newRestaurants: boolean;
  smsUpdates: boolean;
  emailReceipts: boolean;
  shareActivity: boolean;
  personalisedAds: boolean;
  locationHistory: boolean;
}

const DEFAULT_SETTINGS: AccountSettings = {
  orderUpdates: true,
  promotions: true,
  newRestaurants: false,
  smsUpdates: true,
  emailReceipts: true,
  shareActivity: false,
  personalisedAds: false,
  locationHistory: true,
};

function isSettings(value: unknown): value is AccountSettings {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const settingsStore = createPersistentStore(
  SETTINGS_KEY,
  DEFAULT_SETTINGS,
  isSettings,
);

export function useAccountSettings() {
  const stored = useStore(settingsStore);
  const hydrated = useHydrated();

  const set = useCallback((key: keyof AccountSettings, value: boolean) => {
    settingsStore.update((current) => ({ ...current, [key]: value }));
  }, []);

  // Spread over the defaults so a setting added later doesn't read undefined
  // for anyone with a stored object from before it existed.
  return { settings: { ...DEFAULT_SETTINGS, ...stored }, hydrated, set };
}
