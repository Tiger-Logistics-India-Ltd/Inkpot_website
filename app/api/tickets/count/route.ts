export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getEdition } from "@/lib/editions";

export async function GET(req: Request) {
  // Edition comes from ?edition= ; unknown/absent falls back to the inaugural
  // edition, which keeps the existing archive page working unchanged.
  const slug = new URL(req.url).searchParams.get("edition");
  const edition = getEdition(slug);
  const { maxTickets: MAX_TICKETS, soldOut } = edition;

  if (soldOut) {
    return NextResponse.json({ sold: MAX_TICKETS, total: MAX_TICKETS, available: 0 });
  }
  try {
    const { count, error } = await getSupabase()
      .from("living_table_tickets")
      .select("*", { count: "exact", head: true })
      .eq("edition", edition.slug)
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
