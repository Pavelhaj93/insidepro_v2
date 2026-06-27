type SocialLinks = {
  instagram?: string | null;
  linkedin?: string | null;
  facebook?: string | null;
  vimeo?: string | null;
};

type Props = {
  links: SocialLinks;
  className?: string;
  iconSize?: number;
};

const platforms = [
  {
    key: "instagram" as const,
    label: "Instagram",
    icon: (size: number) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: "linkedin" as const,
    label: "LinkedIn",
    icon: (size: number) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    key: "facebook" as const,
    label: "Facebook",
    icon: (size: number) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
  },
  {
    key: "vimeo" as const,
    label: "Vimeo",
    icon: (size: number) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 7.42c-.09 2.01-1.49 4.77-4.22 8.28C15 19.35 12.55 21 10.6 21c-1.2 0-2.22-1.12-3.06-3.35L6.04 12.7C5.44 10.47 4.8 9.36 4.1 9.36c-.15 0-.68.32-1.58.95L1.5 9.05c.99-.87 1.97-1.74 2.93-2.61C5.73 5.3 6.9 4.66 7.5 4.61c1.47-.14 2.38.87 2.72 3.03.37 2.32.62 3.76.77 4.33.43 1.94.9 2.91 1.41 2.91.4 0 1-.63 1.8-1.9.8-1.26 1.23-2.22 1.28-2.88.11-1.09-.31-1.64-1.28-1.64-.46 0-.93.11-1.42.32.94-3.09 2.75-4.59 5.42-4.51 1.98.06 2.91 1.34 2.8 3.83z" />
      </svg>
    ),
  },
];

export function SocialLinks({ links, className = "", iconSize = 18 }: Props) {
  const active = platforms.filter((p) => links[p.key]);
  if (!active.length) return null;

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {active.map((p) => (
        <a
          key={p.key}
          href={links[p.key]!}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={p.label}
          className="text-brand-light hover:text-brand-gold transition-colors"
        >
          {p.icon(iconSize)}
        </a>
      ))}
    </div>
  );
}
