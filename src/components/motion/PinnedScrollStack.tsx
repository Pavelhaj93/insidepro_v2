"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSlideWindow } from "@/hooks/usePinnedStack";

export type PinnedStackRenderArgs<T> = {
  item: T;
  index: number;
  total: number;
  /** This item's own progress through its scroll window, 0→1. */
  slideProgress: MotionValue<number>;
  /** Depth cue for the outgoing item — eases 1 → 0.94. */
  depthScale: MotionValue<number>;
};

type PinnedScrollStackProps<T> = {
  items: T[];
  itemKey: (item: T, index: number) => string;
  renderItem: (args: PinnedStackRenderArgs<T>) => ReactNode;
  label?: ReactNode;
  /** Index after which the sticky label fades out (default: last item). */
  labelFadeAfterIndex?: number;
  className?: string;
};

function StackItem<T>({
  item,
  index,
  total,
  scrollYProgress,
  renderItem,
}: {
  item: T;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  renderItem: (args: PinnedStackRenderArgs<T>) => ReactNode;
}) {
  const { progress: slideProgress, depthScale } = useSlideWindow(
    scrollYProgress,
    index,
    total,
  );

  return (
    <div className="sticky top-0 h-screen w-full" style={{ zIndex: index + 1 }}>
      {renderItem({ item, index, total, slideProgress, depthScale })}
    </div>
  );
}

/**
 * Generalizes ClientsShowcaseSection's pinned/sticky scroll-stack pattern:
 * `total * 100vh` of scroll budget, one `sticky top-0 h-screen` slide per
 * item, each windowed to its own 0→1 progress via useSlideWindow.
 */
export function PinnedScrollStack<T>({
  items,
  itemKey,
  renderItem,
  label,
  labelFadeAfterIndex,
  className,
}: PinnedScrollStackProps<T>) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const total = items.length;

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const settledProgress = useMotionValue(1);

  const fadeAfterIndex = labelFadeAfterIndex ?? Math.max(total - 1, 0);
  const labelFadeStart =
    total > 0 ? Math.min(fadeAfterIndex, total - 1) / total : 0;
  const labelOpacity = useTransform(scrollYProgress, [labelFadeStart, 1], [1, 0]);

  if (!total) return null;

  if (reduceMotion) {
    return (
      <section className={className}>
        {label && <div className="px-8 md:px-12 pt-4 pb-8">{label}</div>}
        <div className="flex flex-col gap-8 px-4 md:px-10 pb-16">
          {items.map((item, index) => (
            <div key={itemKey(item, index)}>
              {renderItem({
                item,
                index,
                total,
                slideProgress: settledProgress,
                depthScale: settledProgress,
              })}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={wrapperRef}
      className={className}
      style={{ height: `${total * 100}vh` }}
    >
      {label && (
        <motion.div
          className="sticky top-0 z-0 px-8 md:px-12 pt-20 pointer-events-none"
          style={{ opacity: labelOpacity }}
        >
          {label}
        </motion.div>
      )}

      {items.map((item, index) => (
        <StackItem
          key={itemKey(item, index)}
          item={item}
          index={index}
          total={total}
          scrollYProgress={scrollYProgress}
          renderItem={renderItem}
        />
      ))}
    </section>
  );
}
