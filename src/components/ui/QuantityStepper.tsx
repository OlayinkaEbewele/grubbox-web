"use client";

import { cn } from "@/lib/cn";

interface QuantityStepperProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  /** Label for screen readers, e.g. the dish name. */
  label: string;
  size?: "sm" | "md";
  /** Below this, decrementing removes the line instead of going lower. */
  min?: number;
}

const SIZES = {
  sm: { button: "size-5 text-[13px]", value: "text-xs min-w-2.5", pad: "gap-1.5 p-1" },
  md: { button: "size-7 text-base", value: "text-sm min-w-3.5", pad: "gap-2.5 p-1.5" },
} as const;

export function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
  label,
  size = "md",
  min = 0,
}: QuantityStepperProps) {
  const s = SIZES[size];

  return (
    <div
      className={cn("bg-surface-3 flex flex-none items-center rounded-full", s.pad)}
    >
      <button
        type="button"
        onClick={onDecrement}
        disabled={quantity <= min}
        aria-label={
          quantity <= 1 && min === 0 ? `Remove ${label}` : `One fewer ${label}`
        }
        className={cn(
          "bg-surface text-fg flex items-center justify-center rounded-full font-extrabold",
          "transition-transform duration-150 ease-[var(--ease-out-strong)] active:scale-[0.92]",
          "disabled:opacity-40",
          s.button,
        )}
      >
        −
      </button>
      {/* aria-live so the count reaching the user isn't only visual */}
      <span
        aria-live="polite"
        className={cn("text-center font-extrabold tabular-nums", s.value)}
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        aria-label={`One more ${label}`}
        className={cn(
          "bg-primary text-canvas flex items-center justify-center rounded-full font-extrabold",
          "transition-transform duration-150 ease-[var(--ease-out-strong)] active:scale-[0.92]",
          s.button,
        )}
      >
        +
      </button>
    </div>
  );
}

interface AddButtonProps {
  onClick: () => void;
  label: string;
}

/** The zero state of the stepper — a single tap target that starts the line. */
export function AddButton({ onClick, label }: AddButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Add ${label} to cart`}
      className={cn(
        "bg-surface border-primary text-primary size-10 flex-none rounded-full border-2 text-xl font-extrabold",
        "shadow-[0_3px_0_var(--color-surface-alt)]",
        "transition-transform duration-150 ease-[var(--ease-out-strong)]",
        "hover-fine:scale-108 active:scale-95",
      )}
    >
      +
    </button>
  );
}
