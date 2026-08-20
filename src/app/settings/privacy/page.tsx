import { SettingsToggleList } from "@/components/account/SettingsToggleList";

export const metadata = { title: "Privacy & security · Grub Box" };

export default function PrivacySettingsPage() {
  return (
    <SettingsToggleList
      title="Privacy & security"
      description="What Grub Box keeps, and what it does with it."
      crumbs={[
        { label: "Home", href: "/" },
        { label: "Your profile", href: "/profile" },
        { label: "Privacy & security" },
      ]}
      groups={[
        {
          heading: "Your data",
          rows: [
            {
              key: "shareActivity",
              label: "Share order activity",
              hint: "Lets restaurants see anonymised ordering patterns to plan their menus.",
            },
            {
              key: "personalisedAds",
              label: "Personalised offers",
              hint: "Use your order history to decide which discounts you're shown.",
            },
            {
              key: "locationHistory",
              label: "Save delivery locations",
              hint: "Remembers recent addresses so you don't retype them. Turning this off clears them.",
            },
          ],
        },
      ]}
    />
  );
}
