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

      <main className="shell max-w-narrow flex-1 pt-page-top pb-page-bottom">
        <Breadcrumbs
          trail={[{ label: "Home", href: "/" }, { label: "Your profile" }]}
        />

        <ProfileView />
      </main>

      <AppFooter />
    </>
  );
}
