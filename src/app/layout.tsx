import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { VerticalSidebar } from "@/components/home/VerticalSidebar";
import { HomeCtaFooter } from "@/components/home/HomeCtaFooter";
import { footerQuery, settingsQuery } from "@/sanity/lib/queries";
import type { ComponentProps } from "react";
import { SanityLive, fetchSanity } from "@/sanity/lib/live";
import { VisualEditing } from "next-sanity/visual-editing";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "insidePRO — Film. Brand. Emotion.",
  description:
    "Kreativní a marketingová produkce s více než 18 lety zkušeností.",
};

type FooterProps = ComponentProps<typeof HomeCtaFooter>;
type SettingsData = {
  socialLinks?: ComponentProps<typeof VerticalSidebar>["socialLinks"];
  logo?: ComponentProps<typeof VerticalSidebar>["logo"];
  logoText?: FooterProps["logoText"];
} | null;
type FooterData = Pick<
  FooterProps,
  "headingLine1" | "headingLine2" | "email" | "phone" | "copyrightText" | "legalText"
> | null;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDraftMode = (await draftMode()).isEnabled;
  const [settings, footer] = await Promise.all([
    fetchSanity<SettingsData>({ query: settingsQuery }),
    fetchSanity<FooterData>({ query: footerQuery }),
  ]);

  return (
    <html
      lang="cs"
      className="h-full antialiased"
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col bg-brand-black text-brand-light">
        <div className="grain-overlay" aria-hidden="true" />
        <SmoothScrollProvider>
          <VerticalSidebar
            socialLinks={settings?.socialLinks ?? null}
            logo={settings?.logo ?? null}
          />
          <div className="flex-1">{children}</div>
          <HomeCtaFooter
            logo={settings?.logo ?? null}
            logoText={settings?.logoText}
            headingLine1={footer?.headingLine1}
            headingLine2={footer?.headingLine2}
            email={footer?.email}
            phone={footer?.phone}
            socialLinks={settings?.socialLinks ?? null}
            copyrightText={footer?.copyrightText}
            legalText={footer?.legalText}
          />
        </SmoothScrollProvider>
        <SanityLive />
        {isDraftMode && <VisualEditing />}
        <CustomCursor />
        <Analytics />
      </body>
    </html>
  );
}
