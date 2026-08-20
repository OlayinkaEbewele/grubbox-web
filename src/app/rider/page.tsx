import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AppFooter } from "@/components/layout/SiteFooter";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { AppStoreButtons } from "@/components/marketing/AppStoreButtons";
import { RiderAppScreens } from "@/components/rider/RiderAppScreens";
import {
  AlertIcon,
  BoxIcon,
  CardIcon,
  ChartIcon,
  ClockIcon,
  PinIcon,
} from "@/components/icons";

export const metadata = {
  title: "Become a Grub Box rider",
  description:
    "Download the Grub Box Rider app to deliver across Lagos & Abuja, pick your own hours, and get paid every week.",
};

const RIDER_IMAGE =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&auto=format&fit=crop";

const FEATURES = [
  {
    title: "The payout, up front",
    body: "Every offer shows the distance, the pickup, and exactly what you'll earn — before you accept it.",
    tint: "bg-[rgba(201,163,255,0.15)] text-primary",
    icon: <CardIcon size={22} />,
  },
  {
    title: "Navigation built in",
    body: "Turn-by-turn directions to the kitchen and on to the customer, without switching apps mid-trip.",
    tint: "bg-[rgba(247,200,115,0.15)] text-accent",
    icon: <PinIcon size={22} />,
  },
  {
    title: "Earnings you can watch",
    body: "Every trip, tip, and bonus itemised, updated the moment you hand an order over.",
    tint: "bg-[rgba(74,222,128,0.15)] text-success",
    icon: <ChartIcon size={22} />,
  },
  {
    title: "Stacked pickups",
    body: "Take two nearby orders on one run when it makes sense, and earn more per kilometre.",
    tint: "bg-[rgba(201,163,255,0.15)] text-primary",
    icon: <BoxIcon size={22} />,
  },
  {
    title: "Go online, go offline",
    body: "No shifts and no minimum hours. One tap when you start, one tap when you're done.",
    tint: "bg-[rgba(247,200,115,0.15)] text-accent",
    icon: <ClockIcon size={22} />,
  },
  {
    title: "Help in two taps",
    body: "Live support from inside the app on every trip, plus accident cover while an order is with you.",
    tint: "bg-[rgba(74,222,128,0.15)] text-success",
    icon: <AlertIcon size={22} />,
  },
];

const STEPS = [
  {
    title: "Download the app",
    body: "Grab Grub Box Rider free on iOS or Android — it's a separate app from the one customers order in.",
  },
  {
    title: "Get verified",
    body: "Upload your ID and licence in the app. We usually approve inside two business days.",
  },
  {
    title: "Start earning",
    body: "Go online, take your first delivery, and get paid that same week.",
  },
];

export default function RiderLandingPage() {
  return (
    <>
      <SiteHeader showSearch={false} />

      <div className="shell max-w-page pt-page-top">
        <Breadcrumbs
          trail={[{ label: "Home", href: "/" }, { label: "Become a rider" }]}
        />
      </div>

      {/* Hero --------------------------------------------------------------- */}
      <section className="shell max-w-page pt-8 pb-section">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="text-primary mb-5 inline-flex items-center gap-2 rounded-full bg-[rgba(201,163,255,0.15)] px-4 py-2 text-[13px] font-extrabold">
            For riders
          </p>
          <h1 className="font-display mb-5 text-[clamp(2.25rem,5vw,3.25rem)] leading-[1.1]">
            Ride on your own schedule
          </h1>
          <p className="text-fg-subtle mx-auto mb-8 max-w-[520px] text-[17px] leading-relaxed">
            Deliver for Grub Box across Lagos &amp; Abuja, pick your own hours, and
            get paid every week. Everything happens in the Grub Box Rider app —
            download it to sign up.
          </p>
          <AppStoreButtons className="justify-center" />
          <p className="text-fg-subtle mt-4 text-[13px]">
            Free on iOS and Android · Sign up takes about 5 minutes
          </p>
        </div>
      </section>

      {/* Splash screens ----------------------------------------------------- */}
      <section className="shell max-w-page pb-section">
        <div className="mb-10 text-center">
          <h2 className="font-display text-fg mb-2 text-[32px]">
            Your whole shift, in one app
          </h2>
          <p className="text-fg-subtle text-base">
            From the first offer to Friday&rsquo;s payout
          </p>
        </div>

        <RiderAppScreens />
      </section>

      {/* Feature cards ------------------------------------------------------ */}
      <section className="shell max-w-page pb-section">
        <div className="mb-10 text-center">
          <h2 className="font-display text-fg mb-2 text-[32px]">
            Built around the ride
          </h2>
          <p className="text-fg-subtle text-base">
            The things you need on the road, and nothing you don&rsquo;t
          </p>
        </div>

        <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {FEATURES.map((feature) => (
            <li
              key={feature.title}
              className="bg-surface-alt border-hairline rounded-3xl border-2 p-8"
            >
              <span
                className={`mb-5 flex size-12 items-center justify-center rounded-[14px] ${feature.tint}`}
              >
                {feature.icon}
              </span>
              <h3 className="mb-2.5 text-lg font-extrabold">{feature.title}</h3>
              <p className="text-fg-subtle text-[14.5px] leading-relaxed">
                {feature.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Steps -------------------------------------------------------------- */}
      <section id="how" className="shell max-w-page scroll-mt-8 pb-section">
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

      {/* Testimonial -------------------------------------------------------- */}
      <section className="shell max-w-page pb-section">
        <figure className="bg-surface-alt border-hairline mx-auto flex max-w-[760px] flex-wrap items-center gap-7 rounded-[28px] border-2 px-12 py-10">
          <div className="relative size-14 flex-none overflow-hidden rounded-full">
            <Image
              src={RIDER_IMAGE}
              alt=""
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
          <div className="min-w-60 flex-1">
            <blockquote className="text-fg mb-3 text-base leading-relaxed italic">
              &ldquo;I ride mornings before lectures and still cover my rent every
              month. The app says exactly where to go, and the money lands every
              Friday.&rdquo;
            </blockquote>
            <figcaption>
              <span className="block text-sm font-extrabold">Emeka Nwosu</span>
              <span className="text-fg-subtle block text-[13px]">
                Rider, Lagos — 2 years with Grub Box
              </span>
            </figcaption>
          </div>
        </figure>
      </section>

      {/* Download CTA -------------------------------------------------------- */}
      <section className="shell max-w-page pb-page-bottom">
        <div className="bg-primary text-canvas mx-auto flex max-w-[760px] flex-col items-center rounded-[28px] p-12 text-center">
          <h2 className="font-display mb-3.5 text-[30px]">Ready to hit the road?</h2>
          <p className="mb-7 max-w-[420px] text-[15px] opacity-85">
            Download Grub Box Rider and sign up in the app. Hundreds of riders
            already deliver with us.
          </p>
          <AppStoreButtons className="justify-center" />
          <Link
            href="/help"
            className="text-canvas mt-6 text-[13.5px] font-bold underline decoration-[var(--color-canvas)]/40 underline-offset-4 transition-opacity hover:decoration-[var(--color-canvas)]"
          >
            Questions? Visit the help center
          </Link>
        </div>
      </section>

      <AppFooter />
    </>
  );
}
