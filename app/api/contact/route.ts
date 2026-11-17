export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { autoReplyHtml } from "@/lib/autoReply";
import { verifyTurnstile, isHoneypotFilled, clientIp, BOT_CHECK_MESSAGE } from "@/lib/turnstile";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Auto-reply for the /contact form. The enquiry itself reaches the team via
// EmailJS in the browser; this only sends the sender a short acknowledgement.
//
// The contact form has no bot check, so this endpoint could be abused to make
// our domain mail arbitrary addresses. Best-effort in-memory limits (per IP and
// per recipient) cap that. They reset on cold starts, which is acceptable here.
const hits = new Map<string, number[]>();
function limited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";

    // Bot check. The browser calls this route before sending the enquiry via
    // EmailJS and aborts on a 400, so this also gates the enquiry itself.
    if (isHoneypotFilled(body)) return NextResponse.json({ ok: true });
    const bot = await verifyTurnstile(body.turnstileToken, clientIp(req));
    if (!bot.ok) return NextResponse.json({ error: BOT_CHECK_MESSAGE }, { status: 400 });

    if (!EMAIL_RE.test(email) || email.length > 200) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
    if (limited(`ip:${ip}`, 5, 60 * 60 * 1000) || limited(`to:${email}`, 1, 60 * 60 * 1000)) {
      // Report success: nothing useful for a caller to learn from the limit.
      return NextResponse.json({ ok: true });
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("[contact-autoreply] RESEND_API_KEY missing");
      return NextResponse.json({ error: "Not configured." }, { status: 500 });
    }

    const greeting = name ? `Dear ${name},` : "Hello,";

    await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: "Inkpot India <tickets@tickets.inkpotindia.com>",
      to: email,
      replyTo: "info@inkpotindia.com",
      subject: "Thank you for reaching out to Inkpot India",
      html: autoReplyHtml({
        title: "Thank you for reaching out",
        greeting,
        paragraphs: [
          "Thank you for reaching out to us. We have received your message and our team will get back to you soon.",
          "If it is urgent, you can also reach us here:",
        ],
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact-autoreply]", err);
    return NextResponse.json({ error: "Failed." }, { status: 500 });
  }
}
