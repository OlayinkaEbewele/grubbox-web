"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { createPersistentStore, useHydrated, useStore } from "@/lib/store";

const STORAGE_KEY = "grubbox.location.v1";

export interface DeliveryArea {
  name: string;
  city: string;
  lat: number;
  lng: number;
}

/** Areas Grub Box currently delivers to, with their approximate centres. */
export const DELIVERY_AREAS: DeliveryArea[] = [
  { name: "Lekki Phase 1", city: "Lagos", lat: 6.4474, lng: 3.4736 },
  { name: "Victoria Island", city: "Lagos", lat: 6.4281, lng: 3.4219 },
  { name: "Ikoyi", city: "Lagos", lat: 6.4541, lng: 3.4316 },
  { name: "Yaba", city: "Lagos", lat: 6.5095, lng: 3.3711 },
  { name: "Surulere", city: "Lagos", lat: 6.4969, lng: 3.3481 },
  { name: "Ikeja", city: "Lagos", lat: 6.6018, lng: 3.3515 },
  { name: "Wuse", city: "Abuja", lat: 9.0765, lng: 7.4986 },
  { name: "Maitama", city: "Abuja", lat: 9.087, lng: 7.4951 },
  { name: "Garki", city: "Abuja", lat: 9.0333, lng: 7.4833 },
];

/** Beyond this, the nearest area isn't a plausible delivery address. */
const SERVICE_RADIUS_KM = 25;

export interface StoredLocation {
  area: string;
  city: string;
  lat: number;
  lng: number;
  /** Full street line when the address was typed rather than detected. */
  line?: string;
  /** True when the nearest area is further than the service radius. */
  outsideServiceArea: boolean;
  detectedAt: string;
  source: "detected" | "manual";
}

const HISTORY_KEY = "grubbox.location.history.v1";
const HISTORY_LIMIT = 5;

function isStoredLocation(value: unknown): value is StoredLocation {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as StoredLocation).area === "string" &&
    typeof (value as StoredLocation).lat === "number"
  );
}

const locationStore = createPersistentStore<StoredLocation | null>(
  STORAGE_KEY,
  null,
  (value): value is StoredLocation | null =>
    value === null || isStoredLocation(value),
);

const historyStore = createPersistentStore<StoredLocation[]>(
  HISTORY_KEY,
  [],
  (value): value is StoredLocation[] => Array.isArray(value),
);

/** Two saved addresses are the same place if they share a label and street. */
function sameAddress(a: StoredLocation, b: StoredLocation) {
  return a.area === b.area && (a.line ?? "") === (b.line ?? "");
}

/** Great-circle distance in kilometres. */
function distanceKm(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number,
): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Maps coordinates onto the nearest area we serve.
 *
 * This stands in for a reverse-geocoding provider: it needs no API key and
 * works offline, and the only thing a real geocoder would change is this
 * function's body.
 */
export function nearestArea(lat: number, lng: number) {
  let best = DELIVERY_AREAS[0];
  let bestDistance = Infinity;

  for (const area of DELIVERY_AREAS) {
    const d = distanceKm(lat, lng, area.lat, area.lng);
    if (d < bestDistance) {
      bestDistance = d;
      best = area;
    }
  }

  return { area: best, distanceKm: bestDistance };
}

export type LocationStatus = "idle" | "locating" | "ready" | "error";

interface LocationContextValue {
  location: StoredLocation | null;
  /** Recently used addresses, newest first. */
  history: StoredLocation[];
  status: LocationStatus;
  error: string | null;
  hydrated: boolean;
  /** Label to show in the UI — the chosen area, or the default. */
  label: string;
  /** The street line when there is one, otherwise the area. */
  detail: string;
  detect: () => void;
  /** Chooses an address typed or picked in the address dialog. */
  choose: (entry: Omit<StoredLocation, "detectedAt" | "source">) => void;
  clear: () => void;
}

const FALLBACK_AREA = "Lekki Phase 1";

const LocationContext = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const location = useStore(locationStore);
  const history = useStore(historyStore);
  const hydrated = useHydrated();
  const [status, setStatus] = useState<LocationStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const remember = useCallback((entry: StoredLocation) => {
    historyStore.update((current) => {
      const withoutDuplicate = current.filter((item) => !sameAddress(item, entry));
      return [entry, ...withoutDuplicate].slice(0, HISTORY_LIMIT);
    });
  }, []);

  const detect = useCallback(() => {
    if (typeof window === "undefined") return;

    if (!("geolocation" in navigator)) {
      setStatus("error");
      setError("This browser can't share your location.");
      return;
    }

    setStatus("locating");
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const { area, distanceKm: distance } = nearestArea(latitude, longitude);

        const entry: StoredLocation = {
          area: area.name,
          city: area.city,
          lat: latitude,
          lng: longitude,
          outsideServiceArea: distance > SERVICE_RADIUS_KM,
          detectedAt: new Date().toISOString(),
          source: "detected",
        };
        locationStore.set(entry);
        remember(entry);
        setStatus("ready");
      },
      (positionError) => {
        setStatus("error");
        // The browser's own messages are inconsistent across vendors, so map
        // the codes to something a customer can act on.
        switch (positionError.code) {
          case positionError.PERMISSION_DENIED:
            setError(
              "Location permission was blocked. You can enable it in your browser settings.",
            );
            break;
          case positionError.POSITION_UNAVAILABLE:
            setError("We couldn't get a fix on your location. Try again.");
            break;
          case positionError.TIMEOUT:
            setError("Finding your location took too long. Try again.");
            break;
          default:
            setError("Something went wrong finding your location.");
        }
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
    );
  }, [remember]);

  const choose = useCallback(
    (entry: Omit<StoredLocation, "detectedAt" | "source">) => {
      const stored: StoredLocation = {
        ...entry,
        detectedAt: new Date().toISOString(),
        source: "manual",
      };
      locationStore.set(stored);
      remember(stored);
      setStatus("ready");
      setError(null);
    },
    [remember],
  );

  const clear = useCallback(() => {
    locationStore.set(null);
    setStatus("idle");
    setError(null);
  }, []);

  const value = useMemo<LocationContextValue>(
    () => ({
      location,
      status,
      error,
      hydrated,
      history: hydrated ? history : [],
      label: hydrated && location ? location.area : FALLBACK_AREA,
      detail:
        hydrated && location
          ? (location.line ?? `${location.area}, ${location.city}`)
          : FALLBACK_AREA,
      detect,
      choose,
      clear,
    }),
    [location, history, status, error, hydrated, detect, choose, clear],
  );

  return (
    <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
  );
}

export function useLocation(): LocationContextValue {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used inside <LocationProvider>");
  }
  return context;
}
