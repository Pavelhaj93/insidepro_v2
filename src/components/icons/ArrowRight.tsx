type Props = {
  className?: string;
};

/** Long-tail right arrow used in text links (inherits color via currentColor). */
export function ArrowRightIcon({ className }: Props) {
  return (
    <svg
      width="33"
      height="16"
      viewBox="0 0 33 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M0 8H31M24.5 1.5L31 8L24.5 14.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
