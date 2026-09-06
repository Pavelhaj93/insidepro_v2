"use client";

import { type ReactNode } from "react";
import { motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useHorizontalScrub, EDGE_PADDING_VW } from "@/hooks/useHorizontalScrub";

export type HorizontalCardRenderArgs<T> = {
  item: T;
  index: number;
  total: number;
  /** Eases toward 1 as this card nears viewport center, down to ~0.85 at the edges. */
  depthScale: MotionValue<number>;
  /** Same idea as depthScale, mapped to a gentler opacity floor. */
  depthOpacity: MotionValue<number>;
};

type HorizontalScrollCardsProps<T> = {
  items: T[];
  itemKey: (item: T, index: number) => string;
  renderItem: (args: HorizontalCardRenderArgs<T>) => ReactNode;
  label?: ReactNode;
  itemWidthVw?: number;
  gapVw?: number;
  /** vw the track starts pushed off-screen right before the first card settles in. */
  entryVw?: number;
  /** Resting position (vw) once the entry finishes — lets the first card land nearer center. */
  restVw?: number;
  /** Fraction (0-1) of the scroll range spent on the entry before normal cycling starts. */
  entryProgress?: number;
  /** Fraction (0-1) of viewport height the wrapper's top can be down before the scrub starts; 0 waits for the pin to fully engage. */
  startAt?: number;
  /** Mirror of `startAt` for the tail: fraction (0-1) of viewport height the wrapper's bottom can be down when the scrub finishes; 1 matches the pin's natural release, smaller keeps it running a bit into the handoff to the next section. */
  endAt?: number;
  /**
   * Extra left offset (px), added as margin so it stacks with the existing
   * vw-based edge padding — for pages with a fixed-position sidebar/header
   * that would otherwise sit on top of the label or the first card.
   */
  sidebarOffsetPx?: number;
  /** Stretches the section's scroll budget (>1 = slower scrub, same total travel). */
  speedMultiplier?: number;
  className?: string;
  /** Horizontal padding for the label only (not the card track) — override to match another section's kicker/title alignment. */
  labelClassName?: string;
};

function Card<T>({
  item,
  index,
  total,
  xVw,
  centerVw,
  spacingVw,
  renderItem,
}: {
  item: T;
  index: number;
  total: number;
  xVw: MotionValue<number>;
  /** This card's horizontal center (vw) when the track sits at x = 0. */
  centerVw: number;
  /** vw distance between adjacent cards' centers — normalizes the falloff below. */
  spacingVw: number;
  renderItem: (args: HorizontalCardRenderArgs<T>) => ReactNode;
}) {
  // Distance from viewport center (50vw), driven by the track's *actual*
  // on-screen position rather than an assumed even split of scroll
  // progress — the entry/rest/exit phases aren't evenly spaced in
  // progress, so `index / (total - 1)` would fall out of sync with which
  // card is really centered.
  //
  // A flat plateau near center holds the card at full prominence for a
  // while (not just an instant), and the falloff beyond it is spread over
  // a wide band (~1.2 card-spacings) so the transition reads as a slow
  // ease rather than a sudden spike-then-drop.
  const falloff = useTransform(xVw, (x) => {
    const distance = Math.abs(centerVw + x - 50) / spacingVw;
    const PLATEAU = 0.3;
    const RANGE = 1.2;
    return Math.min(Math.max((distance - PLATEAU) / RANGE, 0), 1);
  });
  const depthScale = useTransform(falloff, (f) => 1 - f * 0.15);
  const depthOpacity = useTransform(falloff, (f) => 1 - f * 0.55);

  return <>{renderItem({ item, index, total, depthScale, depthOpacity })}</>;
}

/**
 * A single pinned viewport with a horizontally-scrubbed flex track — the
 * static-grid alternative for short card sets (services, process steps,
 * feature cards) rather than per-card full-bleed pinning.
 */
export function HorizontalScrollCards<T>({
  items,
  itemKey,
  renderItem,
  label,
  itemWidthVw = 70,
  gapVw = 4,
  entryVw = 0,
  restVw = 0,
  entryProgress = 0.15,
  startAt = 0,
  endAt = 1,
  sidebarOffsetPx = 0,
  speedMultiplier = 1,
  className,
  labelClassName = "px-8 md:px-12",
}: HorizontalScrollCardsProps<T>) {
  const reduceMotion = useReducedMotion();
  const total = items.length;
  const { wrapperRef, xVw } = useHorizontalScrub({
    itemCount: total,
    itemWidthVw,
    gapVw,
    entryVw,
    restVw,
    entryProgress,
    startAt,
    endAt,
  });
  const x = useTransform(xVw, (v) => `${v}vw`);
  const settled = useMotionValue(1);
  const spacingVw = itemWidthVw + gapVw;

  if (!total) return null;

  if (reduceMotion) {
    return (
      <section className={className}>
        {label && (
          <div
            className={`${labelClassName} pt-4 pb-8`}
            style={{ marginLeft: sidebarOffsetPx || undefined }}
          >
            {label}
          </div>
        )}
        <div
          className="flex flex-wrap gap-6 px-4 md:px-10 pb-16"
          style={{ marginLeft: sidebarOffsetPx || undefined }}
        >
          {items.map((item, index) => (
            <div key={itemKey(item, index)} className="flex-1 min-w-65">
              {renderItem({
                item,
                index,
                total,
                depthScale: settled,
                depthOpacity: settled,
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
      style={{
        height: `${(Math.max(total * 60, 60) + 100) * speedMultiplier}vh`,
      }}
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        {label && (
          <div
            className={`${labelClassName} pb-8`}
            style={{ marginLeft: sidebarOffsetPx || undefined }}
          >
            {label}
          </div>
        )}
        <motion.div
          className="flex items-stretch"
          style={{
            x,
            marginLeft: sidebarOffsetPx || undefined,
            gap: `${gapVw}vw`,
            paddingLeft: `${EDGE_PADDING_VW}vw`,
            paddingRight: `${EDGE_PADDING_VW}vw`,
          }}
        >
          {items.map((item, index) => (
            <div
              key={itemKey(item, index)}
              style={{ flex: `0 0 ${itemWidthVw}vw` }}
            >
              <Card
                item={item}
                index={index}
                total={total}
                xVw={xVw}
                centerVw={EDGE_PADDING_VW + index * spacingVw + itemWidthVw / 2}
                spacingVw={spacingVw}
                renderItem={renderItem}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
