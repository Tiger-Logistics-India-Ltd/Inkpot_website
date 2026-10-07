export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getSupabase } from "@/lib/supabase";
import { getMenuItem, COFFEE_PROMO, CAPS, isActiveSession, type CartLine } from "@/lib/sotsCoffee";
import { priceOrderServer, COFFEE_TEST_PROMO } from "@/lib/sotsCoffeeServer";

export async function POST(req: Request) {
  try {
    const { name, phone, items, coupon_code, session } = await req.json();

    if (!isActiveSession(session)) {
      return NextResponse.json({ error: "Orders aren't open for that session yet." }, { status: 400 });
    }
    if (!name?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: "Name and phone are required." }, { status: 400 });
    }
    if (!/^[+\d\s\-().]{7,20}$/.test(phone.trim())) {
      return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    const cart: CartLine[] = items
      .filter((i: any) => i && typeof i.id === "string" && Number.isFinite(i.qty) && i.qty > 0)
      .map((i: any) => ({ id: i.id, qty: Math.floor(i.qty) }));

    if (cart.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    // Every item must exist AND (if food) belong to this session.
    for (const line of cart) {
      const item = getMenuItem(line.id);
      if (!item) {
        return NextResponse.json({ error: "Unknown item in cart." }, { status: 400 });
      }
      if (item.category === "food" && item.session !== session) {
        return NextResponse.json({ error: `${item.name} isn't on the menu for this session.` }, { status: 400 });
      }
    }

    // Server-authoritative pricing — never trust a client-sent total.
    const priced = priceOrderServer(cart, coupon_code);
    if (priced.lines.length === 0) {
      return NextResponse.json({ error: "Unknown item in cart." }, { status: 400 });
    }

    const dbEnabled = !!(process.env.SUPABASE_URL?.trim() && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
    if (!dbEnabled) {
      return NextResponse.json({ error: "Ordering is temporarily unavailable. Please try again shortly." }, { status: 503 });
    }
    const supabase = getSupabase();

    // ── Hard cap on the internal RUPEE1 test code (global, not per-session) ──
    if (priced.testOverride) {
      const { count: testUses, error: testCountError } = await supabase
        .from("sots_coffee_orders")
        .select("id", { count: "exact", head: true })
        .eq("coupon_code", COFFEE_TEST_PROMO.code)
        .in("payment_status", ["paid", "pending"]);
      if (testCountError) throw testCountError;
      if ((testUses ?? 0) >= COFFEE_TEST_PROMO.maxUses) {
        return NextResponse.json({ error: "Test code limit reached." }, { status: 400 });
      }
    }

    // ── Capacity check — coffee is one shared pool per session, each food
    //    item has its own pool. Counts paid + pending (same tradeoff as the
    //    Living Table ticketing system's capacity check). ────────────────
    const { data: sessionOrders, error: availError } = await supabase
      .from("sots_coffee_orders")
      .select("items")
      .eq("session", session)
      .in("payment_status", ["paid", "pending"]);
    if (availError) throw availError;

    const soldByItem: Record<string, number> = {};
    for (const o of sessionOrders ?? []) {
      for (const it of (o.items as { id: string; qty: number }[]) ?? []) {
        soldByItem[it.id] = (soldByItem[it.id] ?? 0) + it.qty;
      }
    }

    const coffeeQtyInCart = priced.lines.filter(l => l.category === "coffee").reduce((s, l) => s + l.qty, 0);
    if (coffeeQtyInCart > 0) {
      const coffeeIds = ["hot-americano", "hot-latte", "iced-americano", "iced-latte"];
      const coffeeSold = coffeeIds.reduce((s, id) => s + (soldByItem[id] ?? 0), 0);
      if (coffeeSold + coffeeQtyInCart > CAPS.coffeePerSession) {
        return NextResponse.json({ error: "Coffee is sold out for this session." }, { status: 400 });
      }
    }
    for (const line of priced.lines) {
      if (line.category !== "food") continue;
      const sold = soldByItem[line.id] ?? 0;
      if (sold + line.qty > CAPS.foodPerItem) {
        return NextResponse.json({ error: `${line.name} is sold out for this session.` }, { status: 400 });
      }
    }

    const normalizedCode = coupon_code?.trim().toUpperCase();
    const appliedCoupon =
      normalizedCode === COFFEE_TEST_PROMO.code ? COFFEE_TEST_PROMO.code :
      normalizedCode === COFFEE_PROMO.code ? COFFEE_PROMO.code : null;
    const originalPaise = priced.originalTotalRupees * 100;
    const discountPaise = priced.discountRupees * 100;
    const payablePaise = priced.payableTotalRupees * 100;

    const itemsSnapshot = priced.lines.map(l => ({
      id: l.id, name: l.name, qty: l.qty, unit_price_paise: l.unitPriceRupees * 100, free_qty: l.freeQty,
    }));

    // ── FREE ORDER (promo covers the full cart) — skip Razorpay entirely ──
    if (payablePaise === 0) {
      const { data: order, error: insertError } = await supabase
        .from("sots_coffee_orders")
        .insert({
          buyer_name: name.trim(),
          buyer_phone: phone.trim(),
          session,
          items: itemsSnapshot,
          total_qty: priced.totalQty,
          amount_paise: 0,
          original_amount_paise: originalPaise,
          discount_paise: discountPaise,
          coupon_code: appliedCoupon,
          payment_status: "paid",
        })
        .select("id, order_number")
        .single();

      if (insertError) throw insertError;

      return NextResponse.json({
        free: true,
        order: {
          orderId: order.id,
          orderNumber: order.order_number,
          buyerName: name.trim(),
          items: itemsSnapshot,
          totalQty: priced.totalQty,
        },
      });
    }

    // ── PAID ORDER — create Razorpay order ──────────────────────────────
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Payment service not configured." }, { status: 503 });
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const rpOrder = await razorpay.orders.create({
      amount: payablePaise,
      currency: "INR",
      receipt: `sots_coffee_${Date.now()}`,
      notes: { event: "songs-of-the-stone-coffee", session },
    });

    const { data: order, error: insertError } = await supabase
      .from("sots_coffee_orders")
      .insert({
        buyer_name: name.trim(),
        buyer_phone: phone.trim(),
        session,
        items: itemsSnapshot,
        total_qty: priced.totalQty,
        amount_paise: payablePaise,
        original_amount_paise: originalPaise,
        discount_paise: discountPaise,
        coupon_code: appliedCoupon,
        razorpay_order_id: rpOrder.id,
        payment_status: "pending",
      })
      .select("id")
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({
      order_id: rpOrder.id,
      amount: payablePaise,
      key_id: keyId,
      coffee_order_id: order.id,
      discount_paise: discountPaise,
    });
  } catch (err: any) {
    console.error("[coffee/create-order]", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
