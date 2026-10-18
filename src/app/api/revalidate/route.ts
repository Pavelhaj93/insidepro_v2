import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Safety net for `sanityFetch` caching. `<SanityLive>` invalidates exactly the
 * changed content, but only from a browser that has the site open at publish
 * time — with nobody online the event is missed and pages stay stale. A Sanity
 * webhook (on create/update/delete of published documents) calls this route
 * and purges the whole site, which is cheap at this site's size.
 *
 * Signed with SANITY_REVALIDATE_SECRET (same value in the Sanity webhook).
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "Missing SANITY_REVALIDATE_SECRET" }, { status: 500 });
  }

  // `true` waits for Content Lake eventual consistency, so the re-render
  // triggered by the purge already sees the new content.
  const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret, true);
  if (!isValidSignature) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ revalidated: true, type: body?._type ?? null });
}
