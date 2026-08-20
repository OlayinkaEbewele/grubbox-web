import { SettingsToggleList } from "@/components/account/SettingsToggleList";

export const metadata = { title: "Notification preferences · Grub Box" };

export default function NotificationSettingsPage() {
  return (
    <SettingsToggleList
      title="Notifications"
      description="Choose what Grub Box tells you about, and how it reaches you."
      crumbs={[
        { label: "Home", href: "/" },
        { label: "Your profile", href: "/profile" },
        { label: "Notifications" },
      ]}
      groups={[
        {
          heading: "Your orders",
          rows: [
            {
              key: "orderUpdates",
              label: "Order updates",
              hint: "Accepted, picked up, and arriving — the ones you probably want on.",
            },
            {
              key: "smsUpdates",
              label: "SMS updates",
              hint: "A text when your rider is close, in case the app is closed.",
            },
            {
              key: "emailReceipts",
              label: "Email receipts",
              hint: "A receipt by email every time an order completes.",
            },
          ],
        },
        {
          heading: "Offers",
          rows: [
            {
              key: "promotions",
              label: "Promotions & discounts",
              hint: "Deals from kitchens you've ordered from before.",
            },
            {
              key: "newRestaurants",
              label: "New restaurants near you",
              hint: "When somewhere new starts delivering to your area.",
            },
          ],
        },
      ]}
    />
  );
}
