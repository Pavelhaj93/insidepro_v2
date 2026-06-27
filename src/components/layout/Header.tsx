'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { urlFor } from '@/sanity/lib/image'

type Props = {
  logo: { asset: { _ref: string } } | null
  logoText: string
}

const mainNavLinks = [
  { label: 'FILMY', href: '/filmy' },
  { label: 'PRODUKCE', href: '/produkce' },
  { label: 'BRANDING', href: '/branding' },
  { label: 'MARKETING', href: '/marketing' },
  { label: 'KONTAKT', href: '/kontakt' },
]

const extraNavLinks = [
  { label: 'PLACEHOLDER 1', href: '#' },
  { label: 'PLACEHOLDER 2', href: '#' },
]

export function Header({ logo, logoText }: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 md:px-12">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          {logo ? (
            <Image
              src={urlFor(logo).height(40).url()}
              alt="insidePRO"
              width={80}
              height={40}
              className="h-8 w-auto object-contain"
            />
          ) : (
            <span className="font-display font-bold text-lg tracking-widest text-brand-light">
              {logoText}
            </span>
          )}
        </Link>

        {/* Desktop center nav */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {mainNavLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-display font-black text-[14.74px] leading-none tracking-normal transition-colors uppercase ${
                pathname === link.href
                  ? 'text-brand-gold'
                  : 'text-brand-light/80 hover:text-brand-light'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Hamburger — always visible */}
        <button
          className="flex flex-col gap-1.5 p-1"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <span className="block w-6 h-0.5 bg-brand-light" />
          <span className="block w-6 h-0.5 bg-brand-light" />
          <span className="block w-4 h-0.5 bg-brand-light ml-auto" />
        </button>
      </header>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Slide panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-80 bg-brand-black flex flex-col transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close button */}
        <div className="flex justify-end px-8 py-6">
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="text-brand-light/60 hover:text-brand-light transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M2 2l16 16M18 2L2 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col px-10 flex-1">
          {mainNavLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`font-display font-bold text-2xl transition-colors uppercase py-3 border-b border-brand-dark/50 last:border-0 ${
                pathname === link.href
                  ? 'text-brand-gold'
                  : 'text-brand-light/80 hover:text-brand-light'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-8 pt-8 border-t border-brand-dark flex flex-col">
            {extraNavLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-body text-sm tracking-widest text-brand-light/50 hover:text-brand-light transition-colors uppercase py-2"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Social links */}
        <div className="flex items-center gap-5 px-10 py-8">
          <a
            href="https://www.instagram.com/insidepro.cz/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-brand-light/40 hover:text-brand-light transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/company/insidepro"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-brand-light/40 hover:text-brand-light transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
          <a
            href="https://www.facebook.com/insidepro.cz"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="text-brand-light/40 hover:text-brand-light transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
            </svg>
          </a>
          <a
            href="https://vimeo.com/insidepro"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Vimeo"
            className="text-brand-light/40 hover:text-brand-light transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 7.42c-.09 2.01-1.49 4.77-4.22 8.28C15 19.35 12.55 21 10.6 21c-1.2 0-2.22-1.12-3.06-3.35L6.04 12.7C5.44 10.47 4.8 9.36 4.1 9.36c-.15 0-.68.32-1.58.95L1.5 9.05c.99-.87 1.97-1.74 2.93-2.61C5.73 5.3 6.9 4.66 7.5 4.61c1.47-.14 2.38.87 2.72 3.03.37 2.32.62 3.76.77 4.33.43 1.94.9 2.91 1.41 2.91.4 0 1-.63 1.8-1.9.8-1.26 1.23-2.22 1.28-2.88.11-1.09-.31-1.64-1.28-1.64-.46 0-.93.11-1.42.32.94-3.09 2.75-4.59 5.42-4.51 1.98.06 2.91 1.34 2.8 3.83z" />
            </svg>
          </a>
        </div>
      </div>
    </>
  )
}
