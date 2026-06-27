export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const password = req.headers.get("x-admin-password");
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ticket_id } = await req.json().catch(() => ({}));
  if (!ticket_id) return NextResponse.json({ error: "ticket_id required" }, { status: 400 });

  const { getSupabase } = await import("@/lib/supabase");
  const { error } = await getSupabase()
    .from("living_table_tickets")
    .update({ checked_in: false, checked_in_at: null })
    .eq("id", ticket_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
