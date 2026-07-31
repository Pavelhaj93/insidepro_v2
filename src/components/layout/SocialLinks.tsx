import {
  FaInstagram,
  FaLinkedinIn,
  FaFacebook,
  FaVimeoV,
} from "react-icons/fa6";

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
    icon: (size: number) => <FaInstagram size={size} />,
  },
  {
    key: "linkedin" as const,
    label: "LinkedIn",
    icon: (size: number) => <FaLinkedinIn size={size} />,
  },
  {
    key: "facebook" as const,
    label: "Facebook",
    icon: (size: number) => <FaFacebook size={size} />,
  },
  {
    key: "vimeo" as const,
    label: "Vimeo",
    icon: (size: number) => <FaVimeoV size={size} />,
  },
];

export function SocialLinks({ links, className = "", iconSize = 24 }: Props) {
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
