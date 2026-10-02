export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, coffee_order_id } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !coffee_order_id) {
      return NextResponse.json({ error: "Missing payment fields." }, { status: 400 });
    }

    // ── 1. Verify Razorpay HMAC signature ──────────────────────────────
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    let signaturesMatch = false;
    try {
      signaturesMatch = crypto.timingSafeEqual(
        Buffer.from(expectedSignature, "hex"),
        Buffer.from(razorpay_signature, "hex"),
      );
    } catch {
      signaturesMatch = false;
    }
    if (!signaturesMatch) {
      return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
    }

    const supabase = getSupabase();

    // ── 2. Fetch the order and verify the order_id matches ─────────────
    // SECURITY: prevents an attacker with a valid payment from marking a
    // different (higher-value) order as paid by swapping coffee_order_id.
    const { data: existing, error: fetchError } = await supabase
      .from("sots_coffee_orders")
      .select("id, buyer_name, items, total_qty, razorpay_order_id, payment_status, order_number")
      .eq("id", coffee_order_id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
    }
    if (existing.razorpay_order_id !== razorpay_order_id) {
      console.error("[coffee/verify] SECURITY: order_id mismatch — possible swap attempt", {
        coffee_order_id, provided_order_id: razorpay_order_id, stored_order_id: existing.razorpay_order_id,
      });
      return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
    }

    // ── 3. Idempotency ──────────────────────────────────────────────────
    if (existing.payment_status === "paid") {
      return NextResponse.json({
        order: { orderId: existing.id, orderNumber: existing.order_number, buyerName: existing.buyer_name, items: existing.items, totalQty: existing.total_qty },
      });
    }

    // ── 4. Mark paid ─────────────────────────────────────────────────────
    const { error: updateError } = await supabase
      .from("sots_coffee_orders")
      .update({ payment_status: "paid", razorpay_payment_id })
      .eq("id", coffee_order_id);

    if (updateError) throw updateError;

    return NextResponse.json({
      order: { orderId: existing.id, orderNumber: existing.order_number, buyerName: existing.buyer_name, items: existing.items, totalQty: existing.total_qty },
    });
  } catch (err: any) {
    console.error("[coffee/verify]", err);
    return NextResponse.json({ error: "Verification failed. Please show this screen to the coffee counter." }, { status: 500 });
  }
}
