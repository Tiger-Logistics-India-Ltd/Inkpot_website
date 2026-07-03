import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Inkpot India",
  description: "How Inkpot India collects, uses, and protects your personal information.",
  alternates: {
    canonical: "https://www.inkpotindia.com/privacy-policy",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
