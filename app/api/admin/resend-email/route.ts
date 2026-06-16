export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import crypto from "crypto";
import QRCode from "qrcode";
import { getSupabase } from "@/lib/supabase";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.inkpotindia.com";

function auth(req: Request): boolean {
  const pw = req.headers.get("x-admin-password") ?? "";
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!pw || !expected) return false;
  const a = Buffer.from(pw.padEnd(128).slice(0, 128));
  const b = Buffer.from(expected.padEnd(128).slice(0, 128));
  return crypto.timingSafeEqual(a, b) && pw.length === expected.length;
}

export async function POST(req: Request) {
  if (!auth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ticket_id } = await req.json();
  if (!ticket_id) {
    return NextResponse.json({ error: "ticket_id required" }, { status: 400 });
  }

  const supabase = getSupabase();

  const { data: ticket, error } = await supabase
    .from("living_table_tickets")
    .select("id, ticket_number, seat_numbers, qty, buyer_name, buyer_email, amount, payment_status, meal_preferences")
    .eq("id", ticket_id)
    .single();

  if (error || !ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  if (ticket.payment_status !== "paid") {
    return NextResponse.json({ error: "Ticket is not paid — cannot resend" }, { status: 400 });
  }

  const qrContent = `${SITE_URL}/ticket/${ticket.id}`;
  const qrDataUrl = await QRCode.toDataURL(qrContent, {
    width: 400,
    margin: 2,
    color: { dark: "#1a1a1a", light: "#ffffff" },
  });

  const { sendTicketConfirmation } = await import("@/lib/email");
  await sendTicketConfirmation({
    to: ticket.buyer_email,
    buyerName: ticket.buyer_name,
    ticketNumber: ticket.ticket_number,
    seatNumbers: ticket.seat_numbers,
    qty: ticket.qty,
    qrDataUrl,
    ticketId: ticket.id,
    amount: ticket.amount,
    siteUrl: SITE_URL,
    mealPreferences: ticket.meal_preferences ?? [],
  });

  return NextResponse.json({ ok: true, sent_to: ticket.buyer_email });
}
