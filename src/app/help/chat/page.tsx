import { SiteHeader } from "@/components/layout/SiteHeader";
import { AppFooter } from "@/components/layout/SiteFooter";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ChatView } from "@/components/help/ChatView";

export const metadata = {
  title: "Live chat · Grub Box",
};

export default function HelpChatPage() {
  return (
    <>
      <SiteHeader showSearch={false} />

      <main className="shell max-w-narrow flex-1 pt-page-top pb-page-bottom">
        <Breadcrumbs
          trail={[
            { label: "Home", href: "/" },
            { label: "Help center", href: "/help" },
            { label: "Live chat" },
          ]}
        />

        <h1 className="font-display text-fg mb-2 text-[32px]">Live chat</h1>
        <p className="text-fg-subtle mb-8 text-sm">
          Our support team is online now — average reply time is under a minute.
        </p>

        <ChatView />
      </main>

      <AppFooter />
    </>
  );
}
