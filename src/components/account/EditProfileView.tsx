"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AccountScreen, AccountForm } from "@/components/account/AccountScreen";
import { Avatar } from "@/components/account/Avatar";
import { Field } from "@/components/ui/Field";
import { useAuth } from "@/lib/auth";
import { AVATAR_PRESETS } from "@/lib/data/profile";
import { cn } from "@/lib/cn";

const CRUMBS = [
  { label: "Home", href: "/" },
  { label: "Your profile", href: "/profile" },
  { label: "Edit profile" },
];

export function EditProfileView() {
  const router = useRouter();
  const { session, updateProfile } = useAuth();

  const [name, setName] = useState(session?.name ?? "");
  const [email, setEmail] = useState(session?.email ?? "");
  const [phone, setPhone] = useState(session?.phone ?? "");
  const [avatar, setAvatar] = useState<string | null>(session?.avatar ?? null);

  // Preview the initial that would be derived from whatever is typed now,
  // rather than the one saved last time.
  const previewInitial = name.trim().charAt(0).toUpperCase() || "G";

  return (
    <AccountScreen
      title="Edit profile"
      description="Your name and picture are shown to riders when they deliver your order."
      crumbs={CRUMBS}
    >
      <AccountForm
        submitLabel="Save changes"
        onSubmit={(event) => {
          event.preventDefault();
          updateProfile({ name, email, phone, avatar });
          router.push("/profile");
        }}
      >
        {/* Picture ------------------------------------------------------- */}
        <fieldset>
          <legend className="text-fg-muted mb-3 text-[13px] font-bold">
            Profile picture
          </legend>

          <div className="mb-4 flex items-center gap-4">
            <Avatar
              avatar={avatar}
              initial={previewInitial}
              className="size-16 flex-none"
              textClassName="text-[26px]"
            />
            <p className="text-fg-subtle text-[12.5px] leading-relaxed">
              Pick one of these for now — photo uploads arrive with the rest of
              the account backend.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Using your initial is a real choice, so it's the first option. */}
            <button
              type="button"
              onClick={() => setAvatar(null)}
              aria-pressed={avatar === null}
              aria-label="Use your initial"
              className={cn(
                "flex size-11 items-center justify-center rounded-full border-2 transition-colors duration-150",
                avatar === null
                  ? "border-primary"
                  : "border-transparent hover:border-hairline",
              )}
            >
              <Avatar
                avatar={null}
                initial={previewInitial}
                className="size-9"
                textClassName="text-[15px]"
              />
            </button>

            {AVATAR_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAvatar(preset)}
                aria-pressed={avatar === preset}
                aria-label={`Use ${preset} as your picture`}
                className={cn(
                  "bg-surface-3 flex size-11 items-center justify-center rounded-full border-2 text-lg transition-colors duration-150",
                  avatar === preset
                    ? "border-primary"
                    : "border-transparent hover:border-hairline",
                )}
              >
                {preset}
              </button>
            ))}
          </div>
        </fieldset>

        <Field
          label="Full name"
          name="name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Field
          label="Phone number"
          name="phone"
          type="tel"
          required
          placeholder="080 1234 5678"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
      </AccountForm>
    </AccountScreen>
  );
}
