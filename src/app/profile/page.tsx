import { SiteHeader } from "@/components/layout/SiteHeader";
import { AppFooter } from "@/components/layout/SiteFooter";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProfileView } from "@/components/profile/ProfileView";

export const metadata = {
  title: "Your profile · Grub Box",
};

export default function ProfilePage() {
  return (
    <>
      <SiteHeader variant="app" />

      <main className="mx-auto w-full max-w-[900px] flex-1 px-6 pt-2 pb-24 lg:px-14">
        <Breadcrumbs
          trail={[{ label: "Home", href: "/" }, { label: "Your profile" }]}
        />

        <ProfileView />
      </main>

      <AppFooter />
    </>
  );
}
