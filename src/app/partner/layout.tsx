import { PartnerAuthProvider } from "@/lib/partner";

/**
 * Wraps every partner route so the kitchen session is available to the
 * dashboard and the sign-in screen alike. Kept separate from the customer
 * `AuthProvider` in the root layout — the two sessions are independent.
 */
export default function PartnerLayout({
  children,
}: LayoutProps<"/partner">) {
  return <PartnerAuthProvider>{children}</PartnerAuthProvider>;
}
