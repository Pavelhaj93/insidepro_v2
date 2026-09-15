import { SectionRenderer } from "@/components/SectionRenderer";
import { client } from "@/sanity/lib/client";
import { homepageQuery, settingsQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

export default async function HomePage() {
  const [page, settings] = await Promise.all([
    client.fetch(homepageQuery),
    client.fetch(settingsQuery),
  ]);

  return (
    <main className="bg-brand-black text-brand-light">
      <SectionRenderer blocks={page?.blocks} settings={settings} />
    </main>
  );
}
