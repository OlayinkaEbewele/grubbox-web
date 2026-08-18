import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type EmptyStateVariant =
  | "cart"
  | "search"
  | "orders"
  | "address"
  | "payment"
  | "favorites"
  | "notifications";

/** One line-art glyph per variant, drawn to match the design's reference set. */
const ICONS: Record<EmptyStateVariant, ReactNode> = {
  cart: (
    <>
      <path
        d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L21 8H6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="20" r="1.3" fill="currentColor" />
      <circle cx="17" cy="20" r="1.3" fill="currentColor" />
    </>
  ),
  search: (
    <>
      <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="m19.5 19.5-4.7-4.7M5.5 14.5l9-9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </>
  ),
  orders: (
    <>
      <path
        d="M7 3h10a1 1 0 0 1 1 1v17l-2.5-1.5L13 21l-2.5-1.5L8 21l-2.5-1.5L3 21V4a1 1 0 0 1 1-1h1z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </>
  ),
  address: (
    <>
      <path
        d="M12 21s-7-6.6-7-11.5A7 7 0 0 1 19 9.5C19 14.4 12 21 12 21z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9.5" r="2.6" stroke="currentColor" strokeWidth="1.7" />
    </>
  ),
  payment: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.7" />
    </>
  ),
  favorites: (
    <path
      d="M12 21s-7.5-4.6-10-9.3C.5 8 2.6 4.5 6.2 4.5c2 0 3.5 1 5.8 3.5 2.3-2.5 3.8-3.5 5.8-3.5 3.6 0 5.7 3.5 4.2 7.2C19.5 16.4 12 21 12 21z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  ),
  notifications: (
    <>
      <path
        d="M6 10a6 6 0 0 1 12 0c0 3 1 5 2 6H4c1-1 2-3 2-6z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M10 20a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </>
  ),
};

interface EmptyStateProps {
  variant: EmptyStateVariant;
  title: string;
  description: string;
  /** Optional call to action — a button or link. */
  action?: ReactNode;
  className?: string;
}

/**
 * The shared "nothing here yet" block. Keeping every empty screen on one
 * component is what stops them drifting apart as pages get built.
 */
export function EmptyState({
  variant,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "border-hairline bg-surface flex flex-col items-center rounded-3xl border-2 px-8 py-12 text-center",
        className,
      )}
    >
      <span className="bg-surface-3 text-primary mb-5 flex size-18 items-center justify-center rounded-full">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {ICONS[variant]}
        </svg>
      </span>

      <h2 className="font-display text-fg mb-2 text-xl">{title}</h2>
      <p className="text-fg-subtle mb-6 max-w-70 text-sm leading-relaxed">
        {description}
      </p>

      {action}
    </div>
  );
}
