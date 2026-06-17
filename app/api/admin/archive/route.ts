export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabase } from "@/lib/supabase";

function auth(req: Request): boolean {
  const pw = req.headers.get("x-admin-password") ?? "";
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!pw || !expected) return false;
  const a = Buffer.from(pw.padEnd(128).slice(0, 128));
  const b = Buffer.from(expected.padEnd(128).slice(0, 128));
  return crypto.timingSafeEqual(a, b) && pw.length === expected.length;
}

export async function POST(req: Request) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { ticket_id, archived } = await req.json();
  if (!ticket_id || typeof archived !== "boolean") {
    return NextResponse.json({ error: "ticket_id and archived (boolean) required" }, { status: 400 });
  }
  const { error } = await getSupabase().from("living_table_tickets").update({ archived }).eq("id", ticket_id);
  if (error) return NextResponse.json({ error: "Update failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
