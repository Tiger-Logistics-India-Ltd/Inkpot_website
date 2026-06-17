export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import crypto from "crypto";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.inkpotindia.com";
const emailEnabled = () => !!process.env.RESEND_API_KEY?.trim();

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

  const { getSupabase } = await import("@/lib/supabase");
  const supabase = getSupabase();

  const { data: ticket, error: fetchError } = await supabase
    .from("living_table_tickets")
    .select("id, payment_status, qty, buyer_name, buyer_email, amount, meal_preferences")
    .eq("id", ticket_id)
    .single();

  if (fetchError || !ticket) {
    return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
  }

  if (ticket.payment_status === "paid") {
    return NextResponse.json({ error: "Ticket is already paid." }, { status: 400 });
  }

  const seats = ticket.qty;

  // Assign the next available seat block (same logic as verify route)
  const { data: existing } = await supabase
    .from("living_table_tickets")
    .select("seat_numbers")
    .in("payment_status", ["paid", "pending"]);

  const allAssigned: number[] = (existing ?? [])
    .flatMap((r: { seat_numbers: number[] }) => r.seat_numbers ?? []);
  const nextSeat = allAssigned.length > 0 ? Math.max(...allAssigned) + 1 : 1;
  const ticketNumber = nextSeat;
  const seatNumbers = Array.from({ length: seats }, (_, i) => nextSeat + i);

  const { error: updateError } = await supabase
    .from("living_table_tickets")
    .update({
      payment_status: "paid",
      ticket_number: ticketNumber,
      seat_numbers: seatNumbers,
      qr_token: crypto.randomUUID(),
    })
    .eq("id", ticket_id);

  if (updateError) {
    console.error("[mark-paid]", updateError);
    return NextResponse.json({ error: "Failed to update ticket." }, { status: 500 });
  }

  // Send confirmation email
  if (emailEnabled()) {
    const { sendTicketConfirmation } = await import("@/lib/email");
    sendTicketConfirmation({
      to: ticket.buyer_email,
      buyerName: ticket.buyer_name,
      ticketNumber,
      seatNumbers,
      qty: seats,
      ticketId: ticket_id,
      amount: ticket.amount,
      siteUrl: SITE_URL,
      mealPreferences: ticket.meal_preferences ?? [],
    }).catch(e => console.error("[mark-paid email]", e));
  }

  console.log("[mark-paid] confirmed:", { ticket_id, ticketNumber, seatNumbers });
  return NextResponse.json({ ok: true, ticket_number: ticketNumber, seat_numbers: seatNumbers });
}
