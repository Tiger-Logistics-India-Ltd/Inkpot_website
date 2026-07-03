import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions — Inkpot India",
  description: "The terms and conditions governing use of Inkpot India's website and events.",
  alternates: {
    canonical: "https://www.inkpotindia.com/terms",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
