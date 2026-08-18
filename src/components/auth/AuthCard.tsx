"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ChevronLeftIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

type Mode = "login" | "signup" | "forgot";

const COPY: Record<"login" | "signup", { title: string; subtitle: string; cta: string }> = {
  login: {
    title: "Welcome back",
    subtitle: "Sign in to order from your favorite spots.",
    cta: "Sign in",
  },
  signup: {
    title: "Create your account",
    subtitle: "Join Grub Box and start ordering in minutes.",
    cta: "Create account",
  },
};

export function AuthCard() {
  const [mode, setMode] = useState<Mode>("login");
  const [notice, setNotice] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    // No auth provider is connected, and nothing here is stored or sent. Saying
    // so beats faking a session the rest of the app can't honour.
    setNotice(
      "Authentication isn't connected yet — this form doesn't sign you in.",
    );
  }

  if (mode === "forgot") {
    return (
      <Card>
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setNotice(null);
          }}
          className="text-fg-muted hover:text-fg mb-4.5 flex items-center gap-1.5 text-[13px] font-bold transition-colors"
        >
          <ChevronLeftIcon size={14} />
          Back to sign in
        </button>

        <h1 className="font-display mb-2 text-[26px]">Forgot password?</h1>
        <p className="text-fg-subtle mb-6 text-sm leading-relaxed">
          Enter your email and we&rsquo;ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <Field label="Email" name="email" type="email" placeholder="you@email.com" required />
          <Button type="submit" size="lg" className="mt-5 w-full">
            Send reset link
          </Button>
        </form>

        <Notice message={notice} />
      </Card>
    );
  }

  const copy = COPY[mode];
  const isSignup = mode === "signup";

  return (
    <Card>
      <div
        role="tablist"
        aria-label="Account access"
        className="bg-surface-3 mb-6 flex w-full rounded-full p-1.25"
      >
        {(["login", "signup"] as const).map((value) => {
          const selected = mode === value;
          return (
            <button
              key={value}
              role="tab"
              aria-selected={selected}
              onClick={() => {
                setMode(value);
                setNotice(null);
              }}
              className={cn(
                "flex-1 rounded-full py-2.5 text-sm font-extrabold transition-colors duration-200",
                selected ? "bg-primary text-canvas" : "text-fg-muted hover:text-fg",
              )}
            >
              {value === "login" ? "Sign in" : "Sign up"}
            </button>
          );
        })}
      </div>

      <h1 className="font-display mb-1.5 text-[26px]">{copy.title}</h1>
      <p className="text-fg-subtle mb-6 text-sm">{copy.subtitle}</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-5 flex flex-col gap-4">
          {isSignup && (
            <>
              <Field label="Full name" name="name" placeholder="Adaeze Okafor" required />
              <Field
                label="Phone number"
                name="phone"
                type="tel"
                placeholder="080 1234 5678"
                required
              />
            </>
          )}

          <Field label="Email" name="email" type="email" placeholder="you@email.com" required />

          <label className="block">
            <span className="mb-1.5 flex items-center justify-between">
              <span className="text-fg-muted text-[13px] font-bold">Password</span>
              {!isSignup && (
                <button
                  type="button"
                  onClick={() => {
                    setMode("forgot");
                    setNotice(null);
                  }}
                  className="text-primary hover:text-primary-light text-[12.5px] font-bold transition-colors"
                >
                  Forgot?
                </button>
              )}
            </span>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              required
              autoComplete={isSignup ? "new-password" : "current-password"}
              className="border-hairline bg-surface-3 text-fg placeholder:text-fg-subtle focus:border-primary w-full rounded-[14px] border-2 px-4 py-3.25 text-sm outline-none transition-colors duration-150"
            />
          </label>
        </div>

        <Button type="submit" size="lg" className="w-full">
          {copy.cta}
        </Button>
      </form>

      <Notice message={notice} />

      <div className="my-5 flex items-center gap-3">
        <span className="bg-hairline h-px flex-1" />
        <span className="text-fg-subtle text-xs font-semibold">or continue with</span>
        <span className="bg-hairline h-px flex-1" />
      </div>

      <div className="flex gap-3">
        <SocialButton label="Google">
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#EA4335"
              d="M12 10.2v3.9h5.5c-.2 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.2s2.7-6.2 6-6.2c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.3 14.6 2.2 12 2.2 6.9 2.2 2.7 6.4 2.7 12s4.2 9.8 9.3 9.8c5.4 0 9-3.8 9-9.1 0-.6-.1-1.1-.2-1.6z"
            />
          </svg>
        </SocialButton>

        <SocialButton label="Apple">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M16.4 1.6c.1 1.1-.3 2.1-1 2.9-.7.8-1.8 1.4-2.9 1.3-.1-1 .4-2.1 1-2.8.7-.8 1.9-1.4 2.9-1.4zM19.8 17c-.5 1.1-.7 1.6-1.4 2.6-.9 1.4-2.2 3.1-3.8 3.1-1.4 0-1.8-.9-3.7-.9-1.9 0-2.4.9-3.7.9-1.6 0-2.8-1.5-3.7-2.9C1.4 17 .8 12.9 2.4 10.3c.9-1.5 2.4-2.4 4-2.4 1.4 0 2.3 1 3.5 1 1.1 0 1.9-1 3.6-1 1.3 0 2.7.7 3.7 2-3.2 1.7-2.7 6.2 1.6 7.1z" />
          </svg>
        </SocialButton>
      </div>
    </Card>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface border-hairline relative z-10 w-full max-w-[420px] rounded-[28px] border-2 p-9">
      {children}
    </div>
  );
}

function Notice({ message }: { message: string | null }) {
  return (
    <p
      aria-live="polite"
      className={cn(
        "text-accent text-center text-[12.5px] font-semibold",
        message ? "mt-4" : "sr-only",
      )}
    >
      {message ?? ""}
    </p>
  );
}

function SocialButton({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className="bg-surface border-hairline text-fg hover:border-primary flex flex-1 items-center justify-center gap-2 rounded-[14px] border-2 py-3 text-[13.5px] font-bold transition-colors duration-150 active:scale-98"
    >
      {children}
      {label}
    </button>
  );
}

interface FieldProps extends React.ComponentProps<"input"> {
  label: string;
}

function Field({ label, ...props }: FieldProps) {
  return (
    <label className="block">
      <span className="text-fg-muted mb-1.5 block text-[13px] font-bold">{label}</span>
      <input
        type="text"
        className="border-hairline bg-surface-3 text-fg placeholder:text-fg-subtle focus:border-primary w-full rounded-[14px] border-2 px-4 py-3.25 text-sm outline-none transition-colors duration-150"
        {...props}
      />
    </label>
  );
}
