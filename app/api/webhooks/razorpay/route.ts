export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import crypto from "crypto";
import QRCode from "qrcode";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.inkpotindia.com";
const emailEnabled = () => !!process.env.RESEND_API_KEY?.trim();
const dbEnabled = () => !!(process.env.SUPABASE_URL?.trim() && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());

export async function POST(req: Request) {
  // Read raw body first — needed for HMAC signature verification
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET ?? "";

  if (!secret) {
    console.error("[webhook/razorpay] RAZORPAY_WEBHOOK_SECRET env var not set");
    return NextResponse.json({ error: "Webhook not configured." }, { status: 500 });
  }

  // Verify Razorpay HMAC signature
  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  if (expectedSig !== signature) {
    console.error("[webhook/razorpay] Invalid signature — possible forged request");
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  // Only act on payment.captured — everything else is a no-op
  if (event?.event !== "payment.captured") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  if (!dbEnabled()) {
    return NextResponse.json({ ok: true, db_disabled: true });
  }

  const payment = event?.payload?.payment?.entity;
  const orderId = payment?.order_id as string | undefined;
  const paymentId = payment?.id as string | undefined;

  if (!orderId || !paymentId) {
    console.error("[webhook/razorpay] Missing order_id or payment_id in payload");
    return NextResponse.json({ error: "Missing payment fields." }, { status: 400 });
  }

  const { getSupabase } = await import("@/lib/supabase");
  const supabase = getSupabase();

  // Find the ticket by Razorpay order_id
  const { data: ticket, error: fetchError } = await supabase
    .from("living_table_tickets")
    .select("id, payment_status, qty, buyer_name, buyer_email, amount, meal_preferences")
    .eq("razorpay_order_id", orderId)
    .single();

  if (fetchError || !ticket) {
    // Could be a test payment or order from a different system — log and ignore
    console.warn("[webhook/razorpay] No ticket found for order_id:", orderId);
    return NextResponse.json({ ok: true, not_found: true });
  }

  // Idempotency: already processed (e.g. client-side verify already ran)
  if (ticket.payment_status === "paid") {
    return NextResponse.json({ ok: true, already_paid: true });
  }

  const seats = ticket.qty;

  // Assign next available seat block
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
      razorpay_payment_id: paymentId,
      ticket_number: ticketNumber,
      seat_numbers: seatNumbers,
      qr_token: crypto.randomUUID(),
    })
    .eq("id", ticket.id);

  if (updateError) {
    console.error("[webhook/razorpay] DB update failed:", updateError);
    // Return 500 so Razorpay retries the webhook
    return NextResponse.json({ error: "DB update failed." }, { status: 500 });
  }

  // Generate QR and send confirmation email
  const qrContent = `${SITE_URL}/ticket/${ticket.id}`;
  const qrDataUrl = await QRCode.toDataURL(qrContent, {
    width: 400, margin: 2,
    color: { dark: "#1a1a1a", light: "#ffffff" },
  });

  if (emailEnabled()) {
    const { sendTicketConfirmation } = await import("@/lib/email");
    sendTicketConfirmation({
      to: ticket.buyer_email,
      buyerName: ticket.buyer_name,
      ticketNumber,
      seatNumbers,
      qty: seats,
      qrDataUrl,
      ticketId: ticket.id,
      amount: ticket.amount,
      siteUrl: SITE_URL,
      mealPreferences: ticket.meal_preferences ?? [],
    }).catch(e => console.error("[webhook/razorpay email]", e));
  }

  console.log("[webhook/razorpay] payment.captured processed:", { orderId, paymentId, ticketNumber, seatNumbers });
  return NextResponse.json({ ok: true });
}
