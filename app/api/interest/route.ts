export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabase } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NOTIFY_TO = ["saurav.chaudhary70@gmail.com", "info@inkpotindia.com"];

// Fire-and-forget notification — must never affect the signup response
async function notify(name: string, email: string, phone: string) {
  if (!process.env.RESEND_API_KEY) return;
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  try {
    await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: "Inkpot India <tickets@tickets.inkpotindia.com>",
      to: NOTIFY_TO,
      replyTo: email,
      subject: `New interest — ${name}`,
      html: `<!DOCTYPE html><html><body style="margin:0;padding:32px 16px;background:#F4EFE6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:460px;background:#fff;border-top:3px solid #901A1C;">
<tr><td style="padding:32px 36px 8px;">
<p style="margin:0 0 4px;font-size:9px;letter-spacing:0.3em;text-transform:uppercase;color:#901A1C;">The Living Table</p>
<h1 style="margin:0 0 20px;font-size:20px;font-weight:400;color:#1a1a1a;font-family:Georgia,serif;font-style:italic;">New Register-Your-Interest signup</h1>
<p style="margin:0 0 6px;font-size:14px;color:#1a1a1a;"><strong>Name:</strong> ${esc(name)}</p>
<p style="margin:0 0 6px;font-size:14px;color:#1a1a1a;"><strong>Email:</strong> ${esc(email)}</p>
<p style="margin:0 0 6px;font-size:14px;color:#1a1a1a;"><strong>Phone:</strong> ${esc(phone)}</p>
</td></tr>
<tr><td style="padding:16px 36px 32px;">
<p style="margin:0;font-size:11px;color:#999;">Also saved to the Interest list in your admin dashboard.</p>
</td></tr></table></td></tr></table></body></html>`,
    });
  } catch (e) {
    console.error("[interest:notify]", e);
  }
}

// Captures "Register Your Interest" signups for the next edition of The Living Table.
// Requires the `living_table_interest` table — see supabase/create_interest_table.sql
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const name  = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";

    if (!name || name.length > 120) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }
    if (!EMAIL_RE.test(email) || email.length > 200) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (!phone || phone.replace(/[^0-9]/g, "").length < 7 || phone.length > 30) {
      return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
    }

    const { error } = await getSupabase()
      .from("living_table_interest")
      .upsert(
        { name, email, phone, source: "the-living-table" },
        { onConflict: "email" }
      );

    if (error) throw error;

    await notify(name, email, phone);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[interest]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again in a moment." },
      { status: 500 }
    );
  }
}
