"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

export type DeliveryFeeFilter = "any" | "free" | "under500";
export type RatingFilter = "any" | "4.5" | "4.0";

export interface Filters {
  discounts: boolean;
  deliveryFee: DeliveryFeeFilter;
  openNow: boolean;
  pickup: boolean;
  rating: RatingFilter;
  under30: boolean;
  grubPass: boolean;
}

export const NO_FILTERS: Filters = {
  discounts: false,
  deliveryFee: "any",
  openNow: false,
  pickup: false,
  rating: "any",
  under30: false,
  grubPass: false,
};

export function activeFilterCount(filters: Filters): number {
  return (
    Number(filters.discounts) +
    Number(filters.deliveryFee !== "any") +
    Number(filters.openNow) +
    Number(filters.pickup) +
    Number(filters.rating !== "any") +
    Number(filters.under30) +
    Number(filters.grubPass)
  );
}

const DELIVERY_FEE_OPTIONS: { value: DeliveryFeeFilter; label: string }[] = [
  { value: "any", label: "Any delivery fee" },
  { value: "free", label: "Free delivery" },
  { value: "under500", label: "Under ₦500" },
];

const RATING_OPTIONS: { value: RatingFilter; label: string }[] = [
  { value: "any", label: "Any rating" },
  { value: "4.5", label: "4.5 and above" },
  { value: "4.0", label: "4.0 and above" },
];

interface FilterBarProps {
  filters: Filters;
  onChange: (next: Filters) => void;
  onOpenAll: () => void;
}

export function FilterBar({ filters, onChange, onOpenAll }: FilterBarProps) {
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    onChange({ ...filters, [key]: value });

  const count = activeFilterCount(filters);

  return (
    <div className="rail-clean -mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1">
      <Pill
        onClick={onOpenAll}
        active={count > 0}
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7h16M7 12h10M10 17h4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
          </svg>
        }
      >
        All Filters{count > 0 && ` (${count})`}
      </Pill>

      <Pill
        active={filters.discounts}
        onClick={() => set("discounts", !filters.discounts)}
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
            <path d="m9 15 6-6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
            <circle cx="9.5" cy="9.5" r="1.2" fill="currentColor" />
            <circle cx="14.5" cy="14.5" r="1.2" fill="currentColor" />
          </svg>
        }
      >
        Discounts
      </Pill>

      <Dropdown
        label="Delivery fee"
        active={filters.deliveryFee !== "any"}
        activeLabel={
          DELIVERY_FEE_OPTIONS.find((o) => o.value === filters.deliveryFee)?.label
        }
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="6" cy="17" r="3" stroke="currentColor" strokeWidth="1.7" />
            <circle cx="18" cy="17" r="3" stroke="currentColor" strokeWidth="1.7" />
            <path d="M6 17l4-8h4l4 8M10 9h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
        options={DELIVERY_FEE_OPTIONS}
        value={filters.deliveryFee}
        onSelect={(value) => set("deliveryFee", value)}
      />

      <Pill
        active={filters.openNow}
        onClick={() => set("openNow", !filters.openNow)}
        icon={<ClockGlyph />}
      >
        Open now
      </Pill>

      <Pill
        active={filters.pickup}
        onClick={() => set("pickup", !filters.pickup)}
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 8h14l-1 12H6z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            <path d="M9 8a3 3 0 0 1 6 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        }
      >
        Pickup
      </Pill>

      <Dropdown
        label="Ratings"
        active={filters.rating !== "any"}
        activeLabel={RATING_OPTIONS.find((o) => o.value === filters.rating)?.label}
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="m12 4 2.4 5 5.6.6-4 3.9 1 5.5-5-2.8-5 2.8 1-5.5-4-3.9 5.6-.6z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        }
        options={RATING_OPTIONS}
        value={filters.rating}
        onSelect={(value) => set("rating", value)}
      />

      <Pill
        active={filters.under30}
        onClick={() => set("under30", !filters.under30)}
        icon={<ClockGlyph />}
      >
        Under 30 mins
      </Pill>

      <Pill
        active={filters.grubPass}
        onClick={() => set("grubPass", !filters.grubPass)}
        tone="accent"
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
            <path d="M12 7v10M7 12h10M8.8 8.8l6.4 6.4M15.2 8.8l-6.4 6.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        }
      >
        Grub Pass
      </Pill>
    </div>
  );
}

function ClockGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

interface PillProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  active?: boolean;
  tone?: "default" | "accent";
  onClick?: () => void;
}

function Pill({ children, icon, active = false, tone = "default", onClick }: PillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex flex-none items-center gap-2 rounded-full border-2 px-4 py-2.5 text-sm font-bold whitespace-nowrap",
        "transition-[transform,background-color,border-color,color] duration-150 ease-[var(--ease-out-strong)]",
        "hover-fine:-translate-y-0.5 active:translate-y-0",
        active
          ? "border-primary bg-primary text-canvas"
          : cn(
              "border-hairline bg-surface hover:text-fg",
              tone === "accent" ? "text-accent" : "text-fg-muted",
            ),
      )}
    >
      {icon}
      {children}
    </button>
  );
}

interface DropdownProps<T extends string> {
  label: string;
  icon: React.ReactNode;
  options: { value: T; label: string }[];
  value: T;
  active: boolean;
  activeLabel?: string;
  onSelect: (value: T) => void;
}

function Dropdown<T extends string>({
  label,
  icon,
  options,
  value,
  active,
  activeLabel,
  onSelect,
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape, the two ways people expect to dismiss a menu.
  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative flex-none">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          "flex items-center gap-2 rounded-full border-2 px-4 py-2.5 text-sm font-bold whitespace-nowrap",
          "transition-[transform,background-color,border-color,color] duration-150 ease-[var(--ease-out-strong)]",
          "hover-fine:-translate-y-0.5 active:translate-y-0",
          active
            ? "border-primary bg-primary text-canvas"
            : "border-hairline bg-surface text-fg-muted hover:text-fg",
        )}
      >
        {icon}
        {active ? activeLabel : label}
        <ChevronDownIcon size={13} className={cn("transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="menu"
          className="bg-surface border-hairline absolute top-12 left-0 z-30 w-52 rounded-2xl border-2 p-2 shadow-[0_12px_28px_rgba(0,0,0,0.45)]"
        >
          {options.map((option) => (
            <button
              key={option.value}
              role="menuitemradio"
              aria-checked={option.value === value}
              onClick={() => {
                onSelect(option.value);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[13.5px] font-bold transition-colors duration-150",
                option.value === value
                  ? "bg-surface-3 text-fg"
                  : "text-fg-muted hover:bg-surface-3 hover:text-fg",
              )}
            >
              {option.label}
              {option.value === value && <span className="text-primary">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
