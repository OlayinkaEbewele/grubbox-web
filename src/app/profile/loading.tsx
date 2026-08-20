import { SiteHeader } from "@/components/layout/SiteHeader";
import { AppFooter } from "@/components/layout/SiteFooter";
import { Skeleton } from "@/components/ui/Skeleton";
import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";

export default function Loading() {
  return (
    <>
      <SiteHeader variant="app" showSearch={false} />

      <main className="shell max-w-narrow flex-1 pt-page-top pb-page-bottom">
        <Skeleton className="mb-4 h-3.5 w-40" />
        <ProfileSkeleton />
      </main>

      <AppFooter />
    </>
  );
}
