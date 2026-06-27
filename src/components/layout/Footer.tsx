import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-brand-dark px-8 py-10 md:px-12">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Logo + legal */}
        <div>
          <Link href="/" className="font-display font-bold text-lg tracking-widest text-brand-light block mb-3">
            IN
          </Link>
          <p className="text-xs text-brand-light/40 leading-relaxed max-w-sm">
            © {new Date().getFullYear()} R&amp;T Production s.r.o. — All rights reserved.
          </p>
          <p className="text-xs text-brand-light/30 leading-relaxed max-w-sm mt-1">
            Společnost je zapsána v obchodním rejstříku vedeném Krajským soudem v Hradci Králové, oddíl C, vložka 35789 / IČ: 02146142.
          </p>
        </div>

        {/* Contact + socials */}
        <div className="flex flex-col items-start md:items-end gap-3">
          <a href="mailto:produkce@insidepro.cz" className="text-sm text-brand-light/70 hover:text-brand-gold transition-colors">
            produkce@insidepro.cz
          </a>
          <a href="tel:+420731727306" className="text-sm text-brand-light/70 hover:text-brand-gold transition-colors">
            +420 731 727 306
          </a>

          {/* Social icons */}
          <div className="flex items-center gap-4 mt-1">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              className="text-brand-light/50 hover:text-brand-light transition-colors text-xs tracking-widest">
              IG
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              className="text-brand-light/50 hover:text-brand-light transition-colors text-xs tracking-widest">
              LI
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
              className="text-brand-light/50 hover:text-brand-light transition-colors text-xs tracking-widest">
              FB
            </a>
            <a href="https://vimeo.com" target="_blank" rel="noopener noreferrer" aria-label="Vimeo"
              className="text-brand-light/50 hover:text-brand-light transition-colors text-xs tracking-widest">
              VI
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
