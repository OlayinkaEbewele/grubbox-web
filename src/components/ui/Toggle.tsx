"use client";

import { cn } from "@/lib/cn";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Accessible name. Rendered visually only when `showLabel` is set. */
  label: string;
  showLabel?: boolean;
  size?: "sm" | "md";
  /** Colour of the track when on. Sold-out toggles read as a warning, not a win. */
  tone?: "primary" | "success" | "danger";
}

const SIZES = {
  sm: { track: "h-6 w-10", knob: "size-4.5", on: "translate-x-4.5", off: "translate-x-0.75" },
  md: { track: "h-6.5 w-11", knob: "size-5", on: "translate-x-5.25", off: "translate-x-0.75" },
} as const;

const TONES = {
  primary: "bg-primary",
  success: "bg-success",
  danger: "bg-danger",
} as const;

/**
 * A real switch: a checkbox input with `role="switch"`, so keyboard and screen
 * reader users get the state and the toggle behaviour for free.
 */
export function Toggle({
  checked,
  onChange,
  label,
  showLabel = false,
  size = "md",
  tone = "primary",
}: ToggleProps) {
  const s = SIZES[size];

  return (
    <label className="flex cursor-pointer items-center gap-3">
      {showLabel && (
        <span className="text-fg-muted text-[13px] font-bold">{label}</span>
      )}
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        aria-label={showLabel ? undefined : label}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          "relative flex flex-none items-center rounded-full transition-colors duration-200 ease-[var(--ease-out-strong)]",
          "peer-focus-visible:outline-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2",
          s.track,
          checked ? TONES[tone] : "bg-white/12",
        )}
      >
        <span
          className={cn(
            "rounded-full bg-white transition-transform duration-200 ease-[var(--ease-out-strong)]",
            s.knob,
            checked ? s.on : s.off,
          )}
        />
      </span>
    </label>
  );
}
