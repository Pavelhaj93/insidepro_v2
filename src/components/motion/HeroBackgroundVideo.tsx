"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useInViewport } from "@/hooks/useInViewport";

type Props = {
  src: string;
  mimeType?: string;
  mobileSrc?: string;
  mobileMimeType?: string;
  timecodeClassName?: string;
  /** Forces playback off regardless of viewport intersection — for callers
   *  that visually occlude the video via CSS (e.g. SplitVideoReveal's
   *  sticky video getting covered by the next section) even though it's
   *  still geometrically inside the viewport. */
  forcePause?: boolean;
};

// Standard player timestamp: M:SS while under an hour (matches how long
// this clip actually runs), H:MM:SS beyond that.
function formatTimecode(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

/**
 * Renders on top of the (always-present) poster image, which stays visible
 * underneath until the video has enough data to paint over it — no extra
 * poster wiring needed. Skipped entirely under reduced motion, not just
 * visually hidden, so the browser never fetches/plays it in that case.
 *
 * `<source media="...">` works the same way it does in `<picture>` — the
 * browser picks the first matching source and only fetches that one, so a
 * portrait mobile clip never causes the desktop clip to download too.
 */
export function HeroBackgroundVideo({
  src,
  mimeType = "video/mp4",
  mobileSrc,
  mobileMimeType = "video/mp4",
  timecodeClassName,
  forcePause = false,
}: Props) {
  const reduceMotion = useReducedMotion();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInViewport = useInViewport(videoRef);
  const shouldPlay = isInViewport && !forcePause;

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;

    if (shouldPlay) {
      // Interrupted play() calls (rapid scroll direction changes, dev
      // StrictMode's double-invoke) reject with AbortError — expected, not
      // an error condition, so it's swallowed rather than logged.
      node.play().catch(() => {});
    } else {
      node.pause();
    }
  }, [shouldPlay]);

  if (reduceMotion) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover object-center"
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
      >
        {mobileSrc && (
          <source media="(max-width: 767px)" src={mobileSrc} type={mobileMimeType} />
        )}
        <source src={src} type={mimeType} />
      </video>

      <div
        className={
          timecodeClassName ??
          "pointer-events-none absolute top-4 right-4 z-20 flex flex-col items-end gap-1.5 rounded-xl bg-black/50 px-3 py-2 backdrop-blur-sm md:top-6 md:right-6"
        }
      >
        <span className="font-body text-xs tabular-nums tracking-wider text-brand-light/80">
          {formatTimecode(currentTime)} / {formatTimecode(duration)}
        </span>
        <div className="h-0.5 w-20 overflow-hidden rounded-full bg-brand-light/20">
          <div
            className="h-full rounded-full bg-brand-gold"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </>
  );
}
