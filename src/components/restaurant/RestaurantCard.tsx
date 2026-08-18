import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ClockIcon } from "@/components/icons";
import type { Restaurant } from "@/lib/types";

interface RestaurantCardProps {
  restaurant: Restaurant;
  /** Index in the grid, used to stagger the entrance. */
  index?: number;
}

export function RestaurantCard({ restaurant, index = 0 }: RestaurantCardProps) {
  return (
    <div
      className="stagger-in"
      // Capped so a long list never leaves the last card waiting.
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
    >
      <Link
        href={`/restaurants/${restaurant.slug}`}
        className="lift group bg-surface block overflow-hidden rounded-[28px] shadow-[0_4px_16px_-8px_rgba(0,0,0,0.5)] hover:shadow-[0_28px_48px_-20px_rgba(0,0,0,0.7)]"
      >
        <div className="relative h-[220px] overflow-hidden">
          <Image
            src={restaurant.image}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover transition-transform duration-[400ms] ease-[var(--ease-out-strong)] group-hover-fine:scale-106"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(23,23,27,0.75)_0%,rgba(23,23,27,0)_45%)]"
          />

          <span className="text-canvas absolute top-3.5 right-3.5 rounded-full bg-white/95 px-2.75 py-1.25 text-[12.5px] font-extrabold">
            ★ {restaurant.rating}
          </span>

          {restaurant.promo && (
            <span className="bg-primary text-canvas absolute top-3.5 left-3.5 rounded-full px-3 py-1.25 text-[11.5px] font-extrabold">
              {restaurant.promo}
            </span>
          )}

          <h3 className="font-display absolute bottom-3.5 left-4.5 text-[22px] text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.4)]">
            {restaurant.name}
          </h3>
        </div>

        <div className="px-4.5 pt-4 pb-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-fg-subtle text-[13.5px] font-semibold">
              {restaurant.cuisine}
            </p>
            {/* The arrow rides in from the left on hover — a small promise that
                the card leads somewhere. */}
            <span
              aria-hidden="true"
              className="bg-surface-3 flex h-8 w-15 flex-none items-center overflow-hidden rounded-full px-2"
            >
              <ArrowRightIcon className="text-primary -translate-x-3.5 transition-transform duration-[350ms] ease-[var(--ease-out-strong)] group-hover-fine:translate-x-4" />
            </span>
          </div>

          <div className="text-fg-muted flex items-center gap-4 text-[12.5px] font-bold">
            <span className="flex items-center gap-1.5">
              <ClockIcon className="text-primary" />
              {restaurant.deliveryTime}
            </span>
            <span>
              {restaurant.deliveryFee === 0
                ? "Free delivery"
                : `₦${restaurant.deliveryFee} delivery`}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
