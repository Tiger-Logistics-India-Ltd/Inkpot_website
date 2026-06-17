export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import crypto from "crypto";

const dbEnabled = () =>
  !!(process.env.SUPABASE_URL?.trim() && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());

const emailEnabled = () => !!process.env.RESEND_API_KEY?.trim();

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.inkpotindia.com";

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      ticket_id,
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !ticket_id) {
      return NextResponse.json({ error: "Missing payment fields." }, { status: 400 });
    }

    // ── 1. Verify Razorpay HMAC signature ────────────────────────────────────
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
    }

    let ticketNumber = 1;
    let seatNumbers: number[] = [1];
    let finalTicketId = ticket_id;
    let seats = 1;
    let resolvedBuyerName = "";
    let resolvedBuyerEmail = "";
    let resolvedAmount = 0;
    let resolvedMeals: string[] = [];

    if (dbEnabled()) {
      const { getSupabase } = await import("@/lib/supabase");
      const supabase = getSupabase();

      // ── 2. Fetch the ticket and verify the order_id matches ──────────────
      // SECURITY: prevents an attacker with a valid payment from marking
      // a different (higher-value) ticket as paid by swapping ticket_id.
      const { data: existingTicket, error: fetchError } = await supabase
        .from("living_table_tickets")
        .select("id, razorpay_order_id, qty, buyer_name, buyer_email, payment_status, amount, ticket_number, seat_numbers, meal_preferences")
        .eq("id", ticket_id)
        .single();

      if (fetchError || !existingTicket) {
        return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
      }

      if (existingTicket.razorpay_order_id !== razorpay_order_id) {
        console.error("[verify] SECURITY: order_id mismatch — possible ticket-swap attempt", {
          ticket_id,
          provided_order_id: razorpay_order_id,
          stored_order_id: existingTicket.razorpay_order_id,
        });
        return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
      }

      // ── 3. Idempotency: already confirmed (e.g. webhook fired twice) ─────
      if (existingTicket.payment_status === "paid") {
        return NextResponse.json({
          ticket: {
            ticketId: existingTicket.id,
            ticketNumber: existingTicket.ticket_number,
            seatNumbers: existingTicket.seat_numbers,
            qty: existingTicket.qty,
            buyerName: existingTicket.buyer_name,
            buyerEmail: existingTicket.buyer_email,
          },
        });
      }

      // ── 4. Use authoritative values from DB — never trust client for these ─
      seats = existingTicket.qty;
      resolvedBuyerName = existingTicket.buyer_name;
      resolvedBuyerEmail = existingTicket.buyer_email;
      resolvedAmount = existingTicket.amount;
      resolvedMeals = existingTicket.meal_preferences ?? [];
      finalTicketId = existingTicket.id;

      // ── 5. Assign seat block ─────────────────────────────────────────────
      const { data: existing } = await supabase
        .from("living_table_tickets")
        .select("seat_numbers")
        .in("payment_status", ["paid", "pending"]);

      const allAssigned: number[] = (existing ?? [])
        .flatMap((r: { seat_numbers: number[] }) => r.seat_numbers ?? []);

      const nextSeat = allAssigned.length > 0 ? Math.max(...allAssigned) + 1 : 1;
      ticketNumber = nextSeat;
      seatNumbers = Array.from({ length: seats }, (_, i) => nextSeat + i);

      // ── 6. Mark paid + assign seats ──────────────────────────────────────
      const { error: updateError } = await supabase
        .from("living_table_tickets")
        .update({
          payment_status: "paid",
          razorpay_payment_id,
          ticket_number: ticketNumber,
          seat_numbers: seatNumbers,
          qr_token: crypto.randomUUID(),
        })
        .eq("id", ticket_id);

      if (updateError) throw updateError;
    }

    // ── 7. Send confirmation email ────────────────────────────────────────────
    const qrImageUrl = `${SITE_URL}/api/qr/${finalTicketId}`;
    if (emailEnabled() && resolvedBuyerEmail) {
      const { sendTicketConfirmation } = await import("@/lib/email");
      sendTicketConfirmation({
        to: resolvedBuyerEmail,
        buyerName: resolvedBuyerName,
        ticketNumber,
        seatNumbers,
        qty: seats,
        qrImageUrl,
        ticketId: finalTicketId,
        amount: resolvedAmount,
        siteUrl: SITE_URL,
        mealPreferences: resolvedMeals,
      }).catch(e => console.error("[email]", e));
    }

    return NextResponse.json({
      ticket: {
        ticketId: finalTicketId,
        ticketNumber,
        seatNumbers,
        qty: seats,
        qrDataUrl,
        buyerName: resolvedBuyerName,
        buyerEmail: resolvedBuyerEmail,
      },
    });
  } catch (err: any) {
    console.error("[verify]", err);
    return NextResponse.json({ error: "Verification failed. Contact info@inkpotindia.com" }, { status: 500 });
  }
}
