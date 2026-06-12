export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import crypto from "crypto";
import QRCode from "qrcode";

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
      buyer_name,
      buyer_email,
      qty = 1,
      amount,
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment fields." }, { status: 400 });
    }

    // ── Verify Razorpay signature ─────────────────────────────────────────────
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
    }

    const seats = Math.min(Math.max(1, parseInt(qty) || 1), 8);

    // ── Assign seat numbers + generate QR ────────────────────────────────────
    let ticketNumber = 1;
    let seatNumbers: number[] = [1];
    let finalTicketId = ticket_id ?? `tmp_${Date.now()}`;
    let qrToken = crypto.randomUUID();

    if (dbEnabled()) {
      const { getSupabase } = await import("@/lib/supabase");
      const supabase = getSupabase();

      // Get next available seat block (count all paid + pending to avoid gaps)
      const { data: existing } = await supabase
        .from("living_table_tickets")
        .select("seat_numbers")
        .in("payment_status", ["paid", "pending"]);

      const allAssigned: number[] = (existing ?? [])
        .flatMap((r: { seat_numbers: number[] }) => r.seat_numbers ?? []);

      const nextSeat = allAssigned.length > 0 ? Math.max(...allAssigned) + 1 : 1;
      ticketNumber = nextSeat;
      seatNumbers = Array.from({ length: seats }, (_, i) => nextSeat + i);

      // Update ticket: paid + seat numbers + qr_token
      const { data: updated, error: updateError } = await supabase
        .from("living_table_tickets")
        .update({
          payment_status: "paid",
          razorpay_payment_id,
          ticket_number: ticketNumber,
          seat_numbers: seatNumbers,
          qty: seats,
          qr_token: qrToken,
        })
        .eq("id", ticket_id)
        .select()
        .single();

      if (updateError) throw updateError;
      finalTicketId = updated.id;
      qrToken = updated.qr_token;
    }

    // ── Generate QR code (server-side, embedded as base64) ───────────────────
    const qrContent = `${SITE_URL}/ticket/${finalTicketId}`;
    const qrDataUrl = await QRCode.toDataURL(qrContent, {
      width: 400,
      margin: 2,
      color: { dark: "#1a1a1a", light: "#ffffff" },
    });

    // ── Send confirmation email ───────────────────────────────────────────────
    if (emailEnabled()) {
      const { sendTicketConfirmation } = await import("@/lib/email");
      sendTicketConfirmation({
        to: buyer_email,
        buyerName: buyer_name,
        ticketNumber,
        seatNumbers,
        qty: seats,
        qrDataUrl,
        ticketId: finalTicketId,
        amount: amount ?? 650000 * seats,
        siteUrl: SITE_URL,
      }).catch(e => console.error("[email]", e));
    }

    return NextResponse.json({
      ticket: {
        ticketId: finalTicketId,
        ticketNumber,
        seatNumbers,
        qty: seats,
        qrDataUrl,
        buyerName: buyer_name,
        buyerEmail: buyer_email,
      },
    });
  } catch (err: any) {
    console.error("[verify]", err);
    return NextResponse.json({ error: "Verification failed. Contact info@inkpotindia.com" }, { status: 500 });
  }
}
