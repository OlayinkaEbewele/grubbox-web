import { SiteHeader } from "@/components/layout/SiteHeader";
import { AuthCard } from "@/components/auth/AuthCard";
import { FoodPattern } from "@/components/marketing/FoodPattern";

export const metadata = {
  title: "Sign in · Grub Box",
};

export default function SignInPage() {
  return (
    <>
      <SiteHeader />

      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-12">
        <div className="absolute inset-0 z-0">
          <FoodPattern className="h-full w-full" />
        </div>

        <AuthCard />
      </main>
    </>
  );
}
