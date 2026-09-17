"use client";

import { useRef, type ReactNode } from "react";
import {
  useMotionValue,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type StickyListRevealRenderArgs<T> = {
  item: T;
  index: number;
  total: number;
  /** Rises from ~96px to 0 as the item approaches viewport center. */
  y: MotionValue<number>;
  /** Fades from 0 to 1 over the same window. */
  opacity: MotionValue<number>;
};

type StickyListRevealProps<T> = {
  items: T[];
  itemKey: (item: T, index: number) => string;
  renderItem: (args: StickyListRevealRenderArgs<T>) => ReactNode;
  /** Left-column content — pinned vertically centered while the right column scrolls past it. */
  sticky: ReactNode;
  /** Vertical gap between right-column items, in vh — the bigger this is, the longer each item lingers before the next appears. */
  gapVh?: number;
  className?: string;
};

function RevealItem<T>({
  item,
  index,
  total,
  renderItem,
}: {
  item: T;
  index: number;
  total: number;
  renderItem: (args: StickyListRevealRenderArgs<T>) => ReactNode;
}) {
  const itemRef = useRef<HTMLDivElement>(null);

  // Continuous, not a whileInView trigger: as the item's top edge travels
  // from the bottom of the viewport up to viewport-center, y/opacity track
  // that motion directly, so it visibly rises into place rather than
  // snapping in once it crosses a threshold.
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start end", "start center"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [96, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={itemRef}>{renderItem({ item, index, total, y, opacity })}</div>
  );
}

/**
 * Left column pins at vertical-center via a plain CSS grid + position:sticky
 * (no scroll math needed for that part — the grid row naturally stretches to
 * the right column's full height, so the sticky column releases exactly
 * when the right column's content runs out, which is what makes the last
 * item settle at the same level as the sticky column rather than needing a
 * hand-tuned offset). Right-column items reveal continuously as they
 * approach center, each spaced `gapVh` apart.
 */
export function StickyListReveal<T>({
  items,
  itemKey,
  renderItem,
  sticky,
  gapVh = 50,
  className,
}: StickyListRevealProps<T>) {
  const reduceMotion = useReducedMotion();
  const total = items.length;
  const settled = useMotionValue(1);
  const settledY = useMotionValue(0);

  if (!total) return null;

  if (reduceMotion) {
    return (
      <section
        className={`grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-12 ${className ?? ""}`}
      >
        <div>{sticky}</div>
        <div className="flex flex-col gap-12">
          {items.map((item, index) => (
            <div key={itemKey(item, index)}>
              {renderItem({
                item,
                index,
                total,
                y: settledY,
                opacity: settled,
              })}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      className={`grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-x-12 ${className ?? ""}`}
    >
      <div className="md:sticky md:top-1/2 md:-translate-y-1/2 h-fit pb-16 md:pb-0">
        {sticky}
      </div>
      <div className="flex flex-col" style={{ gap: `${gapVh}vh` }}>
        {items.map((item, index) => (
          <RevealItem
            key={itemKey(item, index)}
            item={item}
            index={index}
            total={total}
            renderItem={renderItem}
          />
        ))}
      </div>
    </section>
  );
}
