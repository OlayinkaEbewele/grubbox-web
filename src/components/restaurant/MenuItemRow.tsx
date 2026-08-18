"use client";

import Image from "next/image";
import { AddButton, QuantityStepper } from "@/components/ui/QuantityStepper";
import { useCart } from "@/lib/cart";
import { formatNaira } from "@/lib/format";
import type { MenuItem } from "@/lib/types";

interface MenuItemRowProps {
  item: MenuItem;
  restaurantSlug: string;
}

export function MenuItemRow({ item, restaurantSlug }: MenuItemRowProps) {
  const { quantityOf, add, setQuantity } = useCart();
  const quantity = quantityOf(item.id);

  return (
    <li className="border-hairline flex items-center gap-4.5 border-b pb-5">
      <div className="relative size-24 flex-none overflow-hidden rounded-[20px]">
        <Image src={item.image} alt="" fill sizes="96px" className="object-cover" />
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="text-fg mb-1 text-base font-extrabold">{item.name}</h4>
        <p className="text-fg-subtle mb-2 text-[13.5px] leading-normal">
          {item.description}
        </p>
        <p className="text-primary text-[15px] font-extrabold">
          {formatNaira(item.price)}
        </p>
      </div>

      {quantity > 0 ? (
        <QuantityStepper
          quantity={quantity}
          label={item.name}
          onIncrement={() => add(restaurantSlug, item)}
          onDecrement={() => setQuantity(item.id, quantity - 1)}
        />
      ) : (
        <AddButton label={item.name} onClick={() => add(restaurantSlug, item)} />
      )}
    </li>
  );
}
