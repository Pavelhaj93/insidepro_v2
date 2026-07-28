import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { ParallaxLayer } from "@/components/motion/ParallaxLayer";
import { Reveal } from "@/components/motion/Reveal";
import { fadeIn } from "@/lib/motion";

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
      <Reveal
        variants={fadeIn}
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        <ParallaxLayer intensity={8}>
          <Image
            src={urlFor(image).width(2000).url()}
            alt={image.alt ?? ""}
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </ParallaxLayer>
      </Reveal>
    </section>
  );
}
