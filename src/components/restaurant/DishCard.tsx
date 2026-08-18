"use client";

import Image from "next/image";
import Link from "next/link";
import { AddButton, QuantityStepper } from "@/components/ui/QuantityStepper";
import { ClockIcon } from "@/components/icons";
import { useCart } from "@/lib/cart";
import { formatNaira } from "@/lib/format";
import type { DishHit } from "@/lib/data";

/**
 * A dish in search results. The whole card links through to the restaurant,
 * but the add control stays a real button so people can order straight from
 * the results without a detour.
 */
export function DishCard({ hit }: { hit: DishHit }) {
  const { item, restaurant, sectionName } = hit;
  const { quantityOf, add, setQuantity } = useCart();
  const quantity = quantityOf(item.id);

  return (
    <li className="border-hairline bg-surface relative flex items-center gap-4 rounded-3xl border-2 p-4">
      <div className="relative size-20 flex-none overflow-hidden rounded-2xl">
        <Image src={item.image} alt="" fill sizes="80px" className="object-cover" />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-fg mb-0.5 text-[15px] font-extrabold">
          {/* Stretched link: the card is one big target, minus the add button. */}
          <Link
            href={`/restaurants/${restaurant.slug}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {item.name}
          </Link>
        </h3>

        <p className="text-fg-subtle mb-1.5 line-clamp-1 text-[13px]">
          {restaurant.name} · {sectionName}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-primary text-sm font-extrabold">
            {formatNaira(item.price)}
          </span>
          <span className="text-fg-muted flex items-center gap-1.5 text-xs font-bold">
            <ClockIcon className="text-primary" />
            {restaurant.deliveryTime}
          </span>
        </div>
      </div>

      <div className="relative z-10 flex-none">
        {quantity > 0 ? (
          <QuantityStepper
            quantity={quantity}
            label={item.name}
            onIncrement={() => add(restaurant.slug, item)}
            onDecrement={() => setQuantity(item.id, quantity - 1)}
          />
        ) : (
          <AddButton label={item.name} onClick={() => add(restaurant.slug, item)} />
        )}
      </div>
    </li>
  );
}
