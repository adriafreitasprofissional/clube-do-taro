import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
  nome,
  email,
  whatsapp,
  plano,
  genero,
  senhaInicial,
  dataInicio,
} = body;

    const slug = nome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "");

    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password: senhaInicial,
        email_confirm: true,
      });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    const { error: clientError } = await supabaseAdmin
      .from("club_clients")
      .insert({
        nome,
        email,
        whatsapp,
        plano,
        genero,
        senha_inicial: senhaInicial,
        data_inicio: dataInicio,
        slug,
        status: "Ativo",
      });

    if (clientError) {
      return NextResponse.json(
        { error: clientError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      userId: authUser.user?.id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}