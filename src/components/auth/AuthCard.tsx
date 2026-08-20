"use client";

import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";

/** The `/signin` page's card. The dialog renders the same form in a modal. */
export function AuthCard() {
  const router = useRouter();

  return (
    <div className="bg-surface border-hairline relative z-10 w-full max-w-[420px] rounded-[28px] border-2 p-9">
      <AuthForm headingLevel="h1" onSignedIn={() => router.push("/")} />
    </div>
  );
}
