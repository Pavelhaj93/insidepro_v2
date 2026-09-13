import { POC_VIDEO_SRC } from "./pocContent";

export function PocVideo() {
  return (
    <video
      src={POC_VIDEO_SRC}
      controls
      muted
      loop
      playsInline
      className="w-full rounded-4xl bg-brand-dark"
    />
  );
}
