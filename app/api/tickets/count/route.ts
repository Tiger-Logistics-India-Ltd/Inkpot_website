export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const MAX_TICKETS = 30;
const SOLD_OUT = true;

export async function GET() {
  if (SOLD_OUT) {
    return NextResponse.json({ sold: MAX_TICKETS, total: MAX_TICKETS, available: 0 });
  }
  try {
    const { count, error } = await getSupabase()
      .from("living_table_tickets")
      .select("*", { count: "exact", head: true })
      .eq("payment_status", "paid")
      .eq("archived", false);

    if (error) throw error;

    return NextResponse.json({
      sold: count ?? 0,
      total: MAX_TICKETS,
      available: Math.max(0, MAX_TICKETS - (count ?? 0)),
    });
  } catch (err: any) {
    console.error("[count]", err);
    return NextResponse.json({ sold: 0, total: MAX_TICKETS, available: MAX_TICKETS }, { status: 200 });
  }
}
