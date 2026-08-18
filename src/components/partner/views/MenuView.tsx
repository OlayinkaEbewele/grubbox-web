"use client";

import { Panel } from "@/components/partner/Panel";
import { ButtonLink } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import type { PartnerMenuItem } from "@/lib/data/partner";
import { formatNaira } from "@/lib/format";
import { cn } from "@/lib/cn";

interface MenuViewProps {
  menu: PartnerMenuItem[];
  onToggle: (index: number, available: boolean) => void;
}

export function MenuView({ menu, onToggle }: MenuViewProps) {
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-[28px]">Menu</h1>
        <ButtonLink href="/partner/dashboard/menu/new" size="sm">
          + Add dish
        </ButtonLink>
      </div>

      <Panel className="overflow-hidden">
        <ul>
          {menu.map((item, index) => (
            <li
              key={item.name}
              className="flex items-center justify-between gap-4 border-b border-white/6 px-5.5 py-4 last:border-b-0"
            >
              <div className="min-w-0">
                <p
                  className={cn(
                    "text-[14.5px] font-bold",
                    item.available ? "text-fg" : "text-fg-subtle",
                  )}
                >
                  {item.name}
                </p>
                <p className="text-fg-subtle mt-0.5 text-[12.5px] tabular-nums">
                  {formatNaira(item.price)}
                  {!item.available && " · Sold out"}
                </p>
              </div>
              <Toggle
                checked={item.available}
                onChange={(value) => onToggle(index, value)}
                label={`${item.name} available`}
              />
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
