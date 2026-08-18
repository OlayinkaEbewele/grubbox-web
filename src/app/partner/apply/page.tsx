import { SiteHeader } from "@/components/layout/SiteHeader";
import { AppFooter } from "@/components/layout/SiteFooter";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PartnerApplicationForm } from "@/components/partner/PartnerApplicationForm";

export const metadata = {
  title: "Apply to become a partner · Grub Box",
};

export default function PartnerSignupPage() {
  return (
    <>
      <SiteHeader showSearch={false} />

      <div className="mx-auto w-full max-w-[560px] px-6 pt-4">
        <Breadcrumbs
          trail={[
            { label: "Home", href: "/" },
            { label: "For restaurants", href: "/partner" },
            { label: "Apply" },
          ]}
        />
      </div>

      <main className="flex w-full flex-1 flex-col items-center">
        <PartnerApplicationForm />
      </main>

      <AppFooter />
    </>
  );
}
