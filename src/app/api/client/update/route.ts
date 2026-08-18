import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {

  try {

    const body = await request.json();

    const {
      id,
      dataNascimento,
      horaNascimento,
      cidadeNascimento,
      estadoNascimento,
      paisNascimento,
    } = body;

    const { error } = await supabase
      .from("club_clients")
      .update({
        data_nascimento: dataNascimento,
        hora_nascimento: horaNascimento,
        cidade_nascimento: cidadeNascimento,
        estado_nascimento: estadoNascimento,
        pais_nascimento: paisNascimento,
      })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Erro ao atualizar cliente.",
      },
      {
        status: 500,
      }
    );

  }

}