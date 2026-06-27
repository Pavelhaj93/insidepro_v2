import QuoteMarkIcon from '../../../public/svg/quote_marks.svg'
import { manrope } from '@/lib/fonts'

type Props = {
  largeHeadline: string
  largeHeadlineItalic?: string
  quoteBoldText?: string
  quoteRegularText?: string
}

export function QuoteSection({ largeHeadline, largeHeadlineItalic, quoteBoldText, quoteRegularText }: Props) {
  const parts = largeHeadlineItalic ? largeHeadline.split(largeHeadlineItalic) : null
  const hasQuote = quoteBoldText || quoteRegularText

  return (
    <section className="px-8 md:px-12 py-24 max-w-screen-xl mx-auto text-center">
      <h2 className="font-display font-black text-7xl leading-tight uppercase text-brand-light mb-16">
        {parts ? (
          <>
            {parts[0]}
            <em className="italic text-brand-gold">{largeHeadlineItalic}</em>
            {parts[1]}
          </>
        ) : (
          largeHeadline
        )}
      </h2>

      {hasQuote && (
        <div className="max-w-md mx-auto bg-white rounded-2xl p-8 text-left">
          <QuoteMarkIcon className="mb-5" />
          {quoteBoldText && (
            <p className={`${manrope.className} font-extrabold text-xl leading-normal text-gray-900`}>
              {quoteBoldText}
            </p>
          )}
          {quoteRegularText && (
            <p className={`${manrope.className} font-normal text-xl leading-normal text-gray-900 ${quoteBoldText ? 'mt-1' : ''}`}>
              {quoteRegularText}
            </p>
          )}
        </div>
      )}
    </section>
  )
}
