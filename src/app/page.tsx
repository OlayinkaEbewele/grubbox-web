import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { HeroSearch } from "@/components/marketing/HeroSearch";
import { AppStoreButtons } from "@/components/marketing/AppStoreButtons";
import { LocationButton } from "@/components/LocationButton";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ClockIcon, ScooterIcon, StorefrontIcon } from "@/components/icons";
import { restaurantRepository } from "@/lib/data";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1800&q=80&auto=format&fit=crop";

export default async function LandingPage() {
  const restaurants = await restaurantRepository.list();
  const featured = restaurants.slice(0, 5);

  return (
    <>
      <SiteHeader showSearch={false} />

      {/* Hero ------------------------------------------------------------- */}
      <section className="relative flex min-h-[640px] flex-1 items-center overflow-hidden py-section">
        <div className="absolute inset-0 z-0">
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(23,23,27,0.94)_0%,rgba(23,23,27,0.78)_38%,rgba(23,23,27,0.3)_65%,rgba(23,23,27,0)_85%)]" />
        </div>

        <div className="shell max-w-page relative z-10">
          <div className="mr-auto w-full max-w-[640px]">
            <h1 className="font-display mb-5.5 text-[clamp(2.25rem,6vw,3.625rem)] leading-[1.08] text-white">
              Your favorite food,
              <br />
              delivered with a smile.
            </h1>
            <p className="text-fg-muted mb-8 max-w-[460px] text-lg leading-relaxed">
              From jollof rice to shawarma, order from the best local spots near
              you and get it delivered hot, fast, and fresh.
            </p>

            <LocationButton variant="underline" className="mb-3.5" />

            <HeroSearch />
          </div>
        </div>
      </section>

      {/* Popular near you -------------------------------------------------- */}
      <section className="shell max-w-page pt-section">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-fg mb-2 text-4xl">Popular near you</h2>
            <p className="text-fg-subtle text-base">
              Loved by customers across Lagos &amp; Abuja
            </p>
          </div>
          <Link
            href="/browse"
            className="text-primary hover:text-primary-light text-sm font-extrabold transition-colors"
          >
            Browse food →
          </Link>
        </div>

        <div className="rail flex gap-6 overflow-x-auto p-1 pb-5">
          {featured.map((restaurant) => (
            <Link
              key={restaurant.slug}
              href={`/restaurants/${restaurant.slug}`}
              className="lift border-hairline bg-surface block w-[280px] flex-none overflow-hidden rounded-3xl border-2 shadow-[0_10px_24px_-16px_rgba(0,0,0,0.6)] hover:shadow-[0_24px_40px_-20px_rgba(0,0,0,0.7)]"
            >
              <div className="relative h-[170px]">
                <Image
                  src={restaurant.image}
                  alt=""
                  fill
                  sizes="280px"
                  className="object-cover"
                />
                <span className="text-canvas absolute top-3 right-3 rounded-full bg-white/95 px-2.5 py-1.5 text-xs font-extrabold">
                  ★ {restaurant.rating}
                </span>
              </div>
              <div className="px-4.5 pt-4 pb-5">
                <h3 className="text-fg mb-1 text-base font-extrabold">
                  {restaurant.name}
                </h3>
                <p className="text-fg-subtle mb-3 text-[13px]">{restaurant.cuisine}</p>
                <span className="bg-surface-3 text-fg-muted inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold">
                  <ClockIcon className="text-primary" />
                  {restaurant.deliveryTime}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Partner CTAs ------------------------------------------------------ */}
      <section className="shell max-w-page pt-section">
        <div className="mb-8 text-center">
          <h2 className="font-display text-fg mb-2 text-4xl">Become a partner</h2>
          <p className="text-fg-subtle text-base">
            Grow your business or earn on your own schedule
          </p>
        </div>

        <div className="grid gap-7 md:grid-cols-2">
          <div className="bg-surface-alt flex flex-col rounded-[32px] border-[3px] border-[var(--color-fg)] p-10 shadow-[0_8px_0_var(--color-fg)]">
            <span className="bg-primary text-canvas mb-6 flex size-14 items-center justify-center rounded-2xl">
              <StorefrontIcon />
            </span>
            <h3 className="font-display text-fg mb-3 text-2xl">
              Grow your restaurant
            </h3>
            <p className="text-fg-muted mb-7 flex-1 text-[15px] leading-relaxed">
              List your menu on Grub Box and reach thousands of hungry customers
              across Lagos &amp; Abuja every day.
            </p>
            <ButtonLink href="/partner" variant="dark" className="self-start">
              Partner with us
            </ButtonLink>
          </div>

          <div className="bg-surface-2 flex flex-col rounded-[32px] border-[3px] border-[var(--color-fg)] p-10 shadow-[0_8px_0_var(--color-primary-deep)]">
            <span className="bg-accent text-canvas mb-6 flex size-14 items-center justify-center rounded-2xl">
              <ScooterIcon />
            </span>
            <h3 className="font-display mb-3 text-2xl text-white">Become a rider</h3>
            <p className="text-fg-muted mb-7 flex-1 text-[15px] leading-relaxed">
              Ride on your own schedule and get paid weekly. All you need is a bike
              and a smile.
            </p>
            <ButtonLink href="/rider" className="self-start">
              Start riding
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* App download ------------------------------------------------------ */}
      <section className="shell max-w-page pt-section pb-page-bottom">
        <div className="bg-surface-alt relative flex flex-wrap items-center justify-between gap-12 overflow-hidden rounded-[40px] p-16">
          <div
            aria-hidden="true"
            className="bg-accent absolute -top-20 -right-15 size-75 rounded-full opacity-50"
          />

          <div className="relative z-10 min-w-[280px] flex-1">
            <h2 className="font-display text-fg mb-4 text-[38px] leading-tight">
              Get the Grub Box app
            </h2>
            <p className="text-fg-muted mb-8 max-w-[420px] text-base leading-relaxed">
              Order faster, track your rider live, and get exclusive app-only deals.
            </p>
            <AppStoreButtons />
          </div>

          <div className="relative z-10 flex-none">
            <div className="bg-surface-2 h-[440px] w-[220px] rounded-[36px] p-3 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.6)]">
              <div className="relative h-full w-full overflow-hidden rounded-3xl">
                <Image
                  src={featured[0].image}
                  alt="The Grub Box app showing a restaurant menu"
                  fill
                  sizes="196px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
