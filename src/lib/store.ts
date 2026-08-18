"use client";

import { useSyncExternalStore } from "react";

/**
 * A localStorage-backed store shaped for `useSyncExternalStore`.
 *
 * Reading persisted state inside an effect causes a cascading render and a
 * visible flash of the wrong state. Subscribing to the store instead lets
 * React use the server snapshot during hydration and swap in the real value
 * in the same commit — and it keeps other tabs in sync for free.
 */
export interface PersistentStore<T> {
  subscribe(listener: () => void): () => void;
  getSnapshot(): T;
  getServerSnapshot(): T;
  set(next: T): void;
  update(recipe: (current: T) => T): void;
}

export function createPersistentStore<T>(
  key: string,
  fallback: T,
  /** Guards against malformed or stale persisted shapes. */
  isValid: (value: unknown) => value is T,
): PersistentStore<T> {
  // `undefined` means "not read yet". The cache keeps getSnapshot returning a
  // referentially stable value, which useSyncExternalStore requires.
  let cache: T | undefined;
  const listeners = new Set<() => void>();

  function read(): T {
    if (cache !== undefined) return cache;
    try {
      const raw = window.localStorage.getItem(key);
      const parsed: unknown = raw ? JSON.parse(raw) : null;
      cache = isValid(parsed) ? parsed : fallback;
    } catch {
      cache = fallback;
    }
    return cache;
  }

  function emit() {
    for (const listener of listeners) listener();
  }

  function onStorage(event: StorageEvent) {
    if (event.key !== key) return;
    cache = undefined; // another tab wrote; re-read on next snapshot
    emit();
  }

  return {
    subscribe(listener) {
      if (listeners.size === 0) {
        window.addEventListener("storage", onStorage);
      }
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          window.removeEventListener("storage", onStorage);
        }
      };
    },

    getSnapshot: read,

    getServerSnapshot: () => fallback,

    set(next) {
      cache = next;
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // Storage full or blocked (private mode). State still holds for this
        // session, and there's nothing useful to tell the user here.
      }
      emit();
    },

    update(recipe) {
      this.set(recipe(read()));
    },
  };
}

export function useStore<T>(store: PersistentStore<T>): T {
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
}

const noopSubscribe = () => () => {};

/**
 * False on the server and during hydration, true afterwards. Lets a screen
 * hold its layout instead of flashing an empty state before persisted data
 * is available.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
