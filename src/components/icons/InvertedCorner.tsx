type Props = {
  className?: string;
};

/**
 * A square tile filled solid EXCEPT for a transparent quarter-disk cut from
 * its own top-left corner. Positioned so that corner sits exactly on the
 * seam between two adjacent shapes (e.g. a label box cut into a photo's
 * corner), it reads as a smooth concave bite taken out of the fill, rather
 * than a sharp right angle or a convex bump. Color follows currentColor,
 * sizing follows className (width/height).
 */
export function InvertedCorner({ className }: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M0,0 H100 V100 H0 Z M0,0 L100,0 A100,100 0 0 1 0,100 Z"
        fill="currentColor"
      />
    </svg>
  );
}
