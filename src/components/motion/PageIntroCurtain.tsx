"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getPageLabel } from "@/lib/nav-links";

// How much accumulated wheel/touch scroll (px) it takes to fully open —
// also the distance it takes to close again when re-engaged at the top.
const OPEN_DISTANCE_PX = 700;
// Total distance the label itself travels while opening — deliberately tiny
// (about one line of its own text) since it doesn't need to travel far to
// disappear: the clip box around it is sized to the text itself, so once it
// has moved up by roughly its own line height it has already fully exited
// past that box's top edge and been clipped away.
const LABEL_TRAVEL_PX = 100;
const ENTRANCE_EASE = [0.76, 0, 0.24, 1] as const;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * One curtain instance — mounted fresh per page (see the export below),
 * so it naturally replays on every navigation without needing to be keyed.
 */
function CurtainInstance({ label }: { label: string }) {
  const lenis = useLenis();
  // 0 = fully closed/covering, 1 = fully open. A plain motion value (not
  // React state) so wheel/touch input drives it every frame without
  // re-rendering — real scroll stays frozen the whole time the gate is
  // engaged. `lockedRef` (not state, for the same reason) tracks whether
  // the gate currently owns scroll input or real page scroll does.
  const progress = useMotionValue(0);
  const lockedRef = useRef(true);

  const leftX = useTransform(progress, [0, 1], ["0%", "-100%"]);
  const rightX = useTransform(progress, [0, 1], ["0%", "100%"]);
  const labelY = useTransform(progress, [0, 1], [0, -LABEL_TRAVEL_PX]);

  useEffect(() => {
    // Clean slate regardless of any remembered/restored scroll position,
    // then freeze real scrolling until the gate finishes opening.
    lenis?.scrollTo(0, { immediate: true });
    lenis?.stop();
    return () => {
      lenis?.start();
    };
  }, [lenis]);

  useEffect(() => {
    const applyDelta = (delta: number) => {
      const next = clamp01(progress.get() + delta / OPEN_DISTANCE_PX);
      progress.set(next);
      if (next >= 1) {
        lockedRef.current = false;
        lenis?.start();
      }
    };

    // One persistent listener for the whole lifetime, branching on
    // `lockedRef` at call time (rather than detaching/reattaching a
    // separate listener per state) — reattaching per state transition was
    // what caused the occasional "resets from the start" glitch: a stray
    // event landing between the old listener's teardown and the new one's
    // setup, right as the state flipped, could get dropped or double
    // counted. A single listener has no such gap.
    const onWheel = (event: WheelEvent) => {
      if (lockedRef.current) {
        event.preventDefault();
        applyDelta(event.deltaY);
        return;
      }
      // Unlocked: normal scrolling — except scrolling further up while
      // already at the very top re-engages the gate, driven by this same
      // gesture (closing tracks the scroll directly, the same way opening
      // does; it's never a separate auto-played "closing" animation).
      if (event.deltaY < 0 && window.scrollY <= 2) {
        event.preventDefault();
        lenis?.stop();
        lockedRef.current = true;
        applyDelta(event.deltaY);
      }
    };

    // Touch has no `deltaY` — track finger position between move events and
    // convert its frame-to-frame change into the same kind of delta (finger
    // moving up == scrolling down, matching wheel's positive-deltaY sign).
    let touchY: number | null = null;
    const onTouchStart = (event: TouchEvent) => {
      touchY = event.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY;
      if (touchY === null || currentY === undefined) return;
      const delta = touchY - currentY;
      touchY = currentY;

      if (lockedRef.current) {
        event.preventDefault();
        applyDelta(delta);
        return;
      }
      if (delta < 0 && window.scrollY <= 2) {
        event.preventDefault();
        lenis?.stop();
        lockedRef.current = true;
        applyDelta(delta);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [lenis, progress]);

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 bg-brand-black"
        style={{ x: leftX, transformOrigin: "top" }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.35, ease: ENTRANCE_EASE }}
      />
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 bg-brand-black"
        style={{ x: rightX, transformOrigin: "top" }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.35, ease: ENTRANCE_EASE }}
      />
      <div className="absolute inset-0 flex items-center justify-center px-6">
        {/* Clip box sized to the label itself (not the viewport) — the
            "invisible line" sits right at its own top edge, so the label
            only has to travel about one line height before it's fully
            scrolled past that edge and clipped out of view. */}
        <div className="overflow-hidden">
          <motion.p
            className="text-center font-display font-black uppercase text-brand-light text-4xl leading-none sm:text-6xl md:text-7xl"
            style={{ y: labelY }}
          >
            {label}
          </motion.p>
        </div>
      </div>
    </div>
  );
}

/**
 * Full-screen "curtain" intro: a black panel grows down from the top (page
 * name centered, in white), then splits open to left/right as the visitor
 * scrolls their mouse/trackpad — fully reversible while opening (scrolling
 * the other way closes it back up), and re-engages the same way if they
 * later scroll back up to the very top of the page, closing along with
 * their scroll rather than auto-playing a canned "close" animation. It's a
 * `fixed` overlay, not a section pushing page content down, so the actual
 * hero underneath sits at its normal position from the start; real page
 * scrolling stays frozen until the gate finishes opening.
 *
 * Rendered from `HeroSection` itself (not site-wide layout chrome), so it
 * only ever appears on pages that actually have a hero section — the
 * homepage (which uses its own `SplitVideoReveal` instead) never renders
 * this component at all, no route check needed here.
 */
export function PageIntroCurtain() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return null;

  return <CurtainInstance label={getPageLabel(pathname)} />;
}
