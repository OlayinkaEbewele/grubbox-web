"use client";

import { Logo } from "@/components/Logo";
import {
  BoxIcon,
  ChartIcon,
  GearIcon,
  GridIcon,
  ListIcon,
} from "@/components/icons";
import { cn } from "@/lib/cn";
import { usePartnerAuth } from "@/lib/partner";

export const PARTNER_VIEWS = [
  { id: "dashboard", label: "Dashboard", Icon: GridIcon },
  { id: "orders", label: "Orders", Icon: BoxIcon },
  { id: "menu", label: "Menu", Icon: ListIcon },
  { id: "earnings", label: "Earnings", Icon: ChartIcon },
  { id: "settings", label: "Settings", Icon: GearIcon },
] as const;

export type PartnerView = (typeof PARTNER_VIEWS)[number]["id"];

interface PartnerSidebarProps {
  view: PartnerView;
  onSelect: (view: PartnerView) => void;
}

export function PartnerSidebar({ view, onSelect }: PartnerSidebarProps) {
  return (
    <aside className="bg-surface-alt border-hairline flex flex-col gap-1 border-b p-4 lg:w-60 lg:flex-none lg:border-r lg:border-b-0 lg:px-4.5 lg:py-6">
      <div className="mb-2 px-2 lg:mb-8">
        <Logo size="sm" />
      </div>

      {/* Horizontal rail on small screens, vertical list from lg up. */}
      <nav
        aria-label="Partner sections"
        className="rail-clean flex gap-1 overflow-x-auto lg:flex-col"
      >
        {PARTNER_VIEWS.map(({ id, label, Icon }) => {
          const active = view === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-none items-center gap-3 rounded-xl px-3 py-2.75 text-sm font-extrabold",
                "transition-colors duration-150",
                active
                  ? "text-primary bg-[rgba(201,163,255,0.15)]"
                  : "text-fg-muted hover:bg-surface-3 hover:text-fg",
              )}
            >
              <Icon />
              {label}
            </button>
          );
        })}
      </nav>

      <SignOutRow />
    </aside>
  );
}

/** Sits at the foot of the rail on desktop, inline on small screens. */
function SignOutRow() {
  const { session, signOut } = usePartnerAuth();
  if (!session) return null;

  return (
    <div className="border-hairline mt-auto hidden border-t pt-4 lg:block">
      <p className="text-fg-subtle mb-2 px-3 text-[11.5px] font-bold">
        {session.restaurantName}
      </p>
      <button
        type="button"
        onClick={signOut}
        className="text-fg-muted hover:bg-surface-3 hover:text-fg flex w-full items-center gap-3 rounded-xl px-3 py-2.75 text-sm font-extrabold transition-colors duration-150"
      >
        🚪 Sign out
      </button>
    </div>
  );
}
