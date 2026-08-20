import { cn } from "@/lib/cn";

interface AvatarProps {
  /** Preset emoji, or null to fall back to the initial. */
  avatar?: string | null;
  initial: string;
  className?: string;
  /** Font size for the glyph; the container is sized by `className`. */
  textClassName?: string;
}

/**
 * One avatar, rendered the same way in the header and on the profile. The
 * gradient is the fallback identity — a picked emoji sits on a flat surface so
 * it stays legible against the gradient's lighter end.
 */
export function Avatar({
  avatar,
  initial,
  className,
  textClassName = "text-[28px]",
}: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex items-center justify-center rounded-full",
        avatar
          ? "bg-surface-3"
          : "bg-[linear-gradient(145deg,#F7C873,#C9A3FF)] font-bold text-white shadow-[0_6px_16px_-6px_rgba(201,163,255,0.5)]",
        textClassName,
        className,
      )}
    >
      {avatar ?? initial}
    </span>
  );
}
