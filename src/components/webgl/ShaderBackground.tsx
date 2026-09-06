"use client";

import dynamic from "next/dynamic";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const ShaderCanvas = dynamic(
  () => import("./ShaderCanvas").then((m) => m.ShaderCanvas),
  { ssr: false },
);

/**
 * Gated wrapper around the full-screen OGL noise shader. Renders nothing (the
 * photo/video underneath stands alone) unless WebGL is actually supported and
 * the user hasn't asked for reduced motion. The blend/opacity treatment lives
 * here rather than in ShaderCanvas so the same canvas can be reused elsewhere
 * with different framing later without re-tuning the shader itself.
 */
export function ShaderBackground() {
  const supported = useWebGLSupport();
  const reduceMotion = useReducedMotion();

  if (!supported || reduceMotion) return null;

  return (
    <div className="absolute inset-0 pointer-events-none mix-blend-soft-light opacity-70">
      <ShaderCanvas />
    </div>
  );
}
