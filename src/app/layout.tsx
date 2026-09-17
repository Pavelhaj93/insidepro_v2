import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { HeaderWrapper } from "@/components/layout/HeaderWrapper";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { VerticalSidebar } from "@/components/home/VerticalSidebar";
import { HomeCtaFooter } from "@/components/home/HomeCtaFooter";
import { client } from "@/sanity/lib/client";
import { footerQuery, settingsQuery } from "@/sanity/lib/queries";
import { SanityLive } from "@/sanity/lib/live";
import { VisualEditing } from "next-sanity/visual-editing";
import { CustomCursor } from "@/components/motion/CustomCursor";
import "./globals.css";

export const metadata: Metadata = {
  title: "insidePRO — Film. Brand. Emotion.",
  description:
    "Kreativní a marketingová produkce s více než 18 lety zkušeností.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDraftMode = (await draftMode()).isEnabled;
  const [settings, footer] = await Promise.all([
    client.fetch(settingsQuery),
    client.fetch(footerQuery),
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
          {/* <HeaderWrapper /> */}
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
      </body>
    </html>
  );
}
