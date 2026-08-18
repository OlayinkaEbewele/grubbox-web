import Image from "next/image";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AppFooter } from "@/components/layout/SiteFooter";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { ScooterIcon } from "@/components/icons";

export const metadata = {
  title: "Grow your restaurant with Grub Box",
  description:
    "Put your kitchen in front of thousands of customers across Lagos & Abuja, with our delivery fleet and real-time tools.",
};

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=80&auto=format&fit=crop";
const OWNER_IMAGE =
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80&auto=format&fit=crop";

const BENEFITS = [
  {
    title: "Our own delivery fleet",
    body: "No need to hire or manage riders — our fleet picks up and delivers every order for you.",
    tint: "bg-[rgba(201,163,255,0.15)] text-primary",
    icon: <ScooterIcon size={24} />,
  },
  {
    title: "Real-time order & inventory tools",
    body: "Track incoming orders, update your menu, and manage stock the moment things change.",
    tint: "bg-[rgba(247,200,115,0.15)] text-accent",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 20V10M10 20V4M16 20v-7M4 10l6-6 6 6 4-4"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Free onboarding support",
    body: "A dedicated partner specialist sets up your menu and photos with you, at no cost.",
    tint: "bg-[rgba(74,222,128,0.15)] text-success",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M21 11.5a8.4 8.4 0 0 1-1.2 4.3L21 20l-4.3-1.1a8.5 8.5 0 1 1 4.3-7.4z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const STEPS = [
  {
    title: "Apply online",
    body: "Tell us about your restaurant — takes less than 5 minutes.",
  },
  {
    title: "Get onboarded",
    body: "Our team helps set up your menu, photos, and pricing for free.",
  },
  {
    title: "Start receiving orders",
    body: "Go live and start growing with customers across your city.",
  },
];

export default function PartnerLandingPage() {
  return (
    <>
      <SiteHeader showSearch={false} />

      <div className="shell max-w-page pt-page-top">
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "For restaurants" }]} />
      </div>

      <section className="shell max-w-page flex flex-wrap items-center gap-14 pt-8 pb-section">
        <div className="min-w-[340px] flex-1">
          <p className="text-primary mb-5 inline-flex items-center gap-2 rounded-full bg-[rgba(201,163,255,0.15)] px-4 py-2 text-[13px] font-extrabold">
            For restaurant owners
          </p>
          <h1 className="font-display mb-5 text-[clamp(2.25rem,5vw,3.25rem)] leading-[1.1]">
            Grow your restaurant with Grub Box
          </h1>
          <p className="text-fg-subtle mb-8 max-w-[480px] text-[17px] leading-relaxed">
            Put your kitchen in front of thousands of hungry customers across Lagos
            &amp; Abuja — with our delivery fleet, real-time tools, and a team that
            helps you every step of the way.
          </p>
          <div className="flex flex-wrap gap-3.5">
            <ButtonLink href="/partner/apply" size="lg">
              Apply now
            </ButtonLink>
            <ButtonLink href="#how" variant="outline" size="lg">
              See how it works
            </ButtonLink>
          </div>
        </div>

        <div className="relative h-95 min-w-80 flex-1 overflow-hidden rounded-[28px] lg:max-w-130">
          <Image
            src={HERO_IMAGE}
            alt="A restaurant owner plating food in their kitchen"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 520px"
            className="object-cover"
          />
        </div>
      </section>

      <section className="shell max-w-page pb-section">
        <ul className="grid gap-6 md:grid-cols-3">
          {BENEFITS.map((benefit) => (
            <li
              key={benefit.title}
              className="bg-surface-alt border-hairline rounded-3xl border-2 p-8"
            >
              <span
                className={`mb-5 flex size-12 items-center justify-center rounded-[14px] ${benefit.tint}`}
              >
                {benefit.icon}
              </span>
              <h2 className="mb-2.5 text-lg font-extrabold">{benefit.title}</h2>
              <p className="text-fg-subtle text-[14.5px] leading-relaxed">
                {benefit.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="how"
        className="shell max-w-page scroll-mt-8 pb-section"
      >
        <h2 className="font-display mb-10 text-center text-[32px]">
          Get started in three steps
        </h2>
        <ol className="grid gap-8 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="text-center">
              <span className="bg-primary text-canvas font-display mx-auto mb-4 flex size-14 items-center justify-center rounded-full text-[22px]">
                {index + 1}
              </span>
              <h3 className="mb-2 text-[17px] font-extrabold">{step.title}</h3>
              <p className="text-fg-subtle text-sm leading-relaxed">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="shell max-w-page pb-section">
        <figure className="bg-surface-alt border-hairline mx-auto flex max-w-[760px] flex-wrap items-center gap-7 rounded-[28px] border-2 px-12 py-10">
          <div className="relative size-14 flex-none overflow-hidden rounded-full">
            <Image
              src={OWNER_IMAGE}
              alt=""
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
          <div className="min-w-60 flex-1">
            <blockquote className="text-fg mb-3 text-base leading-relaxed italic">
              &ldquo;Since joining Grub Box, our orders have tripled and we never
              worry about delivery — their riders handle it all.&rdquo;
            </blockquote>
            <figcaption>
              <span className="block text-sm font-extrabold">Chidinma Eze</span>
              <span className="text-fg-subtle block text-[13px]">
                Owner, Bukka Hut
              </span>
            </figcaption>
          </div>
        </figure>
      </section>

      <section className="shell max-w-page pb-page-bottom text-center">
        <div className="bg-primary text-canvas mx-auto max-w-[760px] rounded-[28px] p-12">
          <h2 className="font-display mb-3.5 text-[30px]">Ready to grow with us?</h2>
          <p className="mb-6 text-[15px] opacity-85">
            Join hundreds of restaurants already delivering with Grub Box.
          </p>
          <ButtonLink
            href="/partner/apply"
            size="lg"
            className="bg-canvas text-fg shadow-none hover:shadow-none active:shadow-none"
          >
            Apply now
          </ButtonLink>
        </div>
      </section>

      <AppFooter />
    </>
  );
}
