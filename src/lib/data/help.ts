export type HelpCategoryId =
  | "orders"
  | "payments"
  | "account"
  | "restaurants"
  | "riders"
  | "safety";

export interface HelpCategory {
  id: HelpCategoryId;
  label: string;
  /** Tailwind classes for the icon tile. */
  tint: string;
}

export const HELP_CATEGORIES: HelpCategory[] = [
  { id: "orders", label: "Orders & delivery", tint: "bg-[rgba(201,163,255,0.15)] text-primary" },
  { id: "payments", label: "Payments & refunds", tint: "bg-[rgba(247,200,115,0.15)] text-accent" },
  { id: "account", label: "Account & profile", tint: "bg-[rgba(74,222,128,0.15)] text-success" },
  { id: "restaurants", label: "Restaurant partners", tint: "bg-[rgba(201,163,255,0.15)] text-primary" },
  { id: "riders", label: "Become a rider", tint: "bg-[rgba(247,200,115,0.15)] text-accent" },
  { id: "safety", label: "Safety & trust", tint: "bg-[rgba(74,222,128,0.15)] text-success" },
];

export interface HelpArticle {
  category: HelpCategoryId;
  question: string;
  answer: string;
}

export const HELP_ARTICLES: HelpArticle[] = [
  {
    category: "orders",
    question: "How do I track my order?",
    answer:
      "Once your order is confirmed, tap 'Track order' from your Order History or the confirmation screen to see your rider's live location and estimated arrival time.",
  },
  {
    category: "orders",
    question: "My order arrived late — can I get a discount?",
    answer:
      "If your order arrives significantly later than the estimated time, you may be eligible for a delivery fee refund or a coupon. Contact support with your order number.",
  },
  {
    category: "orders",
    question: "Can I change my delivery address after ordering?",
    answer:
      "You can update your address within a few minutes of placing the order, before the restaurant starts preparing it. Contact support immediately if you need to change it.",
  },
  {
    category: "payments",
    question: "What payment methods are accepted?",
    answer:
      "We accept debit/credit cards, bank transfer, and Grub Box wallet top-ups. Cash on delivery is available in select areas.",
  },
  {
    category: "payments",
    question: "How do refunds work?",
    answer:
      "Refunds for cancelled or incorrect orders are processed to your original payment method within 3-5 business days, or instantly to your Grub Box wallet.",
  },
  {
    category: "account",
    question: "How do I reset my password?",
    answer:
      "Go to Sign in, tap 'Forgot?' next to the password field, and follow the link sent to your email.",
  },
  {
    category: "account",
    question: "How do I delete my account?",
    answer:
      "Email support@grubbox.ng from your registered email address to request account deletion. We'll confirm within 48 hours.",
  },
  {
    category: "restaurants",
    question: "How do I list my restaurant on Grub Box?",
    answer:
      "Visit the 'For restaurants' page and submit your details. Our partnerships team will reach out within 2 business days to onboard your menu.",
  },
  {
    category: "riders",
    question: "What do I need to become a rider?",
    answer:
      "A valid ID, a working phone, and a bike, motorcycle, or car depending on your city. Apply from the 'Become a rider' page to start the verification process.",
  },
  {
    category: "safety",
    question: "Is my payment information secure?",
    answer:
      "Yes. All payments are processed through PCI-compliant partners and we never store your full card details on our servers.",
  },
];

export const SUPPORT_HOURS = "Our support team is available every day, 7am – 11pm.";
export const SUPPORT_PHONE = "+2348001234567";
export const SUPPORT_EMAIL = "support@grubbox.ng";
