"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { StorefrontIcon } from "@/components/icons";
import { usePartnerAuth } from "@/lib/partner";

export function PartnerSignInForm() {
  const router = useRouter();
  const { signIn } = usePartnerAuth();
  const [email, setEmail] = useState("");

  return (
    <div className="bg-surface border-hairline w-full max-w-[420px] rounded-[28px] border-2 p-9">
      <span className="bg-primary text-canvas mb-6 flex size-12 items-center justify-center rounded-2xl">
        <StorefrontIcon size={24} />
      </span>

      <h1 className="font-display mb-1.5 text-[26px]">Partner sign in</h1>
      <p className="text-fg-subtle mb-6 text-sm leading-relaxed">
        Sign in to your kitchen dashboard to manage orders, menu, and payouts.
      </p>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          signIn(email);
          router.push("/partner/dashboard");
        }}
        className="flex flex-col gap-4"
      >
        <Field
          label="Work email"
          name="email"
          type="email"
          required
          placeholder="kitchen@restaurant.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <label className="block">
          <span className="text-fg-muted mb-1.5 block text-[13px] font-bold">
            Password
          </span>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            required
            autoComplete="current-password"
            className="border-hairline bg-surface-3 text-fg placeholder:text-fg-subtle focus:border-primary w-full rounded-[14px] border-2 px-4 py-3.25 text-sm outline-none transition-colors duration-150"
          />
        </label>

        <Button type="submit" size="lg" className="mt-1.5 w-full">
          Sign in to dashboard
        </Button>
      </form>

      <p className="text-fg-subtle mt-6 text-center text-[12.5px] leading-relaxed">
        Demo sign-in: any details open the {""}
        <span className="text-fg-muted font-semibold">Bukka Hut</span> kitchen.
        Nothing is checked or sent anywhere.
      </p>

      <p className="text-fg-subtle mt-4 text-center text-[13px]">
        Not a partner yet?{" "}
        <Link href="/partner/apply" className="text-primary font-bold">
          Apply to join
        </Link>
      </p>
    </div>
  );
}
