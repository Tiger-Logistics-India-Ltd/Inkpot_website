export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabase } from "@/lib/supabase";

function auth(req: Request): boolean {
  const pw = req.headers.get("x-vendor-password") ?? "";
  const expected = process.env.SOTS_VENDOR_PASSWORD ?? "";
  if (!pw || !expected) return false;
  if (pw.length > 256) return false;
  const a = Buffer.from(pw.padEnd(128).slice(0, 128));
  const b = Buffer.from(expected.padEnd(128).slice(0, 128));
  return crypto.timingSafeEqual(a, b) && pw.length === expected.length;
}

export async function GET(req: Request) {
  if (!auth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabase();
  const { data: orders, error } = await supabase
    .from("sots_coffee_orders")
    .select("id, order_number, buyer_name, buyer_phone, session, items, total_qty, amount_paise, coupon_code, served, served_at, created_at")
    .eq("payment_status", "paid")
    .order("order_number", { ascending: true });

  if (error) {
    console.error("[coffee/vendor/orders]", error);
    return NextResponse.json({ error: "Failed to fetch orders." }, { status: 500 });
  }

  return NextResponse.json({ orders: orders ?? [] });
}
