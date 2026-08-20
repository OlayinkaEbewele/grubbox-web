"use client";

import { Button } from "@/components/ui/Button";
import { EmptyState, type EmptyStateVariant } from "@/components/ui/EmptyState";
import { useAuth } from "@/lib/auth";

interface SignInPromptProps {
  variant?: EmptyStateVariant;
  title: string;
  description: string;
}

/**
 * What a signed-out visitor sees where their own data would be. Both buttons
 * open the same dialog — one on each tab — so the choice between signing in
 * and signing up doesn't cost a page load.
 */
export function SignInPrompt({
  variant = "orders",
  title,
  description,
}: SignInPromptProps) {
  const { openAuth } = useAuth();

  return (
    <EmptyState
      variant={variant}
      title={title}
      description={description}
      action={
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={() => openAuth("login")}>Sign in</Button>
          <Button variant="outline" onClick={() => openAuth("signup")}>
            Create account
          </Button>
        </div>
      }
    />
  );
}
