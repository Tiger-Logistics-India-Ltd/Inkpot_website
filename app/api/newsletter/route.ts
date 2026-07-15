export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabase } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NOTIFY_TO = ["saurav.chaudhary70@gmail.com", "info@inkpotindia.com"];

// Newsletter ("Stay Connected") subscriptions from the homepage.
// Saves to Supabase (newsletter_subscribers, best-effort) and emails the team.
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!EMAIL_RE.test(email) || email.length > 200) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    // Save to the dashboard (Subscribers tab). Best-effort: a missing table or a
    // Supabase hiccup must never break the signup — the email below is the
    // guaranteed notification. Requires supabase/create_newsletter_subscribers_table.sql.
    try {
      const { error: dbError } = await getSupabase()
        .from("newsletter_subscribers")
        .upsert({ email, source: "homepage" }, { onConflict: "email" });
      if (dbError) console.error("[newsletter:db]", dbError.message);
    } catch (e) {
      console.error("[newsletter:db]", e);
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("[newsletter] RESEND_API_KEY missing");
      return NextResponse.json(
        { error: "Something went wrong. Please try again in a moment." },
        { status: 500 }
      );
    }

    const esc = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: "Inkpot India <tickets@tickets.inkpotindia.com>",
      to: NOTIFY_TO,
      replyTo: email,
      subject: `New newsletter subscriber: ${email}`,
      html: `<!DOCTYPE html><html><body style="margin:0;padding:32px 16px;background:#F4EFE6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:460px;background:#fff;border-top:3px solid #901A1C;">
<tr><td style="padding:32px 36px 8px;">
<p style="margin:0 0 4px;font-size:9px;letter-spacing:0.3em;text-transform:uppercase;color:#901A1C;">Inkpot India</p>
<h1 style="margin:0 0 20px;font-size:20px;font-weight:400;color:#1a1a1a;font-family:Georgia,serif;font-style:italic;">New newsletter subscriber</h1>
<p style="margin:0 0 6px;font-size:14px;color:#1a1a1a;"><strong>Email:</strong> ${esc(email)}</p>
</td></tr>
<tr><td style="padding:16px 36px 32px;">
<p style="margin:0;font-size:11px;color:#999;">Also saved to the Subscribers tab in your admin dashboard.</p>
</td></tr></table></td></tr></table></body></html>`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[newsletter]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again in a moment." },
      { status: 500 }
    );
  }
}
