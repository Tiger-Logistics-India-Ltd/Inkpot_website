import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coffee Pre-Order — Songs of the Stone | Inkpot India",
  description:
    "Pre-order your coffee for Songs of the Stone, Chapter Three — Amrita Kaur, From Dusk to Dawn, at Purana Qila, New Delhi. Order online, collect at the counter.",
  robots: { index: true, follow: true },
};

export default function SOTSCoffeeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
