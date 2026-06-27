type Props = {
  label?: string
  leftHeading?: string
  leftHeadingItalic?: string
  rightBodyText?: string
}

export function TwoColumnSection({ label, leftHeading, leftHeadingItalic, rightBodyText }: Props) {
  const parts = leftHeadingItalic && leftHeading ? leftHeading.split(leftHeadingItalic) : null

  return (
    <section className="px-8 md:px-12 py-24 max-w-screen-xl mx-auto">
      {label && (
        <p className="font-body text-xs tracking-widest text-brand-light/40 uppercase mb-12">{label}</p>
      )}

      <div className="grid md:grid-cols-2 gap-12 md:gap-20">
        {leftHeading && (
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl uppercase leading-tight text-brand-light">
            {parts ? (
              <>
                {parts[0]}
                <em className="not-italic italic">{leftHeadingItalic}</em>
                {parts[1]}
              </>
            ) : (
              leftHeading
            )}
          </h2>
        )}
        {rightBodyText && (
          <p className="font-body text-base text-brand-light/70 leading-relaxed self-end">{rightBodyText}</p>
        )}
      </div>
    </section>
  )
}
