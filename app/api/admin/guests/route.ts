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

export async function GET(req: Request) {
  if (!auth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabase();

  const [{ data: tickets, error }, { data: stats }] = await Promise.all([
    supabase
      .from("living_table_tickets")
      .select("id, ticket_number, seat_numbers, buyer_name, buyer_email, buyer_phone, qty, amount, payment_status, checked_in, checked_in_at, coupon_code, meal_preferences, archived, notes, created_at")
      .order("ticket_number", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true }),
    supabase.from("living_table_stats").select("*").single(),
  ]);

  if (error) {
    console.error("[admin/guests]", error);
    return NextResponse.json({ error: "Failed to fetch guests." }, { status: 500 });
  }

  return NextResponse.json({ tickets: tickets ?? [], stats: stats ?? { seats_sold: 0, seats_remaining: 100, checked_in_count: 0 } });
}
