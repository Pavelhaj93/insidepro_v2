import { NextResponse } from "next/server";
import { Resend } from "resend";
import { client } from "@/sanity/lib/client";
import { footerQuery } from "@/sanity/lib/queries";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Backs the "Číslované kroky" contact form (`ContactFormSection.tsx`) — the
 * winning design of the three contact-form POC variants. Sends via Resend
 * to the same address shown in the site footer (`footer.email` in Sanity),
 * so there's one source of truth for "where inquiries go" instead of a
 * second, easy-to-forget env var. Requires RESEND_API_KEY to be set;
 * without it this fails closed with a 500 rather than silently dropping
 * submissions.
 */
export async function POST(request: Request) {
  let payload: ContactPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const message =
    typeof payload.message === "string" ? payload.message.trim() : "";

  if (!name || !email || !message || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Missing or invalid fields" },
      { status: 400 },
    );
  }

  if (!process.env.RESEND_API_KEY) {
    console.error(
      "RESEND_API_KEY is not set — cannot send contact form email.",
    );
    return NextResponse.json(
      { error: "Email is not configured" },
      { status: 500 },
    );
  }

  const footer = await client.fetch<{ email?: string }>(footerQuery);
  const to = footer?.email;
  if (!to) {
    console.error(
      "No footer.email configured in Sanity — cannot route contact form email.",
    );
    return NextResponse.json(
      { error: "Email is not configured" },
      { status: 500 },
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from =
    process.env.RESEND_FROM_EMAIL || "insidePRO web <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `Nová poptávka z webu — ${name}`,
    html: `
      <p><strong>Jméno:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Zpráva:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
