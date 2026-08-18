import Link from "next/link";
import { GrubMark } from "@/components/icons";
import { cn } from "@/lib/cn";

interface LogoProps {
  size?: "sm" | "md";
  /** Hide the wordmark, keeping only the mark (used by the compact nav). */
  markOnly?: boolean;
  className?: string;
}

export function Logo({ size = "md", markOnly = false, className }: LogoProps) {
  const box = size === "sm" ? "size-8 rounded-[9px]" : "size-9 rounded-[10px]";
  const word = size === "sm" ? "text-[19px]" : "text-[22px]";

  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2.5", className)}
      aria-label="Grub Box home"
    >
      <span
        className={cn(
          "bg-primary text-canvas flex flex-none items-center justify-center",
          box,
        )}
      >
        <GrubMark size={size === "sm" ? 17 : 20} />
      </span>
      {!markOnly && (
        <span className={cn("font-display text-fg", word)}>Grub Box</span>
      )}
    </Link>
  );
}
