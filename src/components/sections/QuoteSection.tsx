import QuoteMarkIcon from "../../../public/svg/quote_marks.svg";
import { manrope } from "@/lib/fonts";
import { Reveal } from "@/components/motion/Reveal";

type Props = {
  largeHeadline: string;
  largeHeadlineItalic?: string;
  quoteBoldText?: string;
  quoteRegularText?: string;
};

export function QuoteSection({
  largeHeadline,
  largeHeadlineItalic,
  quoteBoldText,
  quoteRegularText,
}: Props) {
  const parts = largeHeadlineItalic
    ? largeHeadline.split(largeHeadlineItalic)
    : null;
  const hasQuote = quoteBoldText || quoteRegularText;

  return (
    <section className="px-8 xl:px-0 py-24 max-w-7xl mx-auto text-center">
      <Reveal>
        <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl lg:text-7xl leading-tight uppercase text-brand-light mb-16">
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
      </Reveal>

      {hasQuote && (
        <Reveal
          delay={0.15}
          className="max-w-md mx-auto bg-white rounded-md p-8 text-left flex items-start gap-5"
        >
          <QuoteMarkIcon className="shrink-0" />
          <div>
            {quoteBoldText && (
              <p
                className={`${manrope.className} font-extrabold text-xl leading-normal text-gray-900`}
              >
                {quoteBoldText}
              </p>
            )}
            {quoteRegularText && (
              <p
                className={`${manrope.className} font-normal text-xl leading-normal text-gray-900 ${quoteBoldText ? "mt-1" : ""}`}
              >
                {quoteRegularText}
              </p>
            )}
          </div>
        </Reveal>
      )}
    </section>
  );
}
