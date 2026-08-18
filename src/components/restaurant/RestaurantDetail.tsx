"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CartBar } from "./CartBar";
import { MenuItemRow } from "./MenuItemRow";
import { ClockIcon, HeartIcon } from "@/components/icons";
import { useCart } from "@/lib/cart";
import { formatNaira } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Restaurant } from "@/lib/types";

export function RestaurantDetail({ restaurant }: { restaurant: Restaurant }) {
  const [favourite, setFavourite] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const { add } = useCart();

  // Suppresses the scroll spy while a tab click smooth-scrolls, so passing
  // sections don't fight the tab the user just chose.
  const spySuspended = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (spySuspended.current) return;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = restaurant.menu.findIndex(
            (section) => section.id === entry.target.id,
          );
          if (index !== -1) setActiveSection(index);
        }
      },
      { rootMargin: "-180px 0px -60% 0px", threshold: 0 },
    );

    for (const section of restaurant.menu) {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [restaurant.menu]);

  useEffect(
    () => () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    },
    [],
  );

  function selectSection(index: number) {
    setActiveSection(index);
    spySuspended.current = true;

    const element = document.getElementById(restaurant.menu[index].id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 150;
      window.scrollTo({ top, behavior: "smooth" });
    }

    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      spySuspended.current = false;
    }, 700);
  }

  return (
    <>
      <SiteHeader variant="app" sticky />

      <div className="mx-auto w-full max-w-[1200px] px-6 pt-4 lg:px-14">
        <Breadcrumbs
          trail={[
            { label: "Home", href: "/" },
            { label: "Browse food", href: "/browse" },
            { label: restaurant.name },
          ]}
        />
      </div>

      {/* Cover ------------------------------------------------------------- */}
      <header className="mx-auto w-full max-w-[1200px] px-6 lg:px-14">
        <div className="relative h-[280px] overflow-hidden rounded-[32px] shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)]">
          <Image
            src={restaurant.cover}
            alt=""
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1088px"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_top,rgba(23,23,27,0.9)_0%,rgba(23,23,27,0.1)_60%)]"
          />

          <button
            type="button"
            onClick={() => setFavourite((value) => !value)}
            aria-pressed={favourite}
            aria-label={
              favourite
                ? `Remove ${restaurant.name} from favourites`
                : `Save ${restaurant.name} to favourites`
            }
            className="text-primary absolute top-5 right-5 flex size-10 items-center justify-center rounded-full bg-white/90 transition-transform duration-150 ease-[var(--ease-out-strong)] hover-fine:scale-108 active:scale-95"
          >
            <HeartIcon filled={favourite} />
          </button>

          <div className="absolute right-7 bottom-6 left-7">
            <div className="mb-2.5 flex flex-wrap items-center gap-2.5">
              {restaurant.promo && (
                <span className="bg-primary text-canvas rounded-full px-3 py-1.25 text-[11.5px] font-extrabold">
                  {restaurant.promo}
                </span>
              )}
              <span className="text-canvas rounded-full bg-white/95 px-3 py-1.25 text-[12.5px] font-extrabold">
                ★ {restaurant.rating} ({restaurant.reviewCount})
              </span>
            </div>

            <h1 className="font-display mb-1.5 text-[clamp(1.75rem,5vw,2.625rem)] text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.4)]">
              {restaurant.name}
            </h1>

            <div className="text-fg-muted flex flex-wrap items-center gap-4 text-sm font-semibold">
              <span>{restaurant.cuisine}</span>
              <span className="flex items-center gap-1.5">
                <ClockIcon />
                {restaurant.deliveryTime}
              </span>
              <span>{restaurant.address}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Facts ------------------------------------------------------------- */}
      <div className="mx-auto w-full max-w-[1200px] px-6 pt-5 lg:px-14">
        <dl className="border-hairline bg-surface grid grid-cols-2 gap-y-5 rounded-3xl border-2 px-7 py-5 md:grid-cols-4 md:gap-y-0">
          {[
            {
              label: "Delivery fee",
              value:
                restaurant.deliveryFee === 0
                  ? "Free"
                  : formatNaira(restaurant.deliveryFee),
            },
            { label: "Delivery time", value: restaurant.deliveryTime },
            { label: "Minimum order", value: formatNaira(restaurant.minimumOrder) },
            { label: "Open hours", value: restaurant.openHours },
          ].map((fact, index) => (
            <div
              key={fact.label}
              className={cn(
                "flex flex-col gap-0.5",
                index < 3 && "md:border-hairline md:border-r md:pr-5",
                index > 0 && "md:pl-5",
              )}
            >
              <dt className="text-fg-subtle text-xs font-semibold">{fact.label}</dt>
              <dd className="text-fg text-base font-extrabold">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Category tabs ------------------------------------------------------ */}
      <div
        className={cn(
          "bg-canvas sticky z-20 mx-auto w-full max-w-[1200px] px-6 pt-4 lg:px-14",
          // Sits directly under the sticky header rather than at the viewport top.
          // +1px for the sticky header's bottom hairline.
          "top-[calc(var(--header-h)+1px)]",
        )}
      >
        <div
          role="tablist"
          aria-label="Menu sections"
          className="border-hairline rail-clean flex gap-2.5 overflow-x-auto border-b pb-4"
        >
          {restaurant.menu.map((section, index) => {
            const selected = index === activeSection;
            return (
              <button
                key={section.id}
                role="tab"
                aria-selected={selected}
                aria-controls={section.id}
                onClick={() => selectSection(index)}
                className={cn(
                  "border-hairline flex-none rounded-full border-2 px-5 py-2.25 text-sm font-bold",
                  "transition-[transform,background-color,color] duration-200 ease-[var(--ease-out-strong)]",
                  "hover-fine:-translate-y-0.5 active:translate-y-0",
                  selected
                    ? "bg-primary text-canvas"
                    : "bg-surface text-fg-muted hover:text-fg",
                )}
              >
                {section.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu --------------------------------------------------------------- */}
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 pt-8 pb-35 lg:px-14">
        <section className="mb-10">
          <h2 className="font-display text-fg mb-1.5 text-2xl">
            Frequently ordered together
          </h2>
          <p className="text-fg-subtle mb-4.5 text-[13.5px]">
            Popular add-ons from other customers&rsquo; orders
          </p>

          <ul className="rail flex gap-4 overflow-x-auto pb-2">
            {restaurant.pairings.map((item) => (
              <li
                key={item.id}
                className="border-hairline bg-surface w-40 flex-none overflow-hidden rounded-[20px] border-2"
              >
                <div className="relative h-25">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-fg mb-1.5 text-[13px] leading-snug font-extrabold">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-primary text-[13px] font-extrabold">
                      {formatNaira(item.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() => add(restaurant.slug, item)}
                      aria-label={`Add ${item.name} to cart`}
                      className="bg-surface-3 text-primary size-6.5 rounded-full text-base font-extrabold transition-transform duration-150 ease-[var(--ease-out-strong)] active:scale-90"
                    >
                      +
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col gap-10">
          {restaurant.menu.map((section) => (
            <section
              key={section.id}
              id={section.id}
              aria-label={section.name}
              className="scroll-mt-40"
            >
              <h2 className="font-display text-fg mb-4.5 text-[26px]">
                {section.name}
              </h2>
              <ul className="flex flex-col gap-5">
                {section.items.map((item) => (
                  <MenuItemRow
                    key={item.id}
                    item={item}
                    restaurantSlug={restaurant.slug}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>

      <CartBar />
    </>
  );
}
