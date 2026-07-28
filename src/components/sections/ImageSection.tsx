import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

type Props = {
  image?: {
    asset?: {
      url?: string;
      metadata?: { dimensions?: { width: number; height: number } };
    };
    alt?: string;
  };
};

export function ImageSection({ image }: Props) {
  if (!image?.asset?.url) return null;

  const { width = 16, height = 9 } = image.asset.metadata?.dimensions ?? {};

  return (
    <section className="w-full">
      <div className="relative w-full" style={{ aspectRatio: `${width} / ${height}` }}>
        <Image
          src={urlFor(image).width(2000).url()}
          alt={image.alt ?? ""}
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
    </section>
  );
}
