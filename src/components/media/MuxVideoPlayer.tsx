"use client";

import MuxPlayer from "@mux/mux-player-react/lazy";

type Props = {
  playbackId: string;
  title?: string;
  poster?: string;
  className?: string;
};

export function MuxVideoPlayer({ playbackId, title, poster, className }: Props) {
  return (
    <div className={`aspect-video w-full overflow-hidden rounded-4xl bg-brand-dark ${className ?? ""}`}>
      <MuxPlayer
        playbackId={playbackId}
        streamType="on-demand"
        poster={poster}
        metadata={{ video_title: title }}
        accentColor="var(--color-brand-gold)"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
