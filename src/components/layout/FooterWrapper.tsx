import { client } from "@/sanity/lib/client";
import { footerQuery, settingsQuery } from "@/sanity/lib/queries";
import { Footer } from "./Footer";

export async function FooterWrapper() {
  const [content, settings] = await Promise.all([
    client.fetch(footerQuery),
    client.fetch(settingsQuery),
  ]);

  return (
    <Footer content={content ?? null} socialLinks={settings?.socialLinks ?? null} />
  );
}
