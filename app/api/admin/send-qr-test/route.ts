export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.inkpotindia.com";

export async function POST(req: Request) {
  const password = req.headers.get("x-admin-password");
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email } = await req.json().catch(() => ({}));
  if (!email?.trim()) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const { getSupabase } = await import("@/lib/supabase");
  const { sendQrTest } = await import("@/lib/email");
  const supabase = getSupabase();

  // Pick the first paid non-archived ticket to generate a real scannable QR
  const { data: tickets, error } = await supabase
    .from("living_table_tickets")
    .select("id, buyer_name")
    .eq("payment_status", "paid")
    .eq("archived", false)
    .order("created_at", { ascending: true })
    .limit(1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!tickets?.length) return NextResponse.json({ error: "No paid tickets found to generate a QR." }, { status: 400 });

  const ticket = tickets[0];
  await sendQrTest({
    to: email.trim(),
    buyerName: ticket.buyer_name,
    ticketId: ticket.id,
    siteUrl: SITE_URL,
  });

  return NextResponse.json({ ok: true, to: email.trim() });
}
