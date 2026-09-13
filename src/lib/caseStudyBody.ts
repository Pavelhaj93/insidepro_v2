// The `project.body` Portable Text field (studio/src/schemaTypes/documents/project.ts)
// is unstructured — editors type "01" / a bold heading / a paragraph, then "02" / heading /
// paragraph, sometimes followed by a bold credit line, all as plain spans rather than
// dedicated fields. This walks that raw content and splits it back into sections.

type RawSpan = { _type: "span"; text?: string; marks?: string[] };
type RawBlock = { _type: string; children?: RawSpan[] };

export type CaseStudySection = {
  marker: string;
  heading: string;
  paragraphs: string[];
  credit?: string;
};

const MARKER_PATTERN = /^0[12]$/;

/**
 * Flattens every block's children into one ordered span list, then splits on
 * marker spans ("01"/"02", always plain-marks, own span) — not on block
 * boundaries, since a section's paragraph can spill across several
 * consecutive blocks with no marker prefix on the continuation blocks.
 */
export function parseCaseStudySections(
  body: RawBlock[] | null | undefined,
): CaseStudySection[] {
  if (!body?.length) return [];

  const spans = body.flatMap((block) => block.children ?? []);

  const sections: CaseStudySection[] = [];
  let current: CaseStudySection | null = null;
  let textBuffer = "";

  const flushParagraphs = () => {
    if (!current) return;
    current.paragraphs = textBuffer
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    textBuffer = "";
  };

  for (const span of spans) {
    const text = span.text ?? "";
    const isBold = span.marks?.includes("strong") ?? false;
    const trimmed = text.trim();

    if (!isBold && MARKER_PATTERN.test(trimmed)) {
      flushParagraphs();
      current = { marker: trimmed, heading: "", paragraphs: [] };
      sections.push(current);
      continue;
    }

    if (!current) continue; // stray text before the first marker — ignore

    if (isBold) {
      if (!current.heading) {
        current.heading = trimmed;
      } else {
        // A second bold span within a section (or a trailing one after the
        // last marker) is a credit line, not more heading text.
        current.credit = trimmed;
      }
      continue;
    }

    textBuffer += text;
  }

  flushParagraphs();

  return sections.filter((section) => section.heading);
}
