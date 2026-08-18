"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatNaira, pluralize } from "@/lib/format";

/**
 * Floating cart summary. It slides up from the bottom edge rather than fading
 * in place — entering from the direction it lives in keeps the spatial story
 * intact. Kept mounted so the exit animates too.
 */
export function CartBar() {
  const { count, subtotal, hydrated } = useCart();
  const visible = hydrated && count > 0;

  return (
    <div
      aria-hidden={!visible}
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-6"
    >
      <div
        data-visible={visible}
        className="bg-surface-2 flex w-full max-w-[480px] translate-y-6 items-center justify-between gap-4 rounded-full py-2 pr-2 pl-6 opacity-0 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)] transition-[transform,opacity] duration-300 ease-[var(--ease-out-strong)] data-[visible=true]:pointer-events-auto data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100"
      >
        <span className="text-sm font-bold text-white tabular-nums">
          {count} {pluralize(count, "item")} · {formatNaira(subtotal)}
        </span>
        <Link
          href="/checkout"
          tabIndex={visible ? 0 : -1}
          className="bg-primary text-canvas rounded-full px-6.5 py-3 text-sm font-extrabold transition-transform duration-150 ease-[var(--ease-out-strong)] active:scale-97"
        >
          View Cart
        </Link>
      </div>
    </div>
  );
}
