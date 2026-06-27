type Props = {
  largeHeadline: string
  largeHeadlineItalic?: string
  quoteText?: string
}

export function QuoteSection({ largeHeadline, largeHeadlineItalic, quoteText }: Props) {
  const parts = largeHeadlineItalic ? largeHeadline.split(largeHeadlineItalic) : null

  return (
    <section className="px-8 md:px-12 py-24 max-w-screen-xl mx-auto text-center">
      <h2 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl uppercase leading-tight text-brand-light mb-10">
        {parts ? (
          <>
            {parts[0]}
            <em className="not-italic italic">{largeHeadlineItalic}</em>
            {parts[1]}
          </>
        ) : (
          largeHeadline
        )}
      </h2>

      {quoteText && (
        <div className="max-w-lg mx-auto border border-brand-dark/60 p-6 text-left">
          <p className="font-body text-sm text-brand-light/70 leading-relaxed">{quoteText}</p>
        </div>
      )}
    </section>
  )
}
