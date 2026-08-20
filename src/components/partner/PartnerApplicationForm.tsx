"use client";

import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Field, SelectField } from "@/components/ui/Field";
import { CheckIcon } from "@/components/icons";

const CITIES = ["Lagos", "Abuja", "Port Harcourt"];

export function PartnerApplicationForm() {
  const [restaurantName, setRestaurantName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="mx-auto flex w-full max-w-focus flex-1 flex-col items-center justify-center px-6 py-section text-center">
        <span className="pop-in text-success mb-6 flex size-22 items-center justify-center rounded-full bg-[rgba(74,222,128,0.15)]">
          <CheckIcon size={40} />
        </span>
        <h1 className="font-display mb-3 text-[28px]">Application received!</h1>
        <p className="text-fg-subtle mb-7 text-[15px] leading-relaxed">
          Thanks, {ownerName}. Our partnerships team will review{" "}
          {restaurantName} and reach out within 2 business days.
        </p>
        <ButtonLink href="/partner/dashboard" size="lg">
          Go to dashboard
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="w-full max-w-focus px-6 pt-4 pb-page-bottom">
      <h1 className="font-display mb-2 text-[32px]">
        Apply to become a partner
      </h1>
      <p className="text-fg-subtle mb-8 text-[15px]">
        Tell us about your restaurant — takes less than 5 minutes.
      </p>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
        className="flex flex-col gap-4.5"
      >
        <Field
          label="Restaurant name"
          name="restaurantName"
          required
          placeholder="Mama Cass Kitchen"
          value={restaurantName}
          onChange={(event) => setRestaurantName(event.target.value)}
        />

        <Field
          label="Owner / contact name"
          name="ownerName"
          required
          placeholder="Adaeze Okafor"
          value={ownerName}
          onChange={(event) => setOwnerName(event.target.value)}
        />

        <div className="flex flex-wrap gap-3.5">
          <Field
            label="Phone number"
            name="phone"
            type="tel"
            required
            placeholder="080 1234 5678"
            className="min-w-50 flex-1"
          />
          <Field
            label="Email"
            name="email"
            type="email"
            required
            placeholder="you@email.com"
            className="min-w-50 flex-1"
          />
        </div>

        <SelectField
          label="City"
          name="city"
          required
          defaultValue={CITIES[0]}
          options={CITIES}
        />

        <Field
          label="Cuisine type"
          name="cuisine"
          placeholder="e.g. Nigerian, Grills, Pizza"
        />

        <Button type="submit" size="lg" className="mt-1.5 w-full">
          Submit application
        </Button>

        <p className="text-fg-subtle text-center text-[12.5px]">
          We&rsquo;ll ask for your business documents during onboarding.
        </p>
      </form>
    </div>
  );
}
