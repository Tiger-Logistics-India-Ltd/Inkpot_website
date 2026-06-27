export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.inkpotindia.com";

export async function POST(req: Request) {
  const password = req.headers.get("x-admin-password");
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { test_email } = await req.json().catch(() => ({}));

  const { getSupabase } = await import("@/lib/supabase");
  const { sendGuidelines } = await import("@/lib/email");
  const supabase = getSupabase();

  const { data: tickets, error } = await supabase
    .from("living_table_tickets")
    .select("id, buyer_name, buyer_email")
    .eq("payment_status", "paid")
    .eq("archived", false)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!tickets?.length) return NextResponse.json({ error: "No paid tickets found." }, { status: 400 });

  // Test mode — send one email to the provided address using the first ticket's QR
  if (test_email) {
    const first = tickets[0];
    try {
      await sendGuidelines({ to: test_email, buyerName: first.buyer_name, ticketId: first.id, siteUrl: SITE_URL });
      return NextResponse.json({ sent: 1, test: true, to: test_email });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  // Bulk send — one per ticket, collect results
  let sent = 0;
  const failures: string[] = [];

  for (const ticket of tickets) {
    try {
      await sendGuidelines({ to: ticket.buyer_email, buyerName: ticket.buyer_name, ticketId: ticket.id, siteUrl: SITE_URL });
      sent++;
    } catch (e: any) {
      failures.push(`${ticket.buyer_email}: ${e.message}`);
    }
  }

  return NextResponse.json({ sent, failed: failures.length, total: tickets.length, failures });
}
