import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact Form POC — insidePRO",
  description:
    "Local-only playground for original contact-form designs. Not linked from the live site.",
  robots: { index: false, follow: false },
};

export default function ContactFormPocLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
