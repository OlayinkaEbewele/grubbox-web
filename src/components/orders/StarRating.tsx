"use client";

import { cn } from "@/lib/cn";

function Star({ filled, size }: { filled: boolean; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.4l6.5-.9z"
        fill={filled ? "var(--color-accent)" : "transparent"}
        stroke={filled ? "var(--color-accent)" : "var(--color-fg-subtle)"}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: number;
  label?: string;
}

/**
 * Five stars. Interactive it's a radio group, not five buttons — arrow keys
 * move between ratings, and the whole control is one tab stop.
 */
export function StarRating({
  value,
  onChange,
  readOnly = false,
  size = 28,
  label = "Rating",
}: StarRatingProps) {
  if (readOnly) {
    return (
      <span className="flex items-center gap-1" aria-label={`${value} out of 5`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} filled={star <= value} size={size} />
        ))}
      </span>
    );
  }

  return (
    <div role="radiogroup" aria-label={label} className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={star === value}
          aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
          // Only the selected star is tabbable, so the group is one tab stop.
          tabIndex={star === value || (value === 0 && star === 1) ? 0 : -1}
          onClick={() => onChange?.(star)}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowUp") {
              event.preventDefault();
              onChange?.(Math.min(5, (value || 0) + 1));
            } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
              event.preventDefault();
              onChange?.(Math.max(1, (value || 1) - 1));
            }
          }}
          className={cn(
            "rounded-lg p-0.5 transition-transform duration-150 ease-[var(--ease-out-strong)]",
            "hover-fine:scale-110 active:scale-95",
          )}
        >
          <Star filled={star <= value} size={size} />
        </button>
      ))}
    </div>
  );
}
