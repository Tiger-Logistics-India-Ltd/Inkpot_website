import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Songs of the Stone | Inkpot India",
  description:
    "Songs of the Stone — Inkpot India's series of after-hours cultural evenings at Delhi's heritage monuments. Three chapters at the Qutub Minar and Purana Qila, featuring Mehtab Ali Niazi, Rakesh Chaurasia, and Amrita Kaur.",
  robots: { index: true, follow: true },
};

export default function SongsOfTheStoneLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
