import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("club_clients")
    .select("*");

  console.log("DADOS:", data);
  console.log("ERRO:", error);

  return NextResponse.json({
    data,
    error,
  });
}