export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import crypto from "crypto";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.inkpotindia.com";
const TEST_EMAIL = "saurav.chaudhary70@gmail.com";
const TEST_NAME  = "Saurav Chaudhary";

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

  // Find or create a permanent dummy test ticket (archived, never counts toward cap)
  let testTicket: { id: string; buyer_name: string } | null = null;

  const { data: existing } = await supabase
    .from("living_table_tickets")
    .select("id, buyer_name")
    .eq("buyer_email", TEST_EMAIL)
    .eq("payment_status", "paid")
    .eq("archived", true)
    .order("created_at", { ascending: true })
    .limit(1);

  if (existing?.length) {
    testTicket = existing[0];
  } else {
    // Create dummy ticket and immediately archive it
    const { data: created, error: insertError } = await supabase
      .from("living_table_tickets")
      .insert({
        buyer_name: TEST_NAME,
        buyer_email: TEST_EMAIL,
        buyer_phone: "+910000000000",
        razorpay_order_id: "test_dummy",
        payment_status: "paid",
        archived: true,
        amount: 0,
        qty: 1,
        seat_numbers: [],
        qr_token: crypto.randomUUID(),
        notes: "Dummy ticket for scanner testing — safe to scan",
      })
      .select("id, buyer_name")
      .single();

    if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
    testTicket = created;
  }

  await sendQrTest({
    to: email.trim(),
    buyerName: testTicket.buyer_name,
    ticketId: testTicket.id,
    siteUrl: SITE_URL,
  });

  return NextResponse.json({ ok: true, to: email.trim(), ticketId: testTicket.id });
}
