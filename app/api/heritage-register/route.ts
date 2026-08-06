export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabase } from "@/lib/supabase";
import { verifyTurnstile, isHoneypotFilled, clientIp, BOT_CHECK_MESSAGE } from "@/lib/turnstile";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NOTIFY_TO = ["saurav.chaudhary70@gmail.com", "info@inkpotindia.com"];

// Registration for The Heritage Cleanliness Project volunteer drives.
// Saves to Supabase (heritage_volunteers, best-effort) and emails the team.
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const affiliation = typeof body.affiliation === "string" ? body.affiliation.trim().slice(0, 120) : "";

    // Silent drop: report success so the bot has no signal to adapt to.
    if (isHoneypotFilled(body)) {
      console.warn("[heritage-register] honeypot triggered");
      return NextResponse.json({ ok: true });
    }

    const bot = await verifyTurnstile(body.turnstileToken, clientIp(req));
    if (!bot.ok) {
      return NextResponse.json({ error: BOT_CHECK_MESSAGE }, { status: 400 });
    }

    if (!name || name.length > 120) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }
    if (!EMAIL_RE.test(email) || email.length > 200) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (!phone || phone.replace(/[^0-9]/g, "").length < 7 || phone.length > 30) {
      return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
    }

    // Save to the dashboard (Volunteers tab). Best-effort: a missing table or a
    // Supabase hiccup must never break the signup — the email below is the
    // guaranteed notification. Requires supabase/create_heritage_volunteers_table.sql.
    try {
      const { error: dbError } = await getSupabase()
        .from("heritage_volunteers")
        .upsert(
          { name, email, phone, affiliation: affiliation || null, source: "heritage-cleanliness" },
          { onConflict: "email" }
        );
      if (dbError) console.error("[heritage-register:db]", dbError.message);
    } catch (e) {
      console.error("[heritage-register:db]", e);
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("[heritage-register] RESEND_API_KEY missing");
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
      subject: `Heritage Cleanliness — new volunteer: ${name}`,
      html: `<!DOCTYPE html><html><body style="margin:0;padding:32px 16px;background:#F4EFE6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:460px;background:#fff;border-top:3px solid #8B1E20;">
<tr><td style="padding:32px 36px 8px;">
<p style="margin:0 0 4px;font-size:9px;letter-spacing:0.3em;text-transform:uppercase;color:#8B1E20;">The Heritage Cleanliness Project</p>
<h1 style="margin:0 0 20px;font-size:20px;font-weight:400;color:#1a1a1a;font-family:Georgia,serif;font-style:italic;">New volunteer registration</h1>
<p style="margin:0 0 6px;font-size:14px;color:#1a1a1a;"><strong>Name:</strong> ${esc(name)}</p>
<p style="margin:0 0 6px;font-size:14px;color:#1a1a1a;"><strong>Email:</strong> ${esc(email)}</p>
<p style="margin:0 0 6px;font-size:14px;color:#1a1a1a;"><strong>Phone:</strong> ${esc(phone)}</p>
${affiliation ? `<p style="margin:0 0 6px;font-size:14px;color:#1a1a1a;"><strong>University / Workplace:</strong> ${esc(affiliation)}</p>` : ""}
</td></tr>
<tr><td style="padding:16px 36px 32px;">
<p style="margin:0;font-size:11px;color:#999;">#NoLitterLegacy — next drive: Sunday 30 August 2026, 4 PM, Sultan Garhi Archaeological Park.</p>
</td></tr></table></td></tr></table></body></html>`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[heritage-register]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again in a moment." },
      { status: 500 }
    );
  }
}
