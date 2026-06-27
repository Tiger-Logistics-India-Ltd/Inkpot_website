export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";

const PRICE_PAISE = 650000; // ₹6,500
const MAX_TICKETS = 30;
const SOLD_OUT = true;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.inkpotindia.com";

const dbEnabled = () =>
  !!(process.env.SUPABASE_URL?.trim() && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());

const emailEnabled = () => !!process.env.RESEND_API_KEY?.trim();

export async function POST(req: Request) {
  if (SOLD_OUT) {
    return NextResponse.json({ error: "Bookings are now closed. All seats are taken." }, { status: 400 });
  }
  try {
    const { name, email, phone, qty = 1, coupon_code, meals = [], terms_accepted } = await req.json();

    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    if (terms_accepted !== true) {
      return NextResponse.json({ error: "You must accept the Terms & Conditions to proceed." }, { status: 400 });
    }
    // Basic format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (!/^[+\d\s\-().]{7,20}$/.test(phone.trim())) {
      return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
    }
    // Whitelist meal values — never store arbitrary client strings
    const VALID_MEALS = ["veg", "non-veg"];
    const safeMeals = Array.isArray(meals)
      ? (meals as unknown[]).filter((m): m is string => VALID_MEALS.includes(m as string))
      : [];
    const seats = Math.min(Math.max(1, parseInt(qty) || 1), 8);
    let totalPaise = PRICE_PAISE * seats;
    let discountPaise = 0;
    let appliedCoupon: string | null = null;
    let couponId: string | null = null;
    let couponUsesCount = 0;

    // ── Coupon validation (no increment yet) ─────────────────────────────────
    if (coupon_code?.trim() && dbEnabled()) {
      const { getSupabase } = await import("@/lib/supabase");
      const supabase = getSupabase();
      const { data: coupon } = await supabase
        .from("living_table_coupons")
        .select("*")
        .eq("code", coupon_code.trim().toUpperCase())
        .eq("active", true)
        .single();

      if (!coupon) {
        return NextResponse.json({ error: "Invalid coupon code." }, { status: 400 });
      }
      if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        return NextResponse.json({ error: "This coupon has expired." }, { status: 400 });
      }
      if (coupon.uses_count >= coupon.max_uses) {
        return NextResponse.json({ error: "This coupon has already been used." }, { status: 400 });
      }

      discountPaise = coupon.discount_type === "percent"
        ? Math.round(totalPaise * coupon.discount_value / 100)
        : coupon.discount_value * 100;

      totalPaise = Math.max(0, totalPaise - discountPaise);
      appliedCoupon = coupon.code;
      couponId = coupon.id;
      couponUsesCount = coupon.uses_count;
    }

    // ── Availability check ───────────────────────────────────────────────────
    if (dbEnabled()) {
      const { getSupabase } = await import("@/lib/supabase");
      const supabase = getSupabase();
      const { count, error: countError } = await supabase
        .from("living_table_tickets")
        .select("*", { count: "exact", head: true })
        .in("payment_status", ["paid", "pending"])
        .eq("archived", false);
      if (countError) throw countError;
      if ((count ?? 0) + seats > MAX_TICKETS) {
        return NextResponse.json({ error: "Not enough seats remaining." }, { status: 400 });
      }
      // Per-email cap — prevents one person draining all inventory
      const { data: emailTickets } = await supabase
        .from("living_table_tickets")
        .select("qty")
        .eq("buyer_email", email.trim().toLowerCase())
        .in("payment_status", ["paid", "pending"]);
      const alreadyBooked = (emailTickets ?? []).reduce((s: number, t: { qty: number }) => s + (t.qty || 0), 0);
      if (alreadyBooked + seats > 8) {
        return NextResponse.json({ error: "You've already booked the maximum of 8 seats with this email." }, { status: 400 });
      }
    }

    // ── FREE BOOKING (100% coupon — skip Razorpay entirely) ──────────────────
    if (totalPaise === 0 && dbEnabled()) {
      const { getSupabase } = await import("@/lib/supabase");
      const supabase = getSupabase();

      // Assign seat block
      const { data: existing } = await supabase
        .from("living_table_tickets")
        .select("seat_numbers")
        .in("payment_status", ["paid", "pending"]);

      const allAssigned: number[] = (existing ?? [])
        .flatMap((r: { seat_numbers: number[] }) => r.seat_numbers ?? []);
      const nextSeat = allAssigned.length > 0 ? Math.max(...allAssigned) + 1 : 1;
      const ticketNumber = nextSeat;
      const seatNumbers = Array.from({ length: seats }, (_, i) => nextSeat + i);
      const qrToken = crypto.randomUUID();

      // Insert ticket as paid directly
      const { data: ticket, error: insertError } = await supabase
        .from("living_table_tickets")
        .insert({
          buyer_name: name.trim(),
          buyer_email: email.trim().toLowerCase(),
          buyer_phone: phone.trim(),
          razorpay_order_id: `free_${Date.now()}`,
          payment_status: "paid",
          amount: 0,
          qty: seats,
          coupon_code: appliedCoupon,
          discount_amount: discountPaise,
          ticket_number: ticketNumber,
          seat_numbers: seatNumbers,
          qr_token: qrToken,
          meal_preferences: safeMeals,
          terms_accepted_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (insertError) throw insertError;

      // Atomic coupon increment — conditional on uses_count not having changed
      // since we read it (prevents race condition where 2 concurrent requests
      // both pass the uses_count check before either increments)
      if (couponId) {
        const { data: updated } = await supabase
          .from("living_table_coupons")
          .update({ uses_count: couponUsesCount + 1 })
          .eq("id", couponId)
          .eq("uses_count", couponUsesCount)
          .select("id");
        if (!updated || updated.length === 0) {
          return NextResponse.json({ error: "This coupon has already been used." }, { status: 400 });
        }
      }

      // Send confirmation email
      if (emailEnabled()) {
        const { sendTicketConfirmation } = await import("@/lib/email");
        sendTicketConfirmation({
          to: email.trim().toLowerCase(),
          buyerName: name.trim(),
          ticketNumber,
          seatNumbers,
          qty: seats,
          ticketId: ticket.id,
          amount: 0,
          siteUrl: SITE_URL,
        }).catch(e => console.error("[email]", e));
      }

      return NextResponse.json({
        free: true,
        ticket: {
          ticketId: ticket.id,
          ticketNumber,
          seatNumbers,
          qty: seats,
          buyerName: name.trim(),
          buyerEmail: email.trim().toLowerCase(),
        },
      });
    }

    // ── PAID BOOKING — create Razorpay order ─────────────────────────────────
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Payment service not configured." }, { status: 503 });
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({
      amount: totalPaise,
      currency: "INR",
      receipt: `tlt_${Date.now()}`,
    });

    // ── Create pending ticket ─────────────────────────────────────────────────
    let ticketId = `tmp_${Date.now()}`;
    if (dbEnabled()) {
      const { getSupabase } = await import("@/lib/supabase");
      const supabase = getSupabase();
      const { data: ticket, error: insertError } = await supabase
        .from("living_table_tickets")
        .insert({
          buyer_name: name.trim(),
          buyer_email: email.trim().toLowerCase(),
          buyer_phone: phone.trim(),
          razorpay_order_id: order.id,
          payment_status: "pending",
          amount: totalPaise,
          qty: seats,
          coupon_code: appliedCoupon,
          discount_amount: discountPaise,
          meal_preferences: safeMeals,
          terms_accepted_at: new Date().toISOString(),
        })
        .select("id")
        .single();
      if (insertError) throw insertError;
      ticketId = ticket.id;
      // Coupon increment is deferred to verify route (after payment confirmed)
      // to avoid permanently burning a slot if payment is abandoned.
    }

    return NextResponse.json({
      order_id: order.id,
      amount: totalPaise,
      key_id: keyId,
      ticket_id: ticketId,
      discount_paise: discountPaise,
      coupon_applied: appliedCoupon,
    });

  } catch (err: any) {
    console.error("[create-order]", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
