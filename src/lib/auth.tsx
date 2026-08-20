"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { createPersistentStore, useHydrated, useStore } from "@/lib/store";
import { PROFILE } from "@/lib/data/profile";

const STORAGE_KEY = "grubbox.session.v1";

export interface Session {
  name: string;
  email: string;
  /** Single letter, used when no avatar has been picked. */
  initial: string;
  phone?: string;
  /** A preset emoji avatar. Null means fall back to the initial. */
  avatar?: string | null;
}

/**
 * No session is the default: a first-time visitor is logged out, and stays
 * that way until they sign in. `null` rather than a guest object so every
 * check is a plain truthiness test.
 */
function isSession(value: unknown): value is Session | null {
  if (value === null) return true;
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Session).email === "string" &&
    typeof (value as Session).name === "string"
  );
}

const sessionStore = createPersistentStore<Session | null>(
  STORAGE_KEY,
  null,
  isSession,
);

/** "adaeze.okafor@email.com" → "Adaeze Okafor". */
function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const words = local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  return words.join(" ") || PROFILE.name;
}

export type AuthMode = "login" | "signup";

interface SignInInput {
  email: string;
  /** Present on sign-up, where the person told us their name directly. */
  name?: string;
}

interface AuthContextValue {
  session: Session | null;
  /** False until the persisted session is readable — see `useHydrated`. */
  hydrated: boolean;
  signIn(input: SignInInput): void;
  signOut(): void;
  /** Edits the signed-in person's own details. No-op when signed out. */
  updateProfile(patch: Partial<Omit<Session, "initial">>): void;
  /** Opens the app-wide sign-in dialog on the given tab. */
  openAuth(mode?: AuthMode): void;
  closeAuth(): void;
  /** The tab the dialog should show, or null when it's closed. */
  authMode: AuthMode | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const session = useStore(sessionStore);
  const hydrated = useHydrated();
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);

  const signIn = useCallback(({ email, name }: SignInInput) => {
    const resolved = name?.trim() || nameFromEmail(email);
    sessionStore.set({
      name: resolved,
      email,
      initial: resolved.charAt(0).toUpperCase() || "G",
      phone: PROFILE.phone,
    });
    setAuthMode(null);
  }, []);

  const signOut = useCallback(() => {
    sessionStore.set(null);
  }, []);

  const updateProfile = useCallback(
    (patch: Partial<Omit<Session, "initial">>) => {
      sessionStore.update((current) => {
        if (!current) return current;
        const next = { ...current, ...patch };
        // The avatar letter follows the name rather than being edited directly.
        return { ...next, initial: next.name.charAt(0).toUpperCase() || "G" };
      });
    },
    [],
  );

  const openAuth = useCallback((mode: AuthMode = "login") => {
    setAuthMode(mode);
  }, []);

  const closeAuth = useCallback(() => setAuthMode(null), []);

  const value = useMemo(
    () => ({
      session,
      hydrated,
      signIn,
      signOut,
      updateProfile,
      openAuth,
      closeAuth,
      authMode,
    }),
    [
      session,
      hydrated,
      signIn,
      signOut,
      updateProfile,
      openAuth,
      closeAuth,
      authMode,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
