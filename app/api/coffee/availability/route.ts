export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { MENU_ITEMS, CAPS, isSessionId } from "@/lib/sotsCoffee";

export async function GET(req: Request) {
  const session = new URL(req.url).searchParams.get("session");
  if (!isSessionId(session)) {
    return NextResponse.json({ error: "Unknown session." }, { status: 400 });
  }

  const supabase = getSupabase();
  const { data: orders, error } = await supabase
    .from("sots_coffee_orders")
    .select("items")
    .eq("session", session)
    .in("payment_status", ["paid", "pending"]);

  if (error) {
    console.error("[coffee/availability]", error);
    return NextResponse.json({ error: "Failed to check availability." }, { status: 500 });
  }

  const soldByItem: Record<string, number> = {};
  for (const o of orders ?? []) {
    for (const it of (o.items as { id: string; qty: number }[]) ?? []) {
      soldByItem[it.id] = (soldByItem[it.id] ?? 0) + it.qty;
    }
  }

  const coffeeIds = MENU_ITEMS.filter(i => i.category === "coffee").map(i => i.id);
  const coffeeSold = coffeeIds.reduce((s, id) => s + (soldByItem[id] ?? 0), 0);

  const foodItems = MENU_ITEMS.filter(i => i.category === "food" && i.session === session);
  const food: Record<string, { sold: number; cap: number; available: number }> = {};
  for (const item of foodItems) {
    const sold = soldByItem[item.id] ?? 0;
    food[item.id] = { sold, cap: CAPS.foodPerItem, available: Math.max(0, CAPS.foodPerItem - sold) };
  }

  return NextResponse.json({
    session,
    coffee: { sold: coffeeSold, cap: CAPS.coffeePerSession, available: Math.max(0, CAPS.coffeePerSession - coffeeSold) },
    food,
  });
}
