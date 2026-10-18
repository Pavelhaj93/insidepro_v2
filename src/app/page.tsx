import { SectionRenderer } from "@/components/SectionRenderer";
import type { ComponentProps } from "react";
import { fetchSanity } from "@/sanity/lib/live";
import { homepageQuery, settingsQuery } from "@/sanity/lib/queries";

type RendererProps = ComponentProps<typeof SectionRenderer>;

export default async function HomePage() {
  const [page, settings] = await Promise.all([
    fetchSanity<{ blocks: RendererProps["blocks"] } | null>({ query: homepageQuery }),
    fetchSanity<RendererProps["settings"]>({ query: settingsQuery }),
  ]);

  return (
    <main className="bg-brand-black text-brand-light">
      <SectionRenderer blocks={page?.blocks ?? []} settings={settings} />
    </main>
  );
}
