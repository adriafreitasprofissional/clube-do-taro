import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const { id, dados } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID da assinante não informado." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("club_clients")
      .update(dados)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ cliente: data });
  } catch {
    return NextResponse.json(
      { error: "Não foi possível atualizar a condição." },
      { status: 500 }
    );
  }
}