export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabase } from "@/lib/supabase";

function auth(req: Request): boolean {
  const pw = req.headers.get("x-admin-password") ?? "";
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!pw || !expected) return false;
  if (pw.length > 256) return false;
  // Constant-time comparison to prevent timing attacks
  const a = Buffer.from(pw.padEnd(128).slice(0, 128));
  const b = Buffer.from(expected.padEnd(128).slice(0, 128));
  return crypto.timingSafeEqual(a, b) && pw.length === expected.length;
}

// GET — fetch all paid tickets (for offline cache)
export async function GET(req: Request) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await getSupabase()
    .from("living_table_tickets")
    .select("id, ticket_number, seat_numbers, buyer_name, qty, payment_status, checked_in, checked_in_at")
    .eq("payment_status", "paid");

  if (error) return NextResponse.json({ error: "DB error" }, { status: 500 });
  return NextResponse.json({ tickets: data ?? [] });
}

// POST — mark ticket as checked in
export async function POST(req: Request) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { ticket_id } = await req.json();
  if (!ticket_id) return NextResponse.json({ error: "ticket_id required" }, { status: 400 });

  const supabase = getSupabase();

  // Fetch ticket first
  const { data: ticket, error: fetchError } = await supabase
    .from("living_table_tickets")
    .select("id, ticket_number, seat_numbers, buyer_name, qty, payment_status, checked_in, checked_in_at")
    .eq("id", ticket_id)
    .single();

  if (fetchError || !ticket) {
    return NextResponse.json({ status: "invalid", message: "Ticket not found." }, { status: 404 });
  }

  if (ticket.payment_status !== "paid") {
    return NextResponse.json({ status: "invalid", message: "Payment not completed.", ticket }, { status: 200 });
  }

  if (ticket.checked_in) {
    return NextResponse.json({ status: "duplicate", message: "Already checked in.", ticket }, { status: 200 });
  }

  // Mark checked in
  const { error: updateError } = await supabase
    .from("living_table_tickets")
    .update({ checked_in: true, checked_in_at: new Date().toISOString() })
    .eq("id", ticket_id);

  if (updateError) return NextResponse.json({ error: "DB update failed" }, { status: 500 });

  return NextResponse.json({ status: "valid", message: "Welcome! Check-in successful.", ticket });
}
