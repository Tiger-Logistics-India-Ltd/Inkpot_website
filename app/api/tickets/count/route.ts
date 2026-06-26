export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const MAX_TICKETS = 30;

export async function GET() {
  try {
    const { count, error } = await getSupabase()
      .from("living_table_tickets")
      .select("*", { count: "exact", head: true })
      .eq("payment_status", "paid");

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
