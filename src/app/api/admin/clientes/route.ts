import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("club_clients")
    .select("*")
    .eq("produto", "Clube do Tarô")
    .eq("status", "ativo");

  console.log("ASSINANTES CLUBE DO TARÔ:", data?.length);
  console.log("ERRO:", error);

  if (error) {
    return NextResponse.json([]);
  }

  return NextResponse.json(data);
}