import type { Metadata } from "next";
import { DM_Serif_Display, Plus_Jakarta_Sans } from "next/font/google";
import { AuthProvider } from "@/lib/auth";
import { AuthDialogHost } from "@/components/auth/AuthDialog";
import { CartProvider } from "@/lib/cart";
import { LocationProvider } from "@/lib/location";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Grub Box — Your favorite food, delivered with a smile",
  description:
    "Order from the best local restaurants across Lagos & Abuja and get it delivered hot, fast, and fresh.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${dmSerif.variable} h-full antialiased`}
    >
      <body className="bg-canvas text-fg flex min-h-full flex-col">
        <AuthProvider>
          <LocationProvider>
            <CartProvider>{children}</CartProvider>
          </LocationProvider>
          {/* Mounted once so any page can summon it via `openAuth()`. */}
          <AuthDialogHost />
        </AuthProvider>
      </body>
    </html>
  );
}
