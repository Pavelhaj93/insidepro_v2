type Props = {
  className?: string;
};

/** Globe glyph used for external "visit website" links (inherits color via currentColor). */
export function GlobeIcon({ className }: Props) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M1.5 9h15M9 1.5c2.2 2.1 3.4 4.7 3.4 7.5S11.2 13.9 9 16c-2.2-2.1-3.4-4.7-3.4-7.5S6.8 3.6 9 1.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
