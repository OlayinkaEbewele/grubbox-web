import { cn } from "@/lib/cn";

type Shape = "line" | "block" | "circle";

/**
 * Radius lives here rather than in a caller's className: `cn` is a plain join
 * with no Tailwind-aware merging, so two competing `rounded-*` classes would
 * be resolved by Tailwind's own utility order instead of by the caller.
 */
const SHAPES: Record<Shape, string> = {
  line: "rounded-full",
  block: "rounded-2xl",
  circle: "rounded-full",
};

interface SkeletonProps {
  shape?: Shape;
  /** Sizing only — `h-*`, `w-*`, `size-*`, `flex-1`. */
  className?: string;
}

/**
 * One grey block standing in for content that hasn't arrived. Always
 * `aria-hidden`: the loading state is announced once by the region's
 * `aria-busy`, not by every bar inside it.
 */
export function Skeleton({ shape = "line", className }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("shimmer bg-skeleton block", SHAPES[shape], className)}
    />
  );
}

/**
 * Wrapper for a screen's worth of skeleton. Screen readers get the label and
 * nothing else, so a loading page announces itself once instead of reading out
 * a wall of empty boxes.
 */
export function SkeletonScreen({
  label = "Loading",
  className,
  children,
}: {
  label?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div role="status" aria-busy="true" aria-label={label} className={className}>
      {children}
    </div>
  );
}
