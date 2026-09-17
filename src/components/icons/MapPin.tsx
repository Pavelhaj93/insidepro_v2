type Props = {
  className?: string;
};

/** Simple location pin, used to mark cities/offices in text (inherits color via currentColor). */
export function MapPinIcon({ className }: Props) {
  return (
    <svg
      width="14"
      height="18"
      viewBox="0 0 14 18"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M7 17S13 11.03 13 6.8C13 3.6 10.31 1 7 1S1 3.6 1 6.8C1 11.03 7 17 7 17Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="6.8" r="2.2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
