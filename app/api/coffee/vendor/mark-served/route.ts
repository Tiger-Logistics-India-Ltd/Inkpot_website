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

export async function POST(req: Request) {
  if (!auth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { order_id } = await req.json();
  if (!order_id) {
    return NextResponse.json({ error: "order_id required" }, { status: 400 });
  }

  const supabase = getSupabase();

  const { data: order, error: fetchError } = await supabase
    .from("sots_coffee_orders")
    .select("id, payment_status, served")
    .eq("id", order_id)
    .single();

  if (fetchError || !order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
  if (order.payment_status !== "paid") {
    return NextResponse.json({ error: "Order is not paid." }, { status: 400 });
  }

  // Idempotent — re-marking an already-served order just succeeds, so a
  // flaky connection retry on a tablet never surfaces a scary error.
  if (!order.served) {
    const { error: updateError } = await supabase
      .from("sots_coffee_orders")
      .update({ served: true, served_at: new Date().toISOString() })
      .eq("id", order_id);
    if (updateError) {
      console.error("[coffee/vendor/mark-served]", updateError);
      return NextResponse.json({ error: "Failed to update order." }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
