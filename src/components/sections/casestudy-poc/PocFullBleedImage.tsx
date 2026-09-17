import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImage } from "./types";

export function PocFullBleedImage({
  image,
  alt,
}: {
  image?: SanityImage;
  alt: string;
}) {
  if (!image) return null;

  return (
    <div className="relative aspect-16/9 w-full overflow-hidden rounded-4xl bg-brand-dark">
      <Image
        src={urlFor(image).width(1920).height(1080).url()}
        alt={alt}
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
    </div>
  );
}
