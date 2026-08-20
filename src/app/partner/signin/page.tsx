import { SiteHeader } from "@/components/layout/SiteHeader";
import { PartnerSignInForm } from "@/components/partner/PartnerSignInForm";
import { FoodPattern } from "@/components/marketing/FoodPattern";

export const metadata = {
  title: "Partner sign in · Grub Box",
};

export default function PartnerSignInPage() {
  return (
    <>
      <SiteHeader showSearch={false} />

      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-section">
        <div className="absolute inset-0 z-0">
          <FoodPattern className="h-full w-full" />
        </div>

        <div className="relative z-10 flex w-full justify-center">
          <PartnerSignInForm />
        </div>
      </main>
    </>
  );
}
