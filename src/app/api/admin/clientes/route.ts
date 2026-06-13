import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("club_clients")
    .select("*")
    .order("nome");

  if (error) {
    return NextResponse.json([]);
  }

  return NextResponse.json(data);
}