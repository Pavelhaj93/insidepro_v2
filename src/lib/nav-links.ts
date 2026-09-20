export type NavLink = { label: string; href: string; isDisabled?: boolean };

export const NAV_LINKS: NavLink[] = [
  { label: "Úvod", href: "/" },
  { label: "Reference", href: "/reference" },
  { label: "Filmy", href: "/filmy" },
  { label: "Blog", href: "/blog", isDisabled: true },
  { label: "Kariéra", href: "/kariera" },
  { label: "Kontakt", href: "/kontakt" },
];

/** Human label for a pathname — a known nav route's label, or the last slug segment, title-cased. */
export function getPageLabel(pathname: string): string {
  const known = NAV_LINKS.find((link) => link.href === pathname);
  if (known) return known.label;

  const lastSegment = pathname.split("/").filter(Boolean).pop() ?? "";
  return lastSegment
    .split("-")
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(" ");
}
