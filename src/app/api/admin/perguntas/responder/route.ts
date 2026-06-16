import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  const { id } = await request.json();

  const { error } = await supabaseAdmin
    .from("exclusive_questions")
    .update({
      status: "Respondida",
      respondida_em: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
  });
}