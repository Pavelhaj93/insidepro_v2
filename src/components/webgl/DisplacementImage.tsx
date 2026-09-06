"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image, { type ImageProps } from "next/image";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const DisplacementCanvas = dynamic(
  () => import("./DisplacementCanvas").then((m) => m.DisplacementCanvas),
  { ssr: false },
);

type Props = ImageProps & {
  /** Plain URL used to load the WebGL texture — same image the <Image> shows. */
  rippleSrc: string;
};

/**
 * Drop-in replacement for a plain `<Image fill ... />` inside ProjectCard. The
 * real <Image> always renders underneath (layout/SEO/CSS hover-scale untouched);
 * on pointer-enter (desktop fine-pointer, WebGL supported, motion not reduced)
 * an OGL canvas mounts on top and ripples the same image, then unmounts on
 * pointer-leave so at most a handful of WebGL contexts ever exist at once.
 *
 * `className` must cover `opacity` in its own transition-property utility
 * (e.g. Tailwind's bare `transition`, not `transition-transform`) — this
 * component only toggles `opacity-0`/`opacity-100`, it doesn't declare its own
 * transition-property, to avoid two utilities fighting over one CSS property.
 */
export function DisplacementImage({ rippleSrc, className, ...imageProps }: Props) {
  const [hovered, setHovered] = useState(false);
  const supported = useWebGLSupport();
  const reduceMotion = useReducedMotion();
  const canRipple = supported && !reduceMotion;

  return (
    <div
      className="absolute inset-0"
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse" && canRipple) setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
    >
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt is required by the ImageProps type this component spreads; eslint can't see through the spread */}
      <Image
        {...imageProps}
        className={`${className ?? ""} ${hovered ? "opacity-0" : "opacity-100"}`}
      />
      {hovered && (
        <div className="absolute inset-0">
          <DisplacementCanvas imageUrl={rippleSrc} />
        </div>
      )}
    </div>
  );
}
