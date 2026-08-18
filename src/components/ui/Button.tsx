import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "dark" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  // The signature control: lilac fill sitting on a deep purple slab it sinks
  // into on press.
  primary:
    "bg-primary text-canvas shadow-[0_5px_0_var(--color-primary-deep)] hover:shadow-[0_3px_0_var(--color-primary-deep)] active:shadow-[0_2px_0_var(--color-primary-deep)]",
  dark: "bg-surface-2 text-fg shadow-[0_5px_0_#000] hover:shadow-[0_3px_0_#000] active:shadow-[0_2px_0_#000]",
  outline:
    "bg-surface text-fg-muted border-2 border-hairline hover:border-primary hover:text-fg",
  ghost: "bg-transparent text-fg-muted hover:text-primary",
};

const SIZES: Record<Size, string> = {
  sm: "px-4 py-2 text-[13px]",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-3.5 text-[15px]",
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

function classes({ variant = "primary", size = "md", className }: BaseProps) {
  return cn(
    "press inline-flex items-center justify-center gap-2 rounded-full font-extrabold",
    "disabled:pointer-events-none disabled:opacity-50",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

type ButtonProps = BaseProps &
  Omit<ComponentProps<"button">, "className" | "children">;

export function Button({ variant, size, className, children, ...props }: ButtonProps) {
  return (
    <button className={classes({ variant, size, className, children })} {...props}>
      {children}
    </button>
  );
}

type ButtonLinkProps = BaseProps &
  Omit<ComponentProps<typeof Link>, "className" | "children">;

export function ButtonLink({
  variant,
  size,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={classes({ variant, size, className, children })} {...props}>
      {children}
    </Link>
  );
}
