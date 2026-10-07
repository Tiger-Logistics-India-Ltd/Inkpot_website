export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import type { CartLine } from "@/lib/sotsCoffee";
import { priceOrderServer } from "@/lib/sotsCoffeeServer";

/**
 * Lets the client show an accurate price preview (including internal codes
 * like RUPEE1) without ever shipping those codes' logic into the browser
 * bundle. Pure computation, no DB write, no session/capacity checks —
 * create-order remains the only authoritative, order-creating endpoint.
 */
export async function POST(req: Request) {
  try {
    const { items, coupon_code } = await req.json();
    const cart: CartLine[] = Array.isArray(items)
      ? items
          .filter((i: any) => i && typeof i.id === "string" && Number.isFinite(i.qty) && i.qty > 0)
          .map((i: any) => ({ id: i.id, qty: Math.floor(i.qty) }))
      : [];
    const priced = priceOrderServer(cart, coupon_code);
    return NextResponse.json(priced);
  } catch (err) {
    console.error("[coffee/price-preview]", err);
    return NextResponse.json({ error: "Failed to price order." }, { status: 500 });
  }
}
