import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Scroll Effects POC — insidePRO",
  description: "Local-only playground for scroll-driven section prototypes. Not linked from the live site.",
  robots: { index: false, follow: false },
};

export default function ScrollEffectsPocLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
