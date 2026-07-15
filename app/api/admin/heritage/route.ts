export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabase } from "@/lib/supabase";

function auth(req: Request): boolean {
  const pw = req.headers.get("x-admin-password") ?? "";
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!pw || !expected) return false;
  if (pw.length > 256) return false;
  // Constant-time comparison to prevent timing attacks
  const a = Buffer.from(pw.padEnd(128).slice(0, 128));
  const b = Buffer.from(expected.padEnd(128).slice(0, 128));
  return crypto.timingSafeEqual(a, b) && pw.length === expected.length;
}

export async function GET(req: Request) {
  if (!auth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await getSupabase()
    .from("heritage_volunteers")
    .select("id, name, email, phone, affiliation, source, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[admin/heritage]", error);
    return NextResponse.json({ error: "Failed to fetch volunteers. Run create_heritage_volunteers_table.sql." }, { status: 500 });
  }

  return NextResponse.json({ volunteers: data ?? [] });
}
