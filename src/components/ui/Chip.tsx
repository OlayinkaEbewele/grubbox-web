"use client";

import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ChipProps extends Omit<ComponentProps<"button">, "className" | "children"> {
  active?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Pill toggle used for cuisine filters, drop-off presets, and tip amounts.
 * Selection is carried by fill, not just border, so it survives a squint test.
 */
export function Chip({ active = false, className, children, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "flex flex-none items-center gap-2 rounded-full border-2 px-4 py-2.5 text-sm font-bold",
        "transition-[transform,background-color,border-color,color] duration-150 ease-[var(--ease-out-strong)]",
        "hover-fine:-translate-y-0.5 active:translate-y-0",
        active
          ? "border-primary bg-primary text-canvas"
          : "border-hairline bg-surface text-fg-muted hover:text-fg",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
