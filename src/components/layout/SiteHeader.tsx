"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { DeliveryAddressButton } from "@/components/layout/DeliveryAddressButton";
import { CartIcon, HeartIcon, SearchIcon } from "@/components/icons";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/cn";

const LINKS = [
  { label: "Browse food", href: "/browse" },
  { label: "For restaurants", href: "/partner" },
  { label: "Become a rider", href: "/rider" },
  { label: "Help", href: "/help" },
];

interface SiteHeaderProps {
  /**
   * Seeds the search box. Passed in rather than read from `useSearchParams()`:
   * that hook forces every page carrying this header to client-render up to the
   * nearest Suspense boundary, which on a prerendered route leaves the
   * client-only cart and location state disagreeing with the prerendered HTML.
   */
  initialQuery?: string;
  /** Sticks the header to the top — used where the page scrolls a long way. */
  sticky?: boolean;
  /**
   * Hides the header search. The landing page carries a much larger search in
   * its hero, and two search boxes on one screen is one too many.
   */
  showSearch?: boolean;
  /**
   * `app` leads with the delivery address — the thing that actually changes
   * what you can order. `marketing` leads with the section links instead.
   */
  variant?: "app" | "marketing";
}

/** The one header every customer-facing page uses. */
export function SiteHeader({
  initialQuery = "",
  sticky = false,
  showSearch = true,
  variant = "marketing",
}: SiteHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery);
  const { count, hydrated } = useCart();

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(
      trimmed ? `/browse?q=${encodeURIComponent(trimmed)}` : "/browse",
    );
  }

  return (
    <header
      className={cn(
        "bg-canvas w-full",
        sticky && "border-hairline sticky top-0 z-40 border-b",
      )}
    >
      <nav className="mx-auto flex h-[var(--header-h)] w-full max-w-[1400px] items-center gap-4 px-6 lg:px-14">
        <Logo className="flex-none" />

        {variant === "app" ? (
          <div className="hidden sm:block">
            <DeliveryAddressButton />
          </div>
        ) : (
          <div className="hidden items-center gap-7 xl:flex">
            {LINKS.map((link) => {
              const active =
                link.href === pathname || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "text-sm whitespace-nowrap transition-colors duration-150",
                    active
                      ? "text-primary font-extrabold"
                      : "text-fg-muted hover:text-primary font-bold",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}

        {showSearch ? (
          <form
            onSubmit={onSubmit}
            role="search"
            className="border-hairline bg-surface mx-auto flex min-w-0 flex-1 items-center gap-2.5 rounded-full border-2 px-4 py-2.5 md:max-w-[420px]"
          >
            <SearchIcon size={16} className="text-fg-subtle flex-none" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search food or restaurants"
              aria-label="Search food or restaurants"
              className="text-fg placeholder:text-fg-subtle w-full min-w-0 bg-transparent text-sm outline-none"
            />
          </form>
        ) : (
          <span className="flex-1" />
        )}

        <div className="flex flex-none items-center gap-2.5">
          <Link
            href="/favourites"
            title="Favourites"
            aria-label="Favourites"
            className="bg-surface-alt text-primary flex size-9.5 items-center justify-center rounded-full transition-transform duration-150 ease-[var(--ease-out-strong)] active:scale-95"
          >
            <HeartIcon size={18} />
          </Link>

          <Link
            href="/checkout"
            className="bg-surface-alt text-primary relative flex size-9.5 items-center justify-center rounded-full transition-transform duration-150 ease-[var(--ease-out-strong)] active:scale-95"
            aria-label={hydrated && count > 0 ? `Cart, ${count} items` : "Cart, empty"}
          >
            <CartIcon />
            {hydrated && count > 0 && (
              <span className="bg-primary text-canvas absolute -top-0.5 -right-0.5 flex size-4.5 items-center justify-center rounded-full text-[10px] font-extrabold tabular-nums">
                {count}
              </span>
            )}
          </Link>

          <Link
            href="/profile"
            title="Your profile"
            aria-label="Your profile"
            className="bg-surface-2 text-fg flex size-9.5 items-center justify-center rounded-full text-sm font-bold transition-transform duration-150 ease-[var(--ease-out-strong)] active:scale-95"
          >
            A
          </Link>
        </div>
      </nav>
    </header>
  );
}
