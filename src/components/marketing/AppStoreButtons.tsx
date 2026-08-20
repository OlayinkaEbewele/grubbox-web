import Link from "next/link";
import { AppleIcon, PlayStoreIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

const STORES = [
  { href: "/app/ios", kicker: "Download on the", name: "App Store", Icon: AppleIcon },
  { href: "/app/android", kicker: "Get it on", name: "Google Play", Icon: PlayStoreIcon },
] as const;

/**
 * The two store badges. Shared because they now appear on the customer landing
 * page and twice on the rider page, where they're the only call to action —
 * riders sign up inside the app, not on the web.
 */
export function AppStoreButtons({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-3.5", className)}>
      {STORES.map(({ href, kicker, name, Icon }) => (
        <Link
          key={name}
          href={href}
          className="press bg-surface-2 flex items-center gap-2.5 rounded-2xl border-2 border-[var(--color-fg)] px-5.5 py-3 text-white shadow-[0_5px_0_#000] hover:shadow-[0_3px_0_#000]"
        >
          <Icon />
          <span>
            <span className="text-fg-subtle block text-[9px] leading-none">
              {kicker}
            </span>
            <span className="block text-[15px] leading-snug font-bold">{name}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
