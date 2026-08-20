"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { createPersistentStore, useHydrated, useStore } from "@/lib/store";
import {
  INITIAL_PARTNER_MENU,
  PARTNER_PROFILE,
  type KitchenStatus,
  type PartnerMenuItem,
} from "@/lib/data/partner";

/* -------------------------------------------------------------------------
   Partner session

   Deliberately separate from the customer session in `lib/auth`. A restaurant
   account is not a diner account: signing out of one must not sign you out of
   the other, and a customer session must never open a kitchen's dashboard.
------------------------------------------------------------------------- */

const SESSION_KEY = "grubbox.partner.session.v1";

export interface PartnerSession {
  restaurantName: string;
  email: string;
  initial: string;
}

function isPartnerSession(value: unknown): value is PartnerSession | null {
  if (value === null) return true;
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as PartnerSession).email === "string"
  );
}

const partnerSessionStore = createPersistentStore<PartnerSession | null>(
  SESSION_KEY,
  null,
  isPartnerSession,
);

interface PartnerAuthValue {
  session: PartnerSession | null;
  hydrated: boolean;
  signIn(email: string): void;
  signOut(): void;
}

const PartnerAuthContext = createContext<PartnerAuthValue | null>(null);

export function PartnerAuthProvider({ children }: { children: React.ReactNode }) {
  const session = useStore(partnerSessionStore);
  const hydrated = useHydrated();

  const signIn = useCallback((email: string) => {
    // Any credentials open the demo kitchen — there is no server to check
    // against, and the sign-in screen says so.
    partnerSessionStore.set({
      restaurantName: PARTNER_PROFILE.name,
      email,
      initial: PARTNER_PROFILE.name.charAt(0).toUpperCase(),
    });
  }, []);

  const signOut = useCallback(() => partnerSessionStore.set(null), []);

  const value = useMemo(
    () => ({ session, hydrated, signIn, signOut }),
    [session, hydrated, signIn, signOut],
  );

  return (
    <PartnerAuthContext.Provider value={value}>
      {children}
    </PartnerAuthContext.Provider>
  );
}

export function usePartnerAuth(): PartnerAuthValue {
  const context = useContext(PartnerAuthContext);
  if (!context) {
    throw new Error("usePartnerAuth must be used inside PartnerAuthProvider");
  }
  return context;
}

/* -------------------------------------------------------------------------
   Kitchen state

   Menu, kitchen status and auto-accept persist: a partner sets these
   deliberately and would be annoyed to lose them on reload.

   The live order feed deliberately does NOT persist. Its prep timers tick
   every second, so storing it would mean writing to localStorage 60 times a
   minute; and a simulated feed resetting on reload is the honest behaviour
   until a real backend owns order state.
------------------------------------------------------------------------- */

const MENU_KEY = "grubbox.partner.menu.v1";
const STATUS_KEY = "grubbox.partner.status.v1";
const AUTO_ACCEPT_KEY = "grubbox.partner.autoaccept.v1";

function isMenu(value: unknown): value is PartnerMenuItem[] {
  return Array.isArray(value);
}

const menuStore = createPersistentStore(MENU_KEY, INITIAL_PARTNER_MENU, isMenu);

const statusStore = createPersistentStore<KitchenStatus>(
  STATUS_KEY,
  "open",
  (value): value is KitchenStatus =>
    value === "open" || value === "busy" || value === "paused",
);

const autoAcceptStore = createPersistentStore<boolean>(
  AUTO_ACCEPT_KEY,
  false,
  (value): value is boolean => typeof value === "boolean",
);

export function usePartnerMenu() {
  const menu = useStore(menuStore);
  const hydrated = useHydrated();

  const setAvailable = useCallback((id: string, available: boolean) => {
    menuStore.update((current) =>
      current.map((item) => (item.id === id ? { ...item, available } : item)),
    );
  }, []);

  const upsert = useCallback((item: PartnerMenuItem) => {
    menuStore.update((current) => {
      const index = current.findIndex((existing) => existing.id === item.id);
      if (index === -1) return [...current, item];
      return current.map((existing) =>
        existing.id === item.id ? item : existing,
      );
    });
  }, []);

  const remove = useCallback((id: string) => {
    menuStore.update((current) => current.filter((item) => item.id !== id));
  }, []);

  return {
    menu,
    hydrated,
    find: (id: string) => menu.find((item) => item.id === id) ?? null,
    setAvailable,
    upsert,
    remove,
  };
}

export function useKitchenStatus() {
  const status = useStore(statusStore);
  return { status, setStatus: (next: KitchenStatus) => statusStore.set(next) };
}

export function useAutoAccept() {
  const autoAccept = useStore(autoAcceptStore);
  return {
    autoAccept,
    setAutoAccept: (next: boolean) => autoAcceptStore.set(next),
  };
}

/** Fresh id for a dish, option group, or choice. */
export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;
}
