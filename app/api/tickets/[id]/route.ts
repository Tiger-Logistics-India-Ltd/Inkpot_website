export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data, error } = await getSupabase()
      .from("living_table_tickets")
      .select("id, ticket_number, buyer_name, payment_status, created_at")
      .eq("id", id)
      .eq("payment_status", "paid")
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[ticket-get]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
