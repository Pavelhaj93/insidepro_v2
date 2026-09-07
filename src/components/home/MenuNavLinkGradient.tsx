"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMagneticTilt } from "@/hooks/useMagneticTilt";

type Props = { label: string; isActive: boolean; reduceMotion: boolean };

export function MenuNavLinkGradient({ label, isActive, reduceMotion }: Props) {
  const { style, onMouseMove, onMouseLeave } = useMagneticTilt({
    disabled: reduceMotion,
  });

  return (
    <motion.span
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={reduceMotion ? undefined : { ...style, display: "inline-block" }}
      className={cn(
        "transition-colors",
        isActive && !reduceMotion && "menu-link-gradient is-active",
        isActive && reduceMotion && "text-brand-gold",
        !isActive && "text-brand-light"
      )}
    >
      {label}
    </motion.span>
  );
}
