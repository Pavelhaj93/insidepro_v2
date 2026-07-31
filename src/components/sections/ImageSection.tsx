import { urlFor } from "@/sanity/lib/image";
import { ParallaxBackgroundImage } from "@/components/motion/ParallaxBackgroundImage";
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
        <ParallaxBackgroundImage
          src={urlFor(image).url()}
          alt={image.alt ?? ""}
          intensity={8}
          sizes="110vw"
          quality={85}
        />
      </Reveal>
    </section>
  );
}
