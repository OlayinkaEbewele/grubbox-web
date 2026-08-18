"use client";

import { PinIcon } from "@/components/icons";
import { useLocation } from "@/lib/location";
import { cn } from "@/lib/cn";

interface LocationButtonProps {
  /** `bare` is the nav treatment; `underline` is the hero treatment. */
  variant?: "bare" | "underline";
  className?: string;
}

export function LocationButton({
  variant = "bare",
  className,
}: LocationButtonProps) {
  const { label, status, error, location, detect } = useLocation();
  const locating = status === "locating";

  return (
    <span className={cn("inline-flex flex-col items-start", className)}>
      <button
        type="button"
        onClick={detect}
        disabled={locating}
        aria-busy={locating}
        className={cn(
          "inline-flex items-center gap-2 text-sm font-bold transition-colors disabled:cursor-progress",
          variant === "underline"
            ? "pb-1 text-white underline decoration-[var(--color-accent)] underline-offset-4 hover:text-[var(--color-accent)]"
            : "text-fg-muted hover:text-fg",
        )}
      >
        <PinIcon
          size={variant === "underline" ? 16 : 15}
          className={cn("text-primary flex-none", locating && "animate-pulse")}
        />
        {locating
          ? "Finding you…"
          : location
            ? label
            : `Set address · ${label}`}
      </button>

      {/* Announced politely — a permission prompt the user just dismissed
          shouldn't steal focus, but it does need to be readable. */}
      <span aria-live="polite" className="sr-only">
        {locating ? "Finding your location" : ""}
        {status === "ready" && location ? `Delivering to ${label}` : ""}
      </span>

      {error && (
        <span className="text-danger mt-1 block max-w-70 text-xs font-semibold">
          {error}
        </span>
      )}

      {location?.outsideServiceArea && status === "ready" && (
        <span className="text-accent mt-1 block max-w-70 text-xs font-semibold">
          You look to be outside our delivery areas — showing {label} for now.
        </span>
      )}
    </span>
  );
}
